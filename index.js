const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

mongoose.connect(
  "mongodb+srv://jmishra:it'sjmishra49@cluster0.ccfj4p8.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define a Mongoose schema
const Schema = mongoose.Schema;
const bookSchema = new Schema({
  title: String,
  author: String,
  publicationYear: Number,
  ISBN: Number,
});

const Book = mongoose.model("Book", bookSchema, "books");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Node.js Express CRUD with MongoDB");
});

// Create a new book
app.post("/api/books", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.json(savedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all books
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single book by ID
app.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(book);
  } catch (error) {
    res.status(404).json({ error: "Book not found" });
  }
});

// Update a book by ID
app.put("/api/books/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedBook);
  } catch (error) {
    res.status(404).json({ error: "Book not found" });
  }
});

// Delete a book by ID
app.delete("/api/books/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    res.json(deletedBook);
  } catch (error) {
    res.status(404).json({ error: "Book not found" });
  }
});

bookSchema.index({ title: "text", author: "text" });

app.get("/api/books/search", async (req, res) => {
  try {
    const { query } = req.query;

    // Create a regular expression to perform a case-insensitive search
    const searchRegex = new RegExp(query, "i");

    // Use the regular expression to search for matching titles or authors
    const books = await Book.find({
      $or: [{ title: searchRegex }, { author: searchRegex }],
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
