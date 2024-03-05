require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const connection = require("./mysql");

const app = express();
const PORT = process.env.PORT || 3002;
// const LOCALHOST = "localhost";
const HOST = "18.116.200.216";
// JSON 요청 본문을 파싱하기 위한 미들웨어

app.use(express.json({ limit: "5mb" }));
app.use(compression());
app.use(cors({ origin: `http://${LOCALHOST}:3000` }));
app.use(bodyParser.urlencoded({ extended: false, limit: "5mb" }));

/**
 *
 * post api
 *
 */

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/posts/fetch/:page/:limit", (req, res) => {
  const limit = parseInt(req.params.limit, 10) || 10; // 기본값을 10으로 설정
  const page = parseInt(req.params.page, 10) || 1; // 기본값을 1로 설정
  const offset = (page - 1) * limit;
  const postsQuery =
    "SELECT * FROM board.posts ORDER BY createdAt DESC LIMIT ? OFFSET ?";
  const totalCountQuery = "SELECT COUNT(*) AS totalCount FROM board.posts";

  // 총 게시글 수 조회
  connection.query(totalCountQuery, (error, totalCountResults) => {
    if (error) {
      return res.status(500).send("Error fetching total count of posts");
    }

    const totalCount = totalCountResults[0].totalCount;

    // 페이지네이션된 게시글 조회
    connection.query(postsQuery, [limit, offset], (error, postsResults) => {
      if (error) {
        return res.status(500).send("Error fetching posts");
      }
      res.json({
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        posts: postsResults,
      });
    });
  });
});

app.get("/posts/:postId/views", (req, res) => {
  const postId = req.params.postId; // URL 파라미터에서 postId 추출

  // postId에 해당하는 게시물의 views 카운트를 1 증가시키는 쿼리
  const updateQuery = "UPDATE posts SET views = views + 1 WHERE id = ?";

  connection.query(updateQuery, [postId], (error, results) => {
    if (error) {
      console.error("Error updating post views in database:", error);
      return res.status(500).send("Error updating post views");
    }

    // 변경된 게시물의 정보를 조회하는 쿼리
    const selectQuery = "SELECT * FROM posts WHERE id = ?";

    connection.query(selectQuery, [postId], (error, results) => {
      if (error) {
        console.error("Error fetching updated post from database:", error);
        return res.status(500).send("Error fetching updated post");
      }
      // console.log(results);
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).send("Post not found");
      }
    });
  });
});

app.post("/post/create", (req, res) => {
  let { title, body, userId } = req.body; // 요청 본문에서 type 추출
  console.log("craets");
  const query =
    "INSERT INTO board.posts (title, body, createdAt, userId) VALUES (?,?,NOW(),?)";

  connection.query(query, [title, body, userId], (error, results) => {
    if (error) {
      console.error("Error inserting post into database:", error);
      return res.status(500).send("Error adding new post");
    }
    const newPostId = results.insertId;
    const responsePost = {
      id: newPostId,
      ...req.body,
    };

    res.status(200).json(responsePost);
  });
});

app.patch("/posts/:postId", (req, res) => {
  console.log("pos");
  const postId = req.params.postId; // URL 파라미터에서 postId 추출

  const { title, body } = req.body; // 요청 본문에서 새로운 title과 body 추출

  // 제목과 본문을 업데이트하는 쿼리
  const query = "UPDATE board.posts SET title = ?, body = ? WHERE id = ?";

  connection.query(query, [title, body, postId], (error, results) => {
    if (error) {
      console.error("Error updating post in database:", error);
      return res.status(500).send("Error updating post");
    }

    if (results.affectedRows === 0) {
      // 해당 ID의 게시물이 없는 경우
      return res.status(404).send("Post not found");
    }

    // 성공적으로 업데이트된 경우, 변경 사항을 포함하여 응답
    res.json({
      message: "Post updated successfully",
      data: results,
    });
  });
});

app.delete("/post/delete/:postId", (req, res) => {
  const postId = req.params.postId; // URL 파라미터에서 postId 추출

  // 먼저 관련 댓글 삭제
  const deleteCommentsQuery = "DELETE FROM board.comments WHERE postId = ?";

  connection.query(deleteCommentsQuery, [postId], (error, results) => {
    if (error) {
      console.error("Error deleting comments from database:", error);
      return res.status(500).send("Error deleting comments");
    }

    // 댓글 삭제 후 게시글 삭제
    const deletePostQuery = "DELETE FROM posts WHERE id = ?";

    connection.query(deletePostQuery, [postId], (error, results) => {
      if (error) {
        console.error("Error deleting post from database:", error);
        return res.status(500).send("Error deleting post");
      }

      // 게시글과 관련된 댓글이 성공적으로 삭제되었을 때 응답
      res
        .status(200)
        .send({ message: "Post and related comments deleted successfully" });
    });
  });
});

/**
 *
 * comment api
 *
 */

app.get("/comments/fetch/:postId", (req, res) => {
  const postId = parseInt(req.params.postId, 10);

  const query =
    "SELECT * FROM board.comments WHERE postId = ? ORDER BY createdAt DESC";

  connection.query(query, [postId], (error, results) => {
    if (error) {
      return res.status(500).send("Error reading from database");
    }
    res.status(200).json(results);
  });
});

app.post("/comments/create", (req, res) => {
  const { postId, text, userId, createdAt } = req.body; // 예를 들어, 요청 본문에 postId, text, userId 포함

  const query =
    "INSERT INTO comments (postId, text, userId, createdAt) VALUES (?, ?, ?,NOW())";

  connection.query(query, [postId, text, userId], (error, results) => {
    if (error) {
      return res.status(500).send("Error writing to database");
    }
    const newCommentId = results.insertId;
    console.log(req.body);
    res.status(200).json({ id: newCommentId, text, createdAt });
  });
});

app.patch("/comments/update/:commentId", (req, res) => {
  const commentId = parseInt(req.params.commentId, 10);
  const { commentText } = req.body; // 요청 본문에서 수정할 텍스트 추출

  const query = "UPDATE comments SET text = ? WHERE id = ?";

  connection.query(query, [commentText, commentId], (error, results) => {
    if (error) {
      return res.status(500).send("Error updating database");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Comment not found");
    }
    res.status(200).json({ id: commentId, text: commentText });
  });
});

app.delete("/comments/delete/:commentId", (req, res) => {
  const commentId = parseInt(req.params.commentId, 10);

  const query = "DELETE FROM board.comments WHERE id = ?";

  connection.query(query, [commentId], (error, results) => {
    if (error) {
      return res.status(500).send("Error deleting from database");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Comment not found");
    }
    res.status(200).send({ message: "Comment deleted successfully" });
  });
});
