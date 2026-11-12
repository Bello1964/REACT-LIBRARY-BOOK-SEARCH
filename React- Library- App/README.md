# 📚 Library App – Discover Books & Generate AI Summaries

A modern, responsive library application built with **React and Vite** that allows users to search for books using the Open Library API, explore book details, and generate AI-powered summaries using Google's Gemini API.

The application combines a simple book-discovery experience with AI-assisted reading, helping users explore books and get a quick understanding of their content.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Integration](#api-integration)
- [Security Considerations](#security-considerations)
- [Error Handling](#error-handling)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

The Library App provides an interactive interface for discovering books and exploring their information.

Users can:

1. Search for books by entering a search term.
2. Browse matching books displayed in a responsive card layout.
3. Select a book to open its details in a modal dialog.
4. Generate an AI-powered summary of the selected book.
5. Close the dialog and continue browsing while retaining the selected book's visual highlight.

Book information is retrieved from the [Open Library API](https://openlibrary.org/developers/api), while AI summaries are generated through Google's Gemini API using a separate Express backend.

The application is designed with a clear separation between frontend presentation, external book-data retrieval, and AI-powered functionality.

---

## Features

### 1. Book Search

- Search for books using the Open Library Search API.
- Automatically search as the user types, with a short debounce delay.
- Display relevant book information returned by the API.
- Handle loading and failed-request states.

### 2. Responsive Book Collection

- Display books in a responsive grid layout.
- Show book covers, titles, and author names.
- Maintain consistent card heights for a cleaner layout.
- Support different screen sizes, including smartphones, tablets, and desktop screens.
- Highlight the currently selected book with a blue border.

### 3. Book Details Modal

Selecting a book opens a modal dialog containing its details and AI-summary functionality.

The dialog supports:

- Closing through the close button.
- Closing by clicking the backdrop.
- Closing with the Escape key.
- Keyboard focus management.
- Focus restoration to the previously selected book card after closing.

The selected book remains highlighted even after the dialog is closed.

### 4. AI-Powered Book Summaries

The application integrates Google's Gemini API to generate summaries for selected books.

Users can:

- Request a summary of a selected book.
- View a loading state while the summary is being generated.
- See the generated summary in the book-details dialog.
- Receive an error message when summary generation fails.
- Retry the operation when appropriate.

The AI request is handled by the backend rather than exposing the Gemini API key in the browser.

### 5. Loading and Error States

The application provides feedback during asynchronous operations.

Examples include:

- Loading indicators while retrieving books.
- Error messages when book searches fail.
- Summary-generation loading feedback.
- Error messages when the AI service cannot generate a summary.

### 6. External Book Data

Book information is retrieved from Open Library.

The application uses available information such as:

- Book title.
- Author.
- Book cover.
- Open Library identifiers.
- Edition and ISBN information, where available.
- Reported digital-access metadata, where available.

Digital availability information is based on the data returned by Open Library and should not be interpreted as a guarantee that a particular edition can currently be borrowed or read.

---

## Screenshots

Add screenshots of the application here as the interface develops.

Suggested screenshots:

| Screenshot | Description |
|---|---|
| `screenshots/home.png` | Main library interface |
| `screenshots/search.png` | Search results |
| `screenshots/book-details.png` | Selected book details dialog |
| `screenshots/ai-summary.png` | Generated AI summary |

To display a screenshot, add it to the repository and use:

```md
![Library App Homepage](screenshots/home.png)
```

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| Vite 8 | Development server and build tool |
| JavaScript (ES6+) | Application logic |
| React Hooks | State and lifecycle management |
| React Router 7 | Routing support |
| CSS | Styling and responsive layouts |
| Fetch API | HTTP communication |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend API server |
| Google Gemini API | AI-powered book summaries |
| dotenv | Environment variable management |

### External Services

| Service | Purpose |
|---|---|
| Open Library API | Book search and book metadata |
| Google Gemini API | AI-generated book summaries |

---

## Project Architecture

The application uses a separate frontend and backend.

The frontend handles the user interface, book searching, selection, and display of generated summaries.

The backend handles requests for AI summaries and communicates with Google's Gemini API.

### High-Level Architecture

```text
                USER
                  |
                  v
          REACT FRONTEND
             (Vite)
                  |
        +---------+---------+
        |                   |
        v                   v
  OPEN LIBRARY API     EXPRESS BACKEND
  Book Search API      /api/summarize
                            |
                            v
                      GEMINI API
                            |
                            v
                    Generated Summary
                            |
                            v
                     REACT FRONTEND
                            |
                            v
                       USER VIEW
```

### Project Structure

The following represents the main application structure:

```text
library-app/
│
├── src/
│   │
│   ├── API/
│   │   ├── books.js
│   │   └── summarizeBook.js
│   │
│   ├── Components/
│   │   ├── BookItem.jsx
│   │   ├── BookList.jsx
│   │   ├── BookDetailsDialog.jsx
│   │   └── SearchBar.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
│
├── server/
│   ├── index.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .env
├── package.json
└── README.md
```

*Note: This is the documented main structure. Additional configuration files and components may exist in the actual repository.*

---

## How It Works

### 1. Retrieving Books

The application sends a search request to Open Library.

Example:

```text
https://openlibrary.org/search.json?q=Adventure
```

The response contains book records matching the search query.

The frontend processes the returned records and extracts the information needed by the application.

A simplified example:

```js
{
  id: 1,
  title: "Example Book",
  author: "Example Author",
  cover: "https://covers.openlibrary.org/b/id/123456-M.jpg"
}
```

Book records are then displayed using reusable React components.

### 2. Selecting a Book

When a user clicks a book card:

- The selected book is stored in React state.
- The book card receives a blue selected-state border.
- The book-details dialog opens.
- Previous summary information is cleared.

When the dialog closes, the selected book remains stored, preserving the card's highlighted state.

### 3. Generating an AI Summary

When the user requests a summary, the frontend sends the selected book's title and author to the backend.

Example request:

```http
POST /api/summarize
Content-Type: application/json
```

Request body:

```json
{
  "title": "Example Book",
  "author": "Example Author"
}
```

The Express backend forwards the request to Gemini using the API key stored in its environment variables.

A successful response has the following general structure:

```json
{
  "summary": "An AI-generated summary of the book.",
  "uncertain": false
}
```

The frontend displays the returned summary in the details dialog.

---

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (a compatible version for the installed dependencies).
- npm.
- A code editor such as Visual Studio Code.
- A Google Gemini API key.

You can verify your installations using:

```bash
node -v
npm -v
```

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project directory:

```bash
cd library-app
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

Navigate into the server directory:

```bash
cd server
```

Install the backend dependencies:

```bash
npm install
```

Return to the project root:

```bash
cd ..
```

### 4. Configure Environment Variables

Create the necessary environment files using the examples below.

#### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:3001
```

#### Backend `server/.env`

```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_available_gemini_model
```

Replace the placeholder values with your actual configuration.

Never commit real API keys or other secrets to GitHub.

### 5. Start the Backend

From the `server` directory, run the development command configured in its `package.json`.

For example, if the project defines a `dev` script:

```bash
npm run dev
```

### 6. Start the Frontend

Open another terminal in the project root and run:

```bash
npm run dev
```

Vite will display the local development URL, usually:

```text
http://localhost:5173
```

Open that address in your browser to access the application.

---

## Environment Variables

The application uses environment variables to keep configuration separate from source code.

### Frontend

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the Express backend | `http://localhost:3001` |

Vite exposes variables prefixed with `VITE_` to frontend code. Therefore, this variable must never contain private credentials.

### Backend

| Variable | Description |
|---|---|
| `PORT` | Port on which the Express server runs |
| `GEMINI_API_KEY` | Private Google Gemini API key |
| `GEMINI_MODEL` | Gemini model identifier used for summary generation |

The backend should load these values through environment configuration.

---

## API Integration

### Open Library API

The application uses the Open Library Search API to retrieve book information.

**Endpoint:**

```http
GET https://openlibrary.org/search.json
```

**Example:**

```text
https://openlibrary.org/search.json?q=Adventure&limit=40
```

The application uses the returned book records to populate the book collection.

Official documentation:

https://openlibrary.org/developers/api

### Gemini API

The Express backend exposes an application endpoint for generating summaries.

**Endpoint:**

```http
POST /api/summarize
```

**Request:**

```json
{
  "title": "Example Book",
  "author": "Example Author"
}
```

**Successful response:**

```json
{
  "summary": "Generated book summary.",
  "uncertain": false
}
```

The Gemini API key is used exclusively on the backend.

---

## Security Considerations

Security is important when integrating third-party AI services.

This project follows these principles:

1. **Protected API credentials:** The Gemini API key is stored in the backend environment and is not embedded in frontend JavaScript.
2. **Separate frontend and backend:** AI requests are routed through the Express server.
3. **Environment-based configuration:** API credentials and server configuration are kept outside the application source code.
4. **Request validation:** The backend should validate incoming summary requests before forwarding them to the AI service.
5. **Error handling:** Backend errors are returned to the frontend so the interface can provide appropriate feedback.

Ensure `.env` files are included in `.gitignore`.

---

## Error Handling

The application accounts for failures that may occur during external API communication.

| Scenario | Expected application behaviour |
|---|---|
| Open Library cannot be reached | Display a book-search error |
| Search returns no matching books | Display an appropriate empty result state |
| Gemini request is unsuccessful | Display a summary-generation error |
| Gemini service experiences high demand | Allow the user to retry later |
| Summary is being generated | Display a loading state |

The application depends on external services, so network availability and third-party service reliability can affect functionality.

---

## Known Limitations

- Book search depends on the availability of the Open Library API.
- Book information and cover images depend on the records available from Open Library.
- Some book records may have incomplete metadata or missing cover images.
- AI-generated summaries depend on Gemini API availability and model capacity.
- AI summaries are generated from the book title and author supplied to the model; they should not automatically be treated as verified reproductions of the original book.
- The application does not guarantee that every book has a complete or accurate AI-generated summary.
- Digital-access metadata does not guarantee that a book is currently available for borrowing or reading.

---

## Future Improvements

Possible enhancements for future versions include:

- User authentication and personal accounts.
- Personal reading lists and favourites.
- Saving books to a personal library.
- Reading progress tracking.
- More detailed book information and edition selection.
- Improved AI summaries with chapter-level breakdowns.
- Summary history.
- Advanced search filters.
- Improved accessibility and keyboard navigation.
- Automated frontend and backend tests.
- Deployment of the frontend and backend.

---

## Contributing

Contributions and suggestions are welcome.

To contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes.
4. Test your changes locally.
5. Submit a pull request describing your improvements.

---

## License

This project is available for educational and personal development purposes.

Add an appropriate open-source license to the repository before granting formal reuse or redistribution permissions.

---

## Acknowledgements

Special thanks to the services and technologies that make this project possible:

- [Open Library](https://openlibrary.org/) – Book search and metadata.
- [Google Gemini](https://ai.google.dev/) – AI-powered book summaries.
- [React](https://react.dev/) – Frontend library.
- [Vite](https://vite.dev/) – Frontend development and build tooling.
- [Express](https://expressjs.com/) – Backend framework.

---

**Built with React, Vite, Express, Open Library, and Google Gemini.**