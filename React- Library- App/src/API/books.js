export const getBooks = async (query) => {
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await res.json();

  return data.docs.slice(0, 40).map((book, index) => ({
    id: index,
    title: book.title,
    author: book.author_name?.[0] || "Unknown Author",
    cover: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : "https://via.placeholder.com/60x90",
  }));
};