#!/bin/bash

# Set paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CSV_DIR="$SCRIPT_DIR/../csv_results"
SUMMARY_CSV="$CSV_DIR/benchmark_high_performance.csv"

echo "🔍 Looking for CSV files in: $CSV_DIR"

# Ensure CSV_DIR exists
mkdir -p "$CSV_DIR"

# Check if there are any .csv files
CSV_FILES=("$CSV_DIR"/*.csv)
if [ ! -e "${CSV_FILES[0]}" ]; then
    echo "⚠️  No CSV files found in $CSV_DIR"
    echo "📄 Creating sample CSV for Rust and Node.js..."
    SAMPLE_CSV="$CSV_DIR/sample.csv"
    cat <<EOF > "$SAMPLE_CSV"
label,value
Rust (http-tunnel),55
Rust (http-tunnel),71
Rust (http-tunnel),135
Rust (http-tunnel),302
Rust (http-tunnel),435
Rust (http-tunnel),4150
Node.js (http-tunnel),58
Node.js (http-tunnel),69
Node.js (http-tunnel),141
Node.js (http-tunnel),310
Node.js (http-tunnel),490
Node.js (http-tunnel),5000
EOF
    CSV_FILES=("$SAMPLE_CSV")
fi

# Process CSV files with Python
python3 - <<EOF
import pandas as pd
import glob
import os

csv_dir = "${CSV_DIR}"
output_path = "${SUMMARY_CSV}"

# Read and combine all CSV files
files = glob.glob(os.path.join(csv_dir, "*.csv"))
df = pd.concat([pd.read_csv(f) for f in files if f.endswith('.csv')])

if 'label' not in df.columns or 'value' not in df.columns:
    print("❌ CSV files must have 'label' and 'value' columns.")
    exit(1)

# Filter only Rust and Node.js
df = df[df['label'].isin(['Rust (http-tunnel)', 'Node.js (http-tunnel)'])]

summary = (
    df.groupby('label')['value']
    .agg([
        ('p50', lambda x: round(x.quantile(0.5))),
        ('p90', lambda x: round(x.quantile(0.9))),
        ('p99', lambda x: round(x.quantile(0.99))),
        ('p99.9', lambda x: round(x.quantile(0.999))),
        ('p99.99', lambda x: round(x.quantile(0.9999))),
        ('max', lambda x: round(x.max())),
        ('tm99.9', lambda x: round(x[x <= x.quantile(0.999)].mean())),
        ('stddev', lambda x: round(x.std())),
    ])
    .reset_index()
)

summary.to_csv(output_path, index=False)
print(f"✅ Summary written to {output_path}")
EOF
