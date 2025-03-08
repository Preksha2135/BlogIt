import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let blogs = [];

// Home Route - Show all blogs
app.get("/", (req, res) => {
  res.render("index", { blogs });
});

// New Blog Form Route
app.get("/new", (req, res) => {
  res.render("new");
});

// Submit Blog - Add new blog and redirect to homepage
app.post("/submit", (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.send("⚠️ Title and Body cannot be empty!");
  }

  // Create a new blog with a unique ID
  const newBlog = {
    id: blogs.length, // Use index as ID (better alternative: use UUID)
    title,
    body,
  };

  blogs.unshift(newBlog); // Add blog to the beginning of the array

  res.redirect("/");
});

// Dynamic Blog Route - Open individual blog
app.get("/blog/:id", (req, res) => {
  const blogId = parseInt(req.params.id); // Get ID from URL and convert to number
  const blog = blogs.find((b) => b.id === blogId); // Find the blog by ID

  if (!blog) {
    return res.status(404).send("Blog not found");
  }

  res.render("blog", { blog });
});

// 🔹 MOVE EDIT ROUTES **BEFORE** `app.listen()`

// Edit Blog Form Route - Shows the form pre-filled with blog data
app.get("/edit/:id", (req, res) => {
  const blogId = parseInt(req.params.id);
  const blog = blogs.find((b) => b.id === blogId);

  if (!blog) {
    return res.status(404).send("Blog not found");
  }

  res.render("edit", { blog }); // ✅ Renders `edit.ejs` with existing blog data
});

// Handle Edit Submission - Update the blog
app.post("/edit/:id", (req, res) => {
  const blogId = parseInt(req.params.id);
  const blogIndex = blogs.findIndex((b) => b.id === blogId);

  if (blogIndex === -1) {
    return res.status(404).send("Blog not found");
  }

  // Update the blog with new data
  blogs[blogIndex].title = req.body.title;
  blogs[blogIndex].body = req.body.body;

  res.redirect(`/blog/${blogId}`); // ✅ Redirect to the updated blog
});

app.post("/delete/:id", (req, res) => {
  const blogId = parseInt(req.params.id);
  const blogIndex = blogs.findIndex((b) => b.id === blogId);

  if (blogIndex === -1) {
    return res.status(404).send("Blog not found");
  }

  blogs.splice(blogIndex, 1); // Remove blog from array
  res.redirect("/"); // Redirect to homepage
});

// ✅ app.listen() should be **last**
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
