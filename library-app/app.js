const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./sequelize-config");
const path = require("path");
const Book = require("./book.model");

const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const books = await Book.findAll();

    res.render("index", { books });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/return/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id);
    res.render("return", { book });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/return-book", async (req, res) => {
  try {
    const { bookId, payment } = req.body;

    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const returnDate = new Date();
    const fine = calculateFine(book.takenDate, returnDate, payment);

    await book.update({ returnDate, fine });

    res.redirect("/");
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function calculateFine(takenDate, returnDate, payment) {
  const daysOverdue = Math.max(
    0,
    Math.floor((returnDate - takenDate) / (1000 * 60 * 60 * 24))
  );
  const finePerDay = 5;
  const totalFine = daysOverdue * finePerDay;

  const netFine = Math.max(0, totalFine - payment);

  return netFine;
}

sequelize.sync().then(async () => {
  app.listen(3000);
  try {
    const book1 = await Book.create({ bookName: "Book1" });
    const book2 = await Book.create({ bookName: "Book2" });

    console.log("Books created:", book1.toJSON(), book2.toJSON());

    await book1.update({
      returnDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
    });
    console.log("Book 1 returned:", book1.toJSON());
  } catch (error) {
    console.error("Error creating books:", error);
  }
});
