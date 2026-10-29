# Maharashtra soybean yield model

## Rebuild

From `ml-service`, install `pandas`, `numpy`, `scikit-learn`, `joblib`, and
`requests` in the ML service environment, then run:

```sh
python models/yield/prepare_dataset.py
python models/yield/train.py
```

The preparation step downloads the pinned crop-production table and retrieves
June-September weather summaries from the NASA POWER Daily API. It writes
`maharashtra_soybean_training.csv`; training writes the deployable
`soybean_yield_model.joblib` and its `soybean_yield_metrics.json` metadata.
The legacy `yeild-prediction/model.py` entry point delegates to these steps.

## Data and validation

The crop-production labels come from a public GitHub mirror pinned to commit
`df51a358b57d32055deb77f346101e2895a68ca3`. The original provenance and license
of that mirror have not been independently verified. Yield is derived from the
table's production and area fields. Seasonal rainfall, temperature, and
humidity are calculated from NASA POWER daily readings for June through
September.

The dataset contains 448 Maharashtra Kharif soybean district-years from
1998-2014 across 29 districts. The model uses district and seasonal weather;
soil N/P/K are retained by the application but are not model features because
matching historical soil-test data was unavailable. Field area scales the
per-hectare estimate to an estimated total, but does not affect estimated
yield per hectare.

Validation trains on 1998-2011 and tests on 2012-2014 (84 observations). The
current model's holdout MAE is 394.82 kg/ha and R² is 0.4568, compared with
462.82 kg/ha MAE for the district-average baseline. These are historical
aggregate metrics, not a probability or guarantee for an individual field.
The labels end in 2014, so this model should be treated as a coarse planning
reference, not a current-season agronomic forecast.
