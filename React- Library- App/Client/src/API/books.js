
const SEARCH_URL = "https://openlibrary.org/search.json";

export const getBooks = async (query) => {
  const params = new URLSearchParams({
    q: query,
    limit: "40",
    fields:
      "key,title,author_name,cover_i,edition_key,isbn,ebook_access,ia,public_scan_b",
  });

  const res = await fetch(`${SEARCH_URL}?${params}`);

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await res.json();

  return data.docs.map((book) => {
    const workKey = book.key || null;
    const editionKey = book.edition_key?.[0] || null;
    const ebookAccess = book.ebook_access || "unknown";

    const hasReportedAccess = [
      "public",
      "borrowable",
      "printdisabled",
      "restricted",
    ].includes(ebookAccess);

    const accessKey = editionKey || workKey;

    return {
      // Stable bibliographic identifier; instead of an array index
      id: workKey || editionKey || `${book.title}-${book.author_name?.[0]}`,
      key: workKey,
      title: book.title || "Untitled",
      author: book.author_name?.[0] || "Unknown Author",
      cover: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://placehold.co/150x200?text=No+Cover",
      coverId: book.cover_i || null,
      editionKey,
      isbn: book.isbn?.[0] || null,
      ebookAccess,
      archiveIds: book.ia || [],
      publicScan: book.public_scan_b === true,

      // This page is official book information. It does not guarantee
      // that the reader or download will be available without restrictions.
      accessUrl: accessKey
        ? `https://openlibrary.org/${editionKey ? `books/${editionKey}` : workKey.replace(/^\//, "")}`
        : null,

      hasReportedAccess,
    };
  });
};
