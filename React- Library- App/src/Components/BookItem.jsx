function BookItem({ book }) {
  return (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        alignItems: "center",
        borderRadius: "8px",
        background: "#fafafa",
        padding: "0.75rem",
        maxWidth: "150px"
      }}
    >
      <img
        src={book.cover}
        alt={book.title}
        style={{
          width: "150px",
          height: "200px",
          objectFit: "cover",
          borderRadius: "4px"
        }}
      />

      <div>
        <p style={{ margin: 0, fontWeight: "bold" }}>
          {book.title}
        </p>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
          {book.author}
        </p>
      </div>
    </div>
  );
}

export default BookItem;