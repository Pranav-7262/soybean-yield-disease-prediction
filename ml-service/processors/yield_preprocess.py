import pandas as pd

def load_and_clean_data(path):
    df = pd.read_csv(path)

    # Select important columns
    df = df[[
        'N', 'P', 'K',
        'Temperature',
        'Humidity',
        'Rainfall',
        'pH',
        'Yield'
    ]]

    # Rename for consistency
    df = df.rename(columns={
        'Temperature': 'temperature',
        'Humidity': 'soil_moisture',
        'Rainfall': 'rainfall',
        'pH': 'ph',
        'Yield': 'yield'
    })

    # Drop nulls
    df = df.dropna()

    # Maharashtra calibration
    df['temperature'] = df['temperature'].clip(25, 35)
    df['ph'] = df['ph'].clip(6.0, 7.5)

    return df