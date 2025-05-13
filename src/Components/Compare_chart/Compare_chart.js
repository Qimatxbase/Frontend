import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function CompareChart({ category, keyword }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchCompare = async () => {
      const param = keyword
        ? `keyword=${encodeURIComponent(keyword)}`
        : `category=${encodeURIComponent(category || "health")}`;

      try {
        const res = await fetch(`http://localhost:5000/compare-sources?${param}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Chart fetch error:", err);
      }
    };

    fetchCompare();
  }, [category, keyword]);

  if (!data) return null;

  const chartData = {
    labels: ["API Articles", "Scraped Articles"],
    datasets: [
      {
        label: `Comparison for "${data.label}"`,
        data: [data.api_count, data.scraped_count],
        backgroundColor: ["#4e73df", "#1cc88a"]
      }
    ]
  };

  return (
    <div style={{ maxWidth: "500px", marginTop: "2rem" }}>
      <Bar data={chartData} />
    </div>
  );
}

export default CompareChart;