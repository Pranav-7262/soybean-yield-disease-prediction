"""Compatibility entry point for rebuilding the Maharashtra soybean model."""

from pathlib import Path
import runpy


MODEL_DIR = Path(__file__).resolve().parents[1] / "models" / "yield"


if __name__ == "__main__":
    runpy.run_path(str(MODEL_DIR / "prepare_dataset.py"), run_name="__main__")
    runpy.run_path(str(MODEL_DIR / "train.py"), run_name="__main__")
