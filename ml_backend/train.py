import numpy as np
from sklearn.ensemble import RandomForestRegressor
import pickle

# Generate synthetic solar power dataset
# Features: irradiance, temp, prevHour, prevDay, roll3, roll6
np.random.seed(42)
n_samples = 2000

# Generate realistic feature ranges
X = np.random.rand(n_samples, 6) * np.array([1000, 50, 5, 5, 5, 5])

# Create realistic target: AC power output (kW)
# Higher irradiance and lower temp = more power
# Previous values and rolling averages also influence output
y = (
    X[:, 0] * 0.004 +  # irradiance contribution
    (50 - X[:, 1]) * 0.3 +  # temperature (inverse relationship)
    X[:, 2] * 0.5 +  # prevHour
    X[:, 3] * 0.3 +  # prevDay
    X[:, 4] * 0.2 +  # roll3
    X[:, 5] * 0.15   # roll6
)
y = np.maximum(y + np.random.randn(len(y)) * 0.5, 0)  # Add noise, ensure non-negative

# Train RandomForest model
model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
model.fit(X, y)

# Save model
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print(f"✅ Model trained on {n_samples} samples")
print(f"✅ Saved model to model.pkl")
print(f"   Feature importance: {model.feature_importances_}")