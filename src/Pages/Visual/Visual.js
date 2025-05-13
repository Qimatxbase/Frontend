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
import "./Visual.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function Visual() {
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [data4, setData4] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      const d1 = await fetch("http://localhost:5000/data_1?category=health").then(res => res.json());
      const d2 = await fetch("http://localhost:5000/data_2?category=health").then(res => res.json());
      const d4 = await fetch("http://localhost:5000/data_4").then(res => res.json());
      setData1(d1); setData2(d2); setData4(d4);
    };
    fetchAll();
  }, []);

  if (!data1 || !data2 || !data4) return <p>Loading charts...</p>;

  return (
    <div className="visual-container">
      <h1>📊 News Visualizations</h1>

      <div className="chart-section">
        <h2>Articles per Day</h2>
        <Bar data={{
          labels: Object.keys(data1.count_by_date),
          datasets: [{
            label: data1.label,
            data: Object.values(data1.count_by_date),
            backgroundColor: "#36A2EB"
          }]
        }} />
      </div>

      <div className="chart-section">
        <h2>Articles by Source</h2>
        <Bar data={{
          labels: Object.keys(data2.count_by_source),
          datasets: [{
            label: data2.label,
            data: Object.values(data2.count_by_source),
            backgroundColor: "#FF6384"
          }]
        }} />
      </div>

      <div className="chart-section">
        <h2>Articles by Category</h2>
        <Bar data={{
          labels: Object.keys(data4.category_distribution),
          datasets: [{
            label: "Categories",
            data: Object.values(data4.category_distribution),
            backgroundColor: "#4BC0C0"
          }]
        }} />
      </div>
    </div>
  );
}

export default Visual;