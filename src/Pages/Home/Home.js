import CompareChart from "../../Components/Compare_chart/Compare_chart";
import React, { useState } from "react";
import "./Home.css";

function Home() {
  const [mode, setMode] = useState("category");
  const [category, setCategory] = useState("health");
  const [keyword, setKeyword] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchNews = async () => {
    const param = mode === "category" ? `category=${category}` : `keyword=${keyword.trim()}`;
    if (!param.includes("=") || param.endsWith("=")) {
      return alert("Please select or enter a valid value.");
    }

    setLoading(true);
    setArticles([]);
    setErrorMessage("");

    try {
      const res = await fetch(`http://localhost:5000/get-news?${param}`);
      if (res.status === 404) {
        setErrorMessage("No articles found for this input.");
        return;
      }

      const data = await res.json();
      const sorted = data
        .filter(a => a.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setArticles(sorted);
    } catch (err) {
      console.error("Error fetching news:", err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h1>📰 News Dashboard</h1>

      <div>
        <label>
          <input
            type="radio"
            value="category"
            checked={mode === "category"}
            onChange={() => { setMode("category"); setErrorMessage(""); }}
          />
          Category
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            value="keyword"
            checked={mode === "keyword"}
            onChange={() => { setMode("keyword"); setErrorMessage(""); }}
          />
          Keyword
        </label>
      </div>

      {mode === "category" ? (
        <div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="category-select">
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
            onChange={e => setKeyword(e.target.value)}
          />
        </div>
      )}

      <div className="get-news-button">
        <button onClick={fetchNews}>Get News</button>
      </div>

      {loading && <p>⏳ Loading...</p>}
      
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {articles.length > 0 && (
  <>
    <div className="article-list">
      <h2>Top Articles for “{mode === "keyword" ? keyword : category}”</h2>
      <ul>
        {articles.map((a, i) => (
          <li key={i} className="article-item">
            <strong>{a.title}</strong><br />
            <small>{a.source} | {a.date?.slice(0, 10)}</small><br />
            <p>{a.content?.slice(0, 200)}...</p>
          </li>
        ))}
      </ul>
    </div>

    <CompareChart
      category={mode === "category" ? category : null}
      keyword={mode === "keyword" ? keyword : null}
    />
  </>
)}
    </div>
  );
}

export default Home;