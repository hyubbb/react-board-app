if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.development" });
} else {
  require("dotenv").config({ path: ".env.production" });
}
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const multer = require("multer");
const pool = require("./database");
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = process.env.REACT_APP_PORT || 3000;
const LOCALHOST = process.env.REACT_APP_HOST;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(compression());
app.use(express.static(path.join(__dirname, "..", "..", "build")));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "..", "public", "uploads"))
);

const allowedOrigins = [
  `http://${LOCALHOST}:${process.env.REACT_APP_LOCALPORT}`,
];
app.use(cors({ origin: allowedOrigins }));

/**
 *
 * post api
 *
 */

app.get("/posts/fetch/:page/:limit", async (req, res) => {
  let conn;
  try {
    const limit = parseInt(req.params.limit, 10) || 10; // 기본값을 10으로 설정
    const page = parseInt(req.params.page, 10) || 1; // 기본값을 1로 설정
    const offset = (page - 1) * limit;
    conn = await pool.getConnection();
    const totalCountQuery = "SELECT COUNT(*) AS totalCount FROM board.posts";
    const totalCountResults = await conn.query(totalCountQuery);
    const totalCount = totalCountResults[0].totalCount;
    const postsQuery =
      "SELECT * FROM board.posts ORDER BY createdAt DESC LIMIT ? OFFSET ?";
    const postsResults = await conn.query(postsQuery, [limit, offset]);
    res.json({
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount: totalCount,
      posts: postsResults,
    });
  } catch (error) {
    console.error("Error fetching posts or total count:", error);
    res.status(500).send("Error fetching posts");
  } finally {
    if (conn) conn.release();
  }
});

app.get("/posts/:postId/views", async (req, res) => {
  let conn;
  try {
    const postId = req.params.postId; // URL 파라미터에서 postId 추출
    conn = await pool.getConnection();
    const updateQuery = "UPDATE board.posts SET views = views + 1 WHERE id = ?";
    await conn.query(updateQuery, [postId]);

    const selectQuery = "SELECT * FROM board.posts WHERE id = ?";
    const results = await conn.query(selectQuery, [postId]);

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    console.error("Error updating or fetching post:", error);
    res.status(500).send("Error processing request");
  } finally {
    if (conn) conn.release();
  }
});

app.post("/posts/create", async (req, res) => {
  let conn;
  try {
    let { title, body, userId } = req.body;
    conn = await pool.getConnection();
    const query =
      "INSERT INTO board.posts (title, body, createdAt, userId) VALUES (?,?,NOW(),?)";
    const results = await conn.query(query, [title, body, userId]);
    const newPostId = results.insertId;
    const responsePost = {
      id: newPostId + "",
      ...req.body,
    };
    res.status(200).json(responsePost);
  } catch (error) {
    console.error("Error inserting post into database:", error);
    res.status(500).send("Error adding new post");
  } finally {
    if (conn) conn.release();
  }
});

app.patch("/posts/:postId", async (req, res) => {
  let conn;
  try {
    const postId = req.params.postId;
    const { title, body } = req.body;

    conn = await pool.getConnection();
    const query = "UPDATE board.posts SET title = ?, body = ? WHERE id = ?";
    const results = await conn.query(query, [title, body, postId]);

    if (results.affectedRows === 0) {
      return res.status(404).send("Post not found");
    }
    res.json({
      message: "Post updated successfully",
      data: results.toString(),
    });
  } catch (error) {
    console.error("Error updating post in database:", error);
    res.status(500).send("Error updating post");
  } finally {
    if (conn) conn.release();
  }
});

app.delete("/posts/delete/:postId", async (req, res) => {
  let conn;
  try {
    const postId = req.params.postId;

    conn = await pool.getConnection();
    const deleteCommentsQuery = "DELETE FROM board.comments WHERE postId = ?";
    await conn.query(deleteCommentsQuery, [postId]);

    const deletePostQuery = "DELETE FROM board.posts WHERE id = ?";
    const results = await conn.query(deletePostQuery, [postId]);

    if (results.affectedRows === 0) {
      return res.status(404).send("Post not found");
    }

    res
      .status(200)
      .send({ message: "Post and related comments deleted successfully" });
  } catch (error) {
    console.error("Error deleting post or comments from database:", error);
    res.status(500).send("Error deleting post or comments");
  } finally {
    if (conn) conn.release();
  }
});

/**
 *
 * comment api
 *
 */

app.get("/comments/fetch/:postId", async (req, res) => {
  let conn;
  try {
    const postId = parseInt(req.params.postId, 10);
    conn = await pool.getConnection();
    const query =
      "SELECT * FROM board.comments WHERE postId = ? ORDER BY createdAt DESC";
    const results = await conn.query(query, [postId]);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error reading from database:", error);
    res.status(500).send("Error reading from database");
  } finally {
    if (conn) conn.release();
  }
});

app.post("/comments/create", async (req, res) => {
  let conn;
  try {
    const { postId, text, userId, createdAt } = req.body;
    conn = await pool.getConnection();
    const query =
      "INSERT INTO board.comments (postId, text, userId, createdAt) VALUES (?, ?, ?, NOW())";
    const results = await conn.query(query, [postId, text, userId]);
    const newCommentId = results.insertId.toString();

    res.status(200).json({ id: Number(newCommentId), text, userId, createdAt });
  } catch (error) {
    console.error("Error writing to database:", error);
    res.status(500).send("Error writing to database");
  } finally {
    if (conn) conn.release();
  }
});

app.patch("/comments/update/:commentId", async (req, res) => {
  let conn;
  try {
    const commentId = parseInt(req.params.commentId, 10);
    const { commentText } = req.body;
    conn = await pool.getConnection();
    const query = "UPDATE board.comments SET text = ? WHERE id = ?";
    const results = await conn.query(query, [commentText, commentId]);
    if (results.affectedRows === 0) {
      return res.status(404).send("Comment not found");
    }
    res.status(200).json({ id: commentId, text: commentText });
  } catch (error) {
    console.error("Error updating database:", error);
    res.status(500).send("Error updating database");
  } finally {
    if (conn) conn.release();
  }
});

app.delete("/comments/delete/:commentId", async (req, res) => {
  let conn;
  try {
    const commentId = parseInt(req.params.commentId, 10);
    conn = await pool.getConnection();
    const query = "DELETE FROM board.comments WHERE id = ?";
    const results = await conn.query(query, [commentId]);
    if (results.affectedRows === 0) {
      return res.status(404).send("Comment not found");
    }
    res.status(200).send({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting from database:", error);
    res.status(500).send("Error deleting from database");
  } finally {
    if (conn) conn.release();
  }
});

/**
 *
 * texteditor image api
 *
 */

//
// app.use("/upload", express.static(path.join(__dirname, "uploads")));
// console.log(__dirname);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    // 원래 파일의 확장자를 가져와서 저장
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  let conn;
  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    conn = await pool.getConnection();
    const query = "INSERT INTO board.images (imageUrl) VALUES (?)";
    const results = await conn.query(query, [imageUrl]);
    res.json({ imageUrl, id: results.insertId });
  } catch (error) {
    console.error("Error saving image URL to database:", error);
    res.status(500).send("Error saving image URL to database");
  } finally {
    if (conn) conn.release();
  }
});
app.post("/deleteImage", async (req, res) => {
  const { imageUrl } = req.body;
  const imagePath = path.join(
    __dirname,
    "..",
    "..",
    "public/uploads",
    path.basename(imageUrl)
  );

  try {
    await fs.promises.unlink(imagePath);
    res.status(200).send("Image delete successfully");
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).send("Error deleting image");
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
