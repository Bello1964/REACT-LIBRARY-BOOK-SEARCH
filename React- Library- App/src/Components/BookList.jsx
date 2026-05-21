import BookItem from "./BookItem";

function BookList({ books }) {
  return (
    <div style={{ 
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
      justifyContent:"center"
      }}>
      {books.map((book) => (
        <BookItem key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BookList;