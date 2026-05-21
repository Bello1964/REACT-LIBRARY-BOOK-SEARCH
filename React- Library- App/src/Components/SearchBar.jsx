import { useEffect, useState } from "react";
import fetchBooks from "../App.jsx"

function SearchBar({ onSearch }) {
  const [input, setInput] = useState("Adventure");

  useEffect(() => {
    if (!input.trim()) return;

    const timeout = setTimeout(() => {
      onSearch(input);
    }, 500);

    return () => clearTimeout(timeout);
  }, [input]);

  return (
    <div style={{ marginBottom: "1rem" }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search books..."
        style={{
      padding: "0.6rem",
      borderRadius: "6px",
      border: "1px solid #ddd",
      outline: "none",
      width: "100%",
      fontSize: "0.95rem",
    }}
        onKeyDown={(e) => {
          e.key === "Enter" && onSearch(input);
        }}
      />
    </div>
  );
}

export default SearchBar;