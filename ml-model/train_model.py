import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)




file = "dataset/PhiUSIIL_Phishing_URL_Dataset.csv"

df = pd.read_csv(file)

print("Dataset loaded successfully")
print("Shape:", df.shape)




features = [
    "URLLength",
    "IsHTTPS",
    "NoOfSubDomain",
    "NoOfOtherSpecialCharsInURL",
    "HasObfuscation",
    "NoOfObfuscatedChar",
    "NoOfQMarkInURL",
    "NoOfAmpersandInURL",
    "NoOfEqualsInURL"
]

X = df[features]

y = df["label"]




X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))




model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)

print("\nTraining model...")

model.fit(X_train, y_train)

print("Training completed!")




y_pred = model.predict(X_test)




accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy:", accuracy)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))
import joblib

joblib.dump(model, "phishing_model.pkl")

print("\nModel saved successfully as phishing_model.pkl")
