
import { useCallback, useEffect, useRef, useState } from "react";

import { getBooks } from "./API/books";
import { summarizeBook } from "./API/summarizeBook";

import BookList from "./Components/BookList";
import BookDetailsDialog from "./Components/BookDetailsDialog";
import SearchBar from "./Components/SearchBar";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedBook, setSelectedBook] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [summary, setSummary] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [summarizing, setSummarizing] = useState(false);

  const cardRefs = useRef([]);
  const previouslyFocusedCard = useRef(null);
  const requestInProgress = useRef(false);

  const fetchBooks = useCallback(async (searchTerm) => {
    if (!searchTerm?.trim()) return;

    try {
      setLoading(true);
      setError("");

      const data = await getBooks(searchTerm);

      setBooks(data);
      setSelectedBook(null);
      setDialogOpen(false);
      setSummary("");
      setSummaryError("");
    } catch (err) {
      setError(err.message || "Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks("explorer");
  }, [fetchBooks]);

  const selectBook = useCallback((book) => {
    previouslyFocusedCard.current = document.activeElement;

    setSelectedBook(book);
    setDialogOpen(true);
    setSummary("");
    setSummaryError("");
  }, []);

  const closeBookDetails = useCallback(() => {
    setDialogOpen(false);
    setSummary("");
    setSummaryError("");

    requestAnimationFrame(() => {
      previouslyFocusedCard.current?.focus();
    });
  }, []);

  const handleSummarize = useCallback(async () => {
    if (!selectedBook || requestInProgress.current) return;

    requestInProgress.current = true;
    setSummarizing(true);
    setSummary("");
    setSummaryError("");

    try {
      const result = await summarizeBook({
        title: selectedBook.title,
        author: selectedBook.author,
      });

      setSummary(result.summary || "");
    } catch (err) {
      setSummaryError(
        err.message || "Unable to generate a summary. Please try again."
      );
    } finally {
      requestInProgress.current = false;
      setSummarizing(false);
    }
  }, [selectedBook]);

  return (
    <main
      style={{
        maxWidth: "1000px",
        minWidth: "250px",
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>Library</h1>

      <SearchBar onSearch={fetchBooks} />

      {loading && <p role="status">Loading books...</p>}

      {error && (
        <div role="alert" style={{ color: "red" }}>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => fetchBooks("explorer")}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <BookList
          books={books}
          onSelect={selectBook}
          selectedBook={selectedBook}
          cardRefs={cardRefs}
        />
      )}

      <BookDetailsDialog
        book={dialogOpen ? selectedBook : null}
        onClose={closeBookDetails}
        onSummarize={handleSummarize}
        summarizing={summarizing}
        summary={summary}
        summaryError={summaryError}
      />
    </main>
  );
}

export default App;
