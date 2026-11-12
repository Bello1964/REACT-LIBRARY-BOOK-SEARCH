
import { useEffect, useRef } from "react";

function BookDetailsDialog({
  book,
  onClose,
  onSummarize,
  summarizing,
  summary,
  summaryError,
}) {
  const dialogRef = useRef(null);
useEffect(() => {
  if (!book) return;

  const dialog = dialogRef.current;
  if (!dialog) return;

  const getFocusableElements = () =>
    dialog.querySelectorAll(
      'a[href], button:not(:disabled), input:not(:disabled), ' +
        'select:not(:disabled), textarea:not(:disabled), ' +
        '[tabindex]:not([tabindex="-1"])'
    );

  const closeButton = dialog.querySelector(
    'button[aria-label="Close book details"]'
  );

  closeButton?.focus();

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = Array.from(getFocusableElements());

    if (focusable.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === last
    ) {
      event.preventDefault();
      first.focus();
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [book, onClose]);

  if (!book) return null;

  const editionSearch = `https://openlibrary.org/search?q=${encodeURIComponent(
    `${book.title} ${book.author}`
  )}`;

  return (
    <div
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-dialog-title"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxSizing: "border-box",
          padding: "1.5rem",
          borderRadius: "12px",
          background: "#fff",
          color: "#222",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close book details"
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            border: "none",
            background: "transparent",
            fontSize: "1.8rem",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <h2 id="book-dialog-title" style={{ paddingRight: "2rem" }}>
          {book.title}
        </h2>

        <p>By {book.author}</p>

        <p>
          <strong>Free-access status:</strong>{" "}
          {book.ebookAccess === "public"
            ? "Open Library reports public ebook access."
            : book.ebookAccess === "borrowable"
              ? "Borrowing may be available; restrictions may apply."
              : book.ebookAccess === "printdisabled"
                ? "Access may be restricted to eligible readers."
                : book.ebookAccess === "restricted"
                  ? "Access is restricted."
                  : "Free full-text access has not been confirmed."}
        </p>

        {book.accessUrl && (
          <p>
            <a
              href={book.accessUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View official book page and reading options
            </a>
          </p>
        )}

        <p>
          <a href={editionSearch} target="_blank" rel="noopener noreferrer">
            Search Open Library for other editions
          </a>
        </p>

        <button
          type="button"
          onClick={onSummarize}
          disabled={summarizing}
        >
          {summarizing ? "Generating summary..." : "Summarize"}
        </button>

        {summarizing && <p role="status">Generating the summary…</p>}

        {summaryError && (
          <p role="alert" style={{ color: "crimson" }}>
            {summaryError}
          </p>
        )}

        {summary && (
          <article style={{ marginTop: "1rem", lineHeight: 1.7 }}>
            <h3>AI-generated summary</h3>
            <p>
              This AI-generated summary has not been verified against the
              original book text.
            </p>
            <div style={{ whiteSpace: "pre-wrap" }}>{summary}</div>
          </article>
        )}
      </section>
    </div>
  );
}

export default BookDetailsDialog;
