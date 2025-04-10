#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CSV_DIR="$SCRIPT_DIR/../csv_results"
SUMMARY_FILE="$CSV_DIR/summary.csv"
PLOT_DIR="$SCRIPT_DIR/../plots"
PLOT_FILE="$PLOT_DIR/summary_plot_$(date +%Y%m%d_%H%M%S).png"

mkdir -p "$PLOT_DIR"

echo "🔍 Looking for CSV files in: $CSV_DIR"
ls "$CSV_DIR"/*.csv

# Reset summary
echo "step,average,min,max,count" > "$SUMMARY_FILE"

# Tạm file chứa toàn bộ dữ liệu gộp
TMP_FILE=$(mktemp)

# Gộp dữ liệu từ các CSV
for file in "$CSV_DIR"/*.csv; do
    [[ "$file" == *"summary.csv" ]] && continue
    echo "📊 Processing $file"

    header=$(head -1 "$file")
    if [[ "$header" == *"time_in_seconds"* ]]; then
        tail -n +2 "$file" | cut -d',' -f1,2 >> "$TMP_FILE"
    elif [[ "$header" == *"duration(s)"* ]]; then
        tail -n +2 "$file" | cut -d',' -f1,2 >> "$TMP_FILE"
    fi
done

# Tính toán summary
awk -F',' '
{
    step=$1
    time=$2
    count[step]++
    sum[step]+=time
    if ((min[step] == "") || (time < min[step])) min[step]=time
    if ((max[step] == "") || (time > max[step])) max[step]=time
}
END {
    for (s in sum) {
        avg=sum[s]/count[s]
        printf "%s,%.3f,%.3f,%.3f,%d\n", s, avg, min[s], max[s], count[s]
    }
}
' "$TMP_FILE" | sort >> "$SUMMARY_FILE"

rm "$TMP_FILE"
echo "✅ Summary CSV saved to $SUMMARY_FILE"

# Vẽ biểu đồ nếu có flag --plot-summary
if [[ "$1" == "--plot-summary" ]]; then
    echo "📈 Plotting summary chart to $PLOT_FILE"
    gnuplot -persist <<-EOF
        set datafile separator ","
        set terminal png size 1200,600
        set output "$PLOT_FILE"
        set title "Benchmark Summary: Avg / Min / Max"
        set xlabel "Step"
        set ylabel "Time (s)"
        set style data histogram
        set style histogram cluster gap 1
        set style fill solid border -1
        set boxwidth 0.9
        set xtics rotate by -45
        set key outside top right
        plot "$SUMMARY_FILE" using 2:xtic(1) title "Avg", \
             '' using 3 title "Min", \
             '' using 4 title "Max"
EOF
    echo "✅ Summary plot saved to $PLOT_FILE"
fi
