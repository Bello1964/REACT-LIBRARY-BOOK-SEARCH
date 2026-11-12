import BookItem from "./BookItem";

function BookList({ books, onSelect, selectedBook, cardRefs }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
        gap: "1rem",
        alignItems: "start",
      }}
    >
      {books.map((book, index) => (
        <BookItem
          key={book.id}
          book={book}
          onSelect={onSelect}
          selected={selectedBook?.id === book.id}
          buttonRef={(element) => {
            cardRefs.current[index] = element;
          }}
        />
      ))}
    </div>
  );
}

export default BookList;