import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Home.css";

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const [mode, setMode] = useState("category");
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [compareData, setCompareData] = useState(null);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchAllNews();
  }, []);

  const fetchAllNews = async () => {
    setCompareData(null);
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/get-all-news`);
      if (!res.ok) throw new Error("No data");
      const data = await res.json();
      const sorted = (data.articles || [])
        .filter((a) => a.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setArticles(sorted);
      setCurrentPage(1);
    } catch (err) {
      setErrorMessage("Something went wrong loading all news.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async () => {
    setCompareData(null);
    if (mode === "category" && category === "") {
      fetchAllNews();
      return;
    }

    const param =
      mode === "category"
        ? `category=${category}`
        : `keyword=${keyword.trim()}`;

    if (!param.includes("=") || param.endsWith("=")) {
      return alert("Please select or enter a valid value.");
    }

    setLoading(true);
    setArticles([]);
    setErrorMessage("");
    setCurrentPage(1);

    try {
      const res = await fetch(`http://localhost:5000/get-news?${param}`);
      if (res.status === 404) {
        setErrorMessage("No articles found for this input.");
        return;
      }
      const data = await res.json();
      const sorted = (data.articles || [])
        .filter((a) => a.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setArticles(sorted);
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const crawlNews = async () => {
    setCompareData(null);
    setLoading(true);
    setErrorMessage("");
    try {
      const param =
        mode === "category"
          ? category === ""
            ? ""
            : `category=${category}`
          : `keyword=${keyword.trim()}`;

      const url = param
        ? `http://localhost:5000/crawl-news?${param}`
        : `http://localhost:5000/crawl-news`;

      const res = await fetch(url, { method: "POST" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      alert(result.message);
      fetchNews();
    } catch (err) {
      setErrorMessage("Crawl failed.");
    } finally {
      setLoading(false);
    }
  };

  const compareSources = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch(`http://localhost:5000/compare-sources`);
      if (!res.ok) throw new Error("Error");
      const data = await res.json();
      if (
        !data ||
        typeof data !== "object" ||
        data.total_newsapi === undefined ||
        data.total_guardian === undefined
      ) {
        setErrorMessage("No data returned from server.");
        setLoading(false);
        return;
      }
      setCompareData({
        label: data.label,
        newsapi: data.total_newsapi,
        guardian: data.total_guardian,
        ohter: data.total_other,
      });
    } catch (err) {
      setErrorMessage("Compare failed.");
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = articles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  return (
    <div className="home-container">
      <h1>News Dashboard</h1>

      <div>
        <label>
          <input
            type="radio"
            value="category"
            checked={mode === "category"}
            onChange={() => {
              setMode("category");
              setErrorMessage("");
              setCompareData(null);
            }}
          />
          Category
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            value="keyword"
            checked={mode === "keyword"}
            onChange={() => {
              setMode("keyword");
              setErrorMessage("");
              setCompareData(null);
            }}
          />
          Keyword
        </label>
      </div>

      {mode === "category" ? (
        <div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCompareData(null);
              fetchNews();
            }}
            className="category-select"
          >
            <option value="">All Categories</option>
            <option value="health">Health</option>
            <option value="business">Business</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
          </select>
        </div>
      ) : (
        <div className="custom-category-input">
          <input
            type="text"
            placeholder="Enter keyword (e.g., climate change)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      )}

      <div className="get-news-button">
        <button onClick={fetchNews}>Refresh News</button>
        <button onClick={crawlNews}>Update News</button>
        <button onClick={compareSources}>Compare Source</button>
      </div>

      {loading && <p>Loading...</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {(articles.length > 0 || compareData) && (
        <div className="content-wrapper">
          {articles.length > 0 && (
            <div className="article-list">
              <h2>Top Articles</h2>
              <ul>
                {currentArticles.map((a, i) => (
                  <li key={i} className="article-item">
                    <strong>{a.title}</strong>
                    <br />
                    <small>
                      {a.source} | {a.date?.slice(0, 10)}
                    </small>
                    <br />
                    <small>
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {a.url}
                      </a>
                    </small>
                  </li>
                ))}
              </ul>
              <div className="pagination">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  {" "}
                  Page {currentPage} of {totalPages}{" "}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {compareData && (
            <div className="chart-wrapper">
              <Pie
                data={{
                  labels: ["NewsAPI", "The Guardian","Other"],
                  datasets: [
                    {
                      data: [compareData.newsapi, compareData.guardian,compareData.other],
                      backgroundColor: ["#007bff", "#28a745","#c04b4b"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true, position: "bottom" },
                    title: {
                      display: true,
                      text: "Articles Distribution by Source",
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
