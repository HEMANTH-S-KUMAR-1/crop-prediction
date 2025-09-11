import pandas as pd

# Load the dataset
df = pd.read_csv('crop_data.csv')

print(f"Dataset size: {len(df)} rows, {len(df.columns)} columns")
print(f"Features: {list(df.columns[:-1])}")
print(f"Target variable: {df.columns[-1]}")
print(f"\nUnique crops ({df['Label'].nunique()} total):")
crops = df['Label'].unique()
for crop in sorted(crops):
    print(f"  - {crop}")

print(f"\nDataset distribution:")
print(df['Label'].value_counts())

print(f"\nBasic statistics:")
print(df.describe())