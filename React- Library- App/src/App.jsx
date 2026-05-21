import { useEffect, useState } from "react";
import { getBooks } from "./api/books";
import BookList from "./Components/BookList";
import SearchBar from "./Components/SearchBar";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("explorer");

  const fetchBooks = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getBooks(searchTerm);
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = () => {
    fetchBooks(query);
  };

  return (
    <div
    style={{
      maxWidth: "1000px",
      minWidth: "250px",
      margin: "0 auto",
      padding: "2rem 1rem",
      fontFamily: "system-ui, sans-serif",
      
    }}
  >
      <h1>Library</h1>

      {/* Search UI */}
     <SearchBar onSearch={fetchBooks}/>

      {/* States */}
      {loading && <p>Loading books...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && <BookList books={books} />}
      </div>
  );
}

export default App;