
function BookItem({ book, onSelect, selected, buttonRef }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => onSelect(book)}
      aria-pressed={selected}
      aria-label={`View details for ${book.title} by ${book.author}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "0.6rem",
        boxSizing: "border-box",
        width: "100%",
        height: "330px",
        padding: "0.75rem",
        borderRadius: "8px",
        border: selected ? "2px solid #2563eb" : "1px solid #e5e7eb",
        background: "#fafafa",
        color: "inherit",
        font: "inherit",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "200px",
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          style={{
            maxWidth: "100%",
            maxHeight: "200px",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            borderRadius: "4px",
          }}
        />
      </div>

      <div style={{ width: "100%", minWidth: 0 }}>
        <div
          title={book.title}
          style={{
            fontWeight: "bold",
            height: "2.7em",
            lineHeight: "1.35",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflowWrap: "anywhere",
          }}
        >
          {book.title}
        </div>

        <div
          title={book.author}
          style={{
            marginTop: "0.25rem",
            height: "1.3em",
            fontSize: "0.85rem",
            color: "#555",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {book.author}
        </div>
      </div>
    </button>
  );
}

export default BookItem;
