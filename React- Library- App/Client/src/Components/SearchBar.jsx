
import { useEffect, useState } from "react";

function SearchBar({ onSearch }) {
  const [input, setInput] = useState("Adventure");

  useEffect(() => {
    const query = input.trim();
    if (!query) return;

    const timeout = setTimeout(() => {
      onSearch(query);
    }, 500);

    return () => clearTimeout(timeout);
  }, [input, onSearch]);

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="book-search" style={{ display: "block" }}>
        Search books
      </label>
      <input
        id="book-search"
        type="search"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Search books..."
        style={{
          boxSizing: "border-box",
          padding: "0.6rem",
          borderRadius: "6px",
          border: "1px solid #ddd",
          outline: "none",
          width: "100%",
          fontSize: "0.95rem",
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && input.trim()) {
            onSearch(input.trim());
          }
        }}
      />
    </div>
  );
}

export default SearchBar;
