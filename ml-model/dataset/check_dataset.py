import pandas as pd

file = "PhiUSIIL_Phishing_URL_Dataset.csv"

df = pd.read_csv(file)

print("Columns:")
print(df.columns.tolist())

print("\nDataset shape:")
print(df.shape)

print("\nLabel values:")
print(df["label"].value_counts())

print("\nFirst row:")
print(df.iloc[0])

print("\nPossible URL columns:")
for column in df.columns:
    if "url" in column.lower():
        print(column)

print("\nLabel distribution:")
print(df["label"].value_counts())
