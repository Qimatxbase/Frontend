import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
} from "chart.js";
import "./Visual.css";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
);

function Visual() {
  const [chart1, setChart1] = useState(null);
  const [chart2, setChart2] = useState(null);
  const [chart3, setChart3] = useState(null);
  const [chart4, setChart4] = useState(null);
  const [chart5, setChart5] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      const c1 = await fetch("http://localhost:5000/chart1").then(res => res.json());
      const c2 = await fetch("http://localhost:5000/chart2").then(res => res.json());
      const c3 = await fetch("http://localhost:5000/chart3").then(res => res.json());
      const c4 = await fetch("http://localhost:5000/chart4").then(res => res.json());
      const c5 = await fetch("http://localhost:5000/chart5").then(res => res.json());
      setChart1(c1); setChart2(c2); setChart3(c3); setChart4(c4); setChart5(c5);
    };
    fetchAll();
  }, []);

  if (!chart1 || !chart2 || !chart3 || !chart4 || !chart5) return <p>Loading charts...</p>;

  return (
    <div className="visual-container">
      {/* <h1>News Visualizations</h1> */}

      {/* Row 1: Chart1 + Chart4 */}
      <div className="row-top">
        <div className="chart-section">
          <h2>Articles by Category</h2>
          <Bar data={{
            labels: Object.keys(chart1.count_by_category),
            datasets: [{
              label: "Categories",
              data: Object.values(chart1.count_by_category),
              backgroundColor: "#4BC0C0"
            }]
          }} />
        </div>

        <div className="chart-section">
          <h2>Article Trends by Source</h2>
          {!chart4.news_article_trends ? (
            <p>No data for chart 4</p>
          ) : (
            (() => {
              const trends = chart4.news_article_trends;
              const allDates = Array.from(new Set(
                Object.values(trends).flatMap(sourceData => Object.keys(sourceData))
              )).sort();

              const datasets = Object.entries(trends).map(([source, data], index) => ({
                label: source,
                data: allDates.map(date => data[date] || 0),
                fill: false,
                borderColor: ['#FF6384', '#36A2EB', '#4BC0C0', '#9966FF', '#FF9F40'][index % 5],
                tension: 0.1
              }));

              return (
                <Line
                  data={{
                    labels: allDates,
                    datasets: datasets
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: "Article Trends Over Time by Source"
                      }
                    },
                    scales: {
                      y: { beginAtZero: true }
                    }
                  }}
                />
              );
            })()
          )}
        </div>
      </div>

      {/* Row 2: Chart3 + Chart2 + Chart5 */}
      <div className="row-bottom">
        <div className="chart-section">
          <h2>Author Availability</h2>
          <Pie data={{
            labels: ["With Author", "Without Author"],
            datasets: [{
              data: [
                chart3.author_availability.with_author,
                chart3.author_availability.without_author
              ],
              backgroundColor: ["#4BC0C0", "#FF6384"]
            }]
          }} />
        </div>

        <div className="chart-section">
          <h2>Articles per Day</h2>
          <Bar data={{
            labels: Object.keys(chart2.count_by_date),
            datasets: [{
              label: "Articles",
              data: Object.values(chart2.count_by_date),
              backgroundColor: "#36A2EB"
            }]
          }} />
        </div>

        <div className="chart-section">
          <h2>Articles by Category and Source</h2>
          {chart5.fo && (
            <Bar
              data={{
                labels: Object.keys(chart5.category_by_source),
                datasets: Array.from(
                  new Set(
                    Object.values(chart5.category_by_source)
                      .flatMap(obj => Object.keys(obj))
                  )
                ).map((source, index) => ({
                  label: source,
                  data: Object.keys(chart5.category_by_source).map(
                    category => chart5.category_by_source[category][source] || 0
                  ),
                  backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0', '#9966FF', '#FF9F40'][index % 5]
                }))
              }}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: "Articles per Category by Source"
                  }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Visual;
