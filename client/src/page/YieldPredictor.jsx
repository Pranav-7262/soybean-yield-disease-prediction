import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Thermometer,
  Droplets,
  CloudRain,
  Beaker,
  Leaf,
  RotateCcw,
  TrendingUp,
  MapPin,
  LoaderCircle,
  LocateFixed,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { api } from "../services/api";
import InputField from "../components/InputField";

const YieldPredictor = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    soil_n: "",
    soil_p: "",
    soil_k: "",
    temperature_c: "",
    humidity_percent: "",
    rainfall_mm: "",
    area_hectare: "",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading || (!authLoading && !isAuthenticated)) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (
      ["temperature_c", "humidity_percent", "rainfall_mm"].includes(name)
    ) {
      setWeatherInfo((previous) =>
        previous ? { ...previous, edited: true } : null,
      );
    }
    // allow clearing the field (empty string) but clamp negatives to 0
    if (value === "") {
      setFormData((prev) => ({ ...prev, [name]: "" }));
      return;
    }
    const num = Number(value);
    setFormData((prev) => ({
      ...prev,
      [name]: Number.isNaN(num) ? "" : Math.max(0, num),
    }));
  };

  const clearForm = () => {
    setFormData({
      soil_n: "",
      soil_p: "",
      soil_k: "",
      temperature_c: "",
      humidity_percent: "",
      rainfall_mm: "",
      area_hectare: "",
    });
    setWeatherInfo(null);
    setResult(null);
  };

  const handleGetLocalWeather = async () => {
    if (!navigator.geolocation) {
      toast.error("Location is not available in this browser");
      return;
    }

    setWeatherLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        });
      });
      const { latitude, longitude } = position.coords;
      const response = await api.yield.getCurrentWeather(latitude, longitude);
      const weather = response.data?.data;

      if (
        !weather ||
        !Number.isFinite(weather.temperature_c) ||
        !Number.isFinite(weather.humidity_percent) ||
        !Number.isFinite(weather.rainfall_mm)
      ) {
        throw new Error("Weather service returned invalid readings");
      }

      setFormData((prev) => ({
        ...prev,
        temperature_c: weather.temperature_c,
        humidity_percent: weather.humidity_percent,
        rainfall_mm: weather.rainfall_mm,
      }));
      setWeatherInfo({
        source: weather.source,
        fetched_at: weather.fetched_at,
        latitude: weather.latitude,
        longitude: weather.longitude,
        location: `${weather.latitude.toFixed(3)}, ${weather.longitude.toFixed(3)}`,
        edited: false,
      });
      toast.success("Local weather added to the forecast");
    } catch (error) {
      const message =
        error.code === 1
          ? "Location permission was denied. Allow location access or enter weather manually."
          : error.code === 2 || error.code === 3
            ? "Could not get your location. Try again or enter weather manually."
            : error.response?.data?.message ||
              error.message ||
              "Could not load local weather";
      toast.error(message);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handlePredict = async (event) => {
    event.preventDefault();
    // Basic validations: no empty fields, no negative values. Area must be > 0.
    const hasEmpty = Object.entries(formData).some(
      ([, value]) =>
        value === "" || value === null || value === undefined,
    );
    if (hasEmpty) {
      toast.error(
        "Please fill all fields (zeros are allowed where appropriate)",
      );
      return;
    }
    const hasNegative = Object.entries(formData).some(
      ([, v]) => typeof v === "number" && v < 0,
    );
    if (hasNegative) {
      toast.error("Values cannot be negative");
      return;
    }
    if (Number(formData.area_hectare) <= 0) {
      toast.error("Area must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        ...formData,
        ...(weatherInfo && { weather: weatherInfo }),
      };
      const response = await api.yield.predict(requestData);
      const payload = response.data?.data || response.data;

      if (payload) {
        setResult(payload);
        toast.success("Yield prediction completed");
      } else {
        throw new Error(response.data?.message || "Prediction failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to predict yield");
    } finally {
      setLoading(false);
    }
  };

  const humidityValue =
    formData.humidity_percent === "" ? null : formData.humidity_percent;

  return (
    <div className="page-frame relative z-10 pb-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <header className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-emerald-300">
              Field intelligence <span className="px-2 text-slate-600">/</span>
              Yield forecast
            </p>
            <h1 className="text-4xl font-bold text-white">
              Soybean yield forecast
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-7 text-slate-300">
              Enter your field readings to generate a yield estimate tailored to
              Maharashtra growing conditions.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm font-medium text-emerald-200">
            <MapPin size={17} aria-hidden="true" />
            Maharashtra calibrated
          </div>
        </header>

        <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.85fr)]">
          <form
            onSubmit={handlePredict}
            className="min-w-0 rounded-2xl border border-white/10 bg-slate-900/65 p-6 shadow-xl shadow-black/10 backdrop-blur sm:p-8"
          >
            <section aria-labelledby="soil-heading">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
                    Soil profile
                  </p>
                  <h2
                    id="soil-heading"
                    className="mt-1 text-xl font-semibold text-white"
                  >
                    Nutrient readings
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={clearForm}
                  title="Clear all fields"
                  aria-label="Clear all fields"
                  className="rounded-lg border border-white/10 p-3 text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-emerald-400"
                >
                  <RotateCcw size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                <InputField
                  label="Nitrogen (N)"
                  icon={Beaker}
                  name="soil_n"
                  value={formData.soil_n}
                  onChange={handleInputChange}
                  unit="ppm"
                />
                <InputField
                  label="Phosphorus (P)"
                  icon={Beaker}
                  name="soil_p"
                  value={formData.soil_p}
                  onChange={handleInputChange}
                  unit="ppm"
                />
                <InputField
                  label="Potassium (K)"
                  icon={Beaker}
                  name="soil_k"
                  value={formData.soil_k}
                  onChange={handleInputChange}
                  unit="ppm"
                />
              </div>
            </section>

            <section
              aria-labelledby="conditions-heading"
              className="mt-10 border-t border-white/10 pt-8"
            >
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
                  Growing conditions
                </p>
                <h2
                  id="conditions-heading"
                  className="mt-1 text-xl font-semibold text-white"
                >
                  Field &amp; weather
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Enter weather manually, or fill temperature, humidity, and
                  rainfall from your current location. Soil nutrients and field
                  area remain your own field readings.
                </p>
                <p className="mt-2 text-xs leading-5 text-amber-200/80">
                  Current weather is not a crop-season summary. For a
                  meaningful yield estimate, use values that match the periods
                  represented in the model&apos;s training data.
                </p>
              </div>

              <div className="mb-6 rounded-xl border border-cyan-300/15 bg-cyan-300/5 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-white">
                      Current local weather
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Uses your device location with your permission. Readings
                      are editable and can also be entered manually.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLocalWeather}
                    disabled={weatherLoading || loading}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15 focus-visible:outline-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {weatherLoading ? (
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <LocateFixed size={17} aria-hidden="true" />
                    )}
                    {weatherLoading
                      ? "Getting local weather"
                      : "Use my location"}
                  </button>
                </div>
                {weatherInfo && (
                  <p className="mt-3 text-xs leading-5 text-cyan-100/80">
                    Weather from {weatherInfo.source} near{" "}
                    {weatherInfo.location}, fetched{" "}
                    {new Date(weatherInfo.fetched_at).toLocaleString()}.
                    Rainfall is the provider&apos;s current precipitation
                    reading, not a crop-season total.
                    {weatherInfo.edited && " Weather values were edited."}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                <InputField
                  label="Field area"
                  icon={Leaf}
                  name="area_hectare"
                  value={formData.area_hectare}
                  onChange={handleInputChange}
                  unit="ha"
                />
                <InputField
                  label="Temperature"
                  icon={Thermometer}
                  name="temperature_c"
                  value={formData.temperature_c}
                  onChange={handleInputChange}
                  unit="°C"
                />
                <InputField
                  label="Rainfall"
                  icon={CloudRain}
                  name="rainfall_mm"
                  value={formData.rainfall_mm}
                  onChange={handleInputChange}
                  unit="mm"
                />

                <div className="sm:col-span-2 rounded-xl border border-white/10 bg-slate-950/30 p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <label
                      htmlFor="humidity_percent"
                      className="flex items-center gap-2 text-base font-medium text-slate-200"
                    >
                      <Droplets
                        size={18}
                        className="text-cyan-300"
                        aria-hidden="true"
                      />
                      Humidity
                    </label>
                    <span className="min-w-28 text-right font-mono text-base font-semibold text-cyan-200">
                      {humidityValue === null
                        ? "Set value"
                        : `${humidityValue}%`}
                    </span>
                  </div>
                  <input
                    id="humidity_percent"
                    name="humidity_percent"
                    type="range"
                    min="0"
                    max="100"
                    value={humidityValue ?? 0}
                    aria-valuetext={
                      humidityValue === null
                        ? "Not set"
                        : `${humidityValue}% humidity`
                    }
                    onChange={(e) =>
                      {
                        setWeatherInfo((previous) =>
                          previous ? { ...previous, edited: true } : null,
                        );
                        setFormData((prev) => ({
                          ...prev,
                          humidity_percent: Number(e.target.value),
                        }));
                      }
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-400 transition hover:accent-cyan-300"
                  />
                  <div className="mt-3 flex justify-between text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-4 text-lg font-semibold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={20}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  Analyzing field readings
                </>
              ) : (
                <>
                  <TrendingUp size={20} aria-hidden="true" />
                  Generate yield forecast
                </>
              )}
            </button>
          </form>

          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            aria-live="polite"
            className="min-w-0 rounded-2xl border border-emerald-300/20 bg-linear-to-br from-emerald-400/10 via-slate-900/80 to-slate-900/80 p-7 shadow-xl shadow-black/10 sm:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
                <TrendingUp size={21} aria-hidden="true" />
              </div>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] ${
                  result
                    ? "bg-emerald-300/10 text-emerald-200"
                    : "bg-white/5 text-slate-400"
                }`}
              >
                {result ? "Complete" : "Forecast"}
              </span>
            </div>

            <h2 className="mt-7 text-2xl font-semibold text-white">
              {result ? "Your yield outlook" : "Your forecast"}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-300">
              {result
                ? "Estimated soybean yield from the readings you provided."
                : "Your estimate will appear here after you submit your field readings."}
            </p>

            <div className="mt-9 border-y border-white/10 py-7">
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-slate-400">
                Predicted yield
              </p>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-5xl font-semibold tabular-nums text-white">
                  {result
                    ? Number(result?.predicted_yield) >= 0
                      ? Number(result?.predicted_yield).toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                          },
                        )
                      : 0
                    : "--"}
                </span>
                <span className="text-base font-medium text-emerald-200">
                  kg/ha
                </span>
              </div>
            </div>

            {result ? (
              <div className="mt-5 flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-400">Model accuracy</span>
                <span className="font-semibold text-emerald-200">
                  {Math.max(0, Number(result?.model_accuracy || 0))}%
                </span>
              </div>
            ) : (
              <p className="mt-6 text-sm leading-6 text-slate-400">
                Estimates are calibrated for Maharashtra conditions.
              </p>
            )}
          </motion.aside>
        </div>
      </motion.div>
    </div>
  );
};

export default YieldPredictor;
