"""Build a district-season soybean yield dataset from public production and weather data."""

from __future__ import annotations

import json
import time
from datetime import date
from io import BytesIO
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[3]
OUTPUT_PATH = PROJECT_ROOT / "ml-service" / "models" / "yield" / "maharashtra_soybean_training.csv"
SOURCE_URL = (
    "https://raw.githubusercontent.com/DUDIMETLA-SWATHI/crop-production/"
    "df51a358b57d32055deb77f346101e2895a68ca3/"
    "Crop%20Production%20data.csv"
)
NASA_POWER_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"

# Representative district-headquarter coordinates for extracting the NASA POWER grid cell.
DISTRICT_COORDINATES = {
    "AHMEDNAGAR": (19.0948, 74.7480),
    "AKOLA": (20.7002, 77.0082),
    "AMRAVATI": (20.9374, 77.7796),
    "AURANGABAD": (19.8762, 75.3433),
    "BEED": (18.9891, 75.7601),
    "BHANDARA": (21.1669, 79.6500),
    "BULDHANA": (20.5293, 76.1840),
    "CHANDRAPUR": (19.9615, 79.2961),
    "DHULE": (20.9042, 74.7749),
    "GADCHIROLI": (20.1809, 80.0030),
    "GONDIA": (21.4624, 80.2209),
    "HINGOLI": (19.7190, 77.1484),
    "JALGAON": (21.0077, 75.5626),
    "JALNA": (19.8347, 75.8816),
    "KOLHAPUR": (16.7050, 74.2433),
    "LATUR": (18.4088, 76.5604),
    "NAGPUR": (21.1458, 79.0882),
    "NANDED": (19.1383, 77.3210),
    "NANDURBAR": (21.3667, 74.2400),
    "NASHIK": (19.9975, 73.7898),
    "OSMANABAD": (18.1860, 76.0419),
    "PARBHANI": (19.2608, 76.7748),
    "PUNE": (18.5204, 73.8567),
    "SANGLI": (16.8524, 74.5815),
    "SATARA": (17.6805, 74.0183),
    "SOLAPUR": (17.6599, 75.9064),
    "WARDHA": (20.7453, 78.6022),
    "WASHIM": (20.1110, 77.1330),
    "YAVATMAL": (20.3899, 78.1307),
}


def _read_url(url: str, timeout: int = 60) -> bytes:
    request = Request(url, headers={"User-Agent": "soybean-yield-model/2.0"})
    with urlopen(request, timeout=timeout) as response:
        return response.read()


def _seasonal_weather(district: str, latitude: float, longitude: float) -> list[dict]:
    params = {
        "parameters": "PRECTOTCORR,T2M,RH2M",
        "community": "AG",
        "longitude": longitude,
        "latitude": latitude,
        "start": "19980101",
        "end": "20141231",
        "format": "JSON",
    }
    payload = json.loads(_read_url(f"{NASA_POWER_URL}?{urlencode(params)}"))
    values = payload.get("properties", {}).get("parameter", {})
    rainfall = values.get("PRECTOTCORR", {})
    temperature = values.get("T2M", {})
    humidity = values.get("RH2M", {})
    if not rainfall or not temperature or not humidity:
        raise ValueError(f"NASA POWER returned incomplete weather for {district}")

    annual_values: dict[int, dict[str, list[float]]] = {}
    for day_text, rainfall_value in rainfall.items():
        day = date.fromisoformat(f"{day_text[:4]}-{day_text[4:6]}-{day_text[6:]}")
        if day.month < 6 or day.month > 9:
            continue
        year_values = annual_values.setdefault(
            day.year, {"rainfall": [], "temperature": [], "humidity": []}
        )
        year_values["rainfall"].append(float(rainfall_value))
        year_values["temperature"].append(float(temperature[day_text]))
        year_values["humidity"].append(float(humidity[day_text]))

    weather = []
    for year, year_values in annual_values.items():
        if len(year_values["rainfall"]) < 120:
            raise ValueError(
                f"NASA POWER returned incomplete June-September coverage "
                f"for {district} in {year}"
            )
        if any(value == -999 for values in year_values.values() for value in values):
            raise ValueError(f"NASA POWER returned missing values for {district} in {year}")
        weather.append(
            {
                "district": district,
                "year": year,
                "rainfall_mm": sum(year_values["rainfall"]),
                "temperature_c": sum(year_values["temperature"])
                / len(year_values["temperature"]),
                "humidity_percent": sum(year_values["humidity"])
                / len(year_values["humidity"]),
            }
        )
    return weather


def build_dataset() -> pd.DataFrame:
    source = pd.read_csv(BytesIO(_read_url(SOURCE_URL)))
    source["State_Name"] = source["State_Name"].astype(str).str.strip().str.casefold()
    source["District_Name"] = source["District_Name"].astype(str).str.strip().str.upper()
    source["Crop"] = source["Crop"].astype(str).str.strip().str.casefold()
    source["Season"] = source["Season"].astype(str).str.strip().str.casefold()
    soybean = source.loc[
        (source["State_Name"] == "maharashtra")
        & source["Crop"].isin({"soyabean", "soybean"})
        & (source["Season"] == "kharif")
    ].copy()
    if soybean.empty:
        raise ValueError("The production source contained no Maharashtra Kharif soybean rows")

    unknown_districts = sorted(set(soybean["District_Name"]) - DISTRICT_COORDINATES.keys())
    if unknown_districts:
        raise ValueError(f"Missing district coordinates for: {', '.join(unknown_districts)}")

    soybean["Area"] = pd.to_numeric(soybean["Area"], errors="coerce")
    soybean["Production"] = pd.to_numeric(soybean["Production"], errors="coerce")
    soybean["Crop_Year"] = pd.to_numeric(soybean["Crop_Year"], errors="coerce")
    soybean = soybean.dropna(subset=["Area", "Production", "Crop_Year"])
    soybean = soybean.loc[(soybean["Area"] > 0) & (soybean["Production"] > 0)]
    production = (
        soybean.groupby(["District_Name", "Crop_Year"], as_index=False)
        .agg(area_hectare=("Area", "sum"), production_tonnes=("Production", "sum"))
        .rename(columns={"District_Name": "district", "Crop_Year": "year"})
    )
    production["yield_kg_per_hectare"] = (
        production["production_tonnes"] * 1000 / production["area_hectare"]
    )
    production["year"] = production["year"].astype(int)

    weather_rows = []
    for index, (district, (latitude, longitude)) in enumerate(
        sorted(DISTRICT_COORDINATES.items())
    ):
        weather_rows.extend(_seasonal_weather(district, latitude, longitude))
        if index < len(DISTRICT_COORDINATES) - 1:
            time.sleep(0.25)
    weather = pd.DataFrame(weather_rows)

    dataset = production.merge(
        weather,
        on=["district", "year"],
        how="inner",
        validate="one_to_one",
    )
    dataset = dataset.sort_values(["year", "district"]).reset_index(drop=True)
    if len(dataset) < 200:
        raise ValueError(f"Only {len(dataset)} aligned observations were built; refusing to train")
    if dataset[["yield_kg_per_hectare", "rainfall_mm", "temperature_c", "humidity_percent"]].isna().any().any():
        raise ValueError("The aligned dataset contains missing target or model features")
    return dataset


if __name__ == "__main__":
    result = build_dataset()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    result.to_csv(OUTPUT_PATH, index=False, float_format="%.4f")
    print(
        f"Wrote {len(result)} district-year observations for "
        f"{result['district'].nunique()} districts "
        f"({result['year'].min()}-{result['year'].max()}) to {OUTPUT_PATH}"
    )
