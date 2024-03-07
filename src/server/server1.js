const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const { env } = require("process");
const { comment } = require("postcss");

const app = express();
const dbPath = path.join("./", "db.json");
const PORT = process.env.PORT || 3002;
// JSON 요청 본문을 파싱하기 위한 미들웨어
app.use(
  express.json({
    limit: "5mb",
  })
);
app.use(compression());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(bodyParser.urlencoded({ extended: false, limit: "5mb" }));

/**
 *
 * post api
 *
 */

app.get("/posts/fetch/:page/:limit", (req, res) => {
  const page = req.params.page;
  const limit = req.params.limit;
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }

    try {
      const allData = JSON.parse(data);
      const { posts } = allData;
      posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const limitPosts = posts.slice((page - 1) * limit, page * limit);
      res.json({ response: limitPosts, totalCount: posts.length });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.get("/posts/fetch/:postId", (req, res) => {
  const postId = +req.params.postId;
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }

    try {
      const allData = JSON.parse(data);
      const { posts } = allData;
      const viewPost = posts.find((post) => post.id === postId);
      res.json(viewPost);
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.get("/posts/:postId/views", (req, res) => {
  const postId = +req.params.postId;
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }

    try {
      const allData = JSON.parse(data);
      const { posts } = allData;
      const viewPost = posts.map((post) =>
        post.id === postId ? { ...post, views: post.views + 1 } : post
      );

      const returnData = viewPost.find((post) => post.id === postId);
      res.json(returnData);

      const newData = {
        ...allData,
        posts: viewPost,
      };

      fs.writeFile(dbPath, JSON.stringify(newData), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing data file");
        }
        res.json({
          data: returnData,
          message: "comment create successfully",
        });
      });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.post("/post/create", (req, res) => {
  let postData = req.body; // 요청 본문에서 type 추출
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }

    try {
      const allData = JSON.parse(data);
      const { posts } = allData;
      const lastPostsId = posts[posts.length - 1].id;

      postData = {
        ...postData,
        id: lastPostsId + 1,
      };

      const newPosts = posts.concat({ ...postData, id: lastPostsId + 1 });
      const newData = {
        ...allData,
        posts: newPosts,
      };

      fs.writeFile(dbPath, JSON.stringify(newData), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing data file");
        }
        res.status(200).json(postData);
      });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.delete("/post/delete/:postId", (req, res) => {
  const deleteId = +req.params.postId;
  console.log(deleteId);
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }
    try {
      const allData = JSON.parse(data);
      const { posts, comments } = allData;
      const newPosts = posts.filter((post) => post.id !== deleteId);
      const newComments = comments.filter(
        (comment) => comment.postId !== deleteId
      );
      const newData = {
        ...allData,
        posts: newPosts,
        comments: newComments,
      };
      fs.writeFile(dbPath, JSON.stringify(newData), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing data file");
        }
        res.status(200).send({ message: "comment deleted successfully" });
      });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

/**
 *
 * comment api
 *
 */

app.get("/comments/fetch/:postId", (req, res) => {
  const paramsId = req.params.postId;

  const postId = typeof paramsId === "number" ? paramsId : +paramsId;
  console.log(postId);
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }

    try {
      const allData = JSON.parse(data);
      const { comments } = allData;
      const newData = comments.filter((comment) => comment.postId === postId);
      newData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      res.status(200).json(newData);
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.post("/comments/create", (req, res) => {
  const commentData = req.body; // 요청 본문에서 type 추출
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }

    try {
      const allData = JSON.parse(data);
      const { comments } = allData;
      const addedIdComment = {
        ...commentData,
        id: comments[comments.length - 1].id + 1,
      };

      const newComments = comments.concat({
        ...addedIdComment,
      });

      const newData = {
        ...allData,
        comments: newComments,
      };

      fs.writeFile(dbPath, JSON.stringify(newData), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing data file");
        }
        res.json(addedIdComment);
      });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.patch("/comments/update/:commentId", (req, res) => {
  const commentId = +req.params.commentId;
  const { commentText: updateComment } = req.body;

  console.log(req.body);
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }
    try {
      const allData = JSON.parse(data);
      const { comments } = allData;

      const newComments = comments.map((comment) =>
        comment.id === commentId ? { ...comment, text: updateComment } : comment
      );

      console.log(newComments);
      const newData = {
        ...allData,
        comments: newComments,
      };

      fs.writeFile(dbPath, JSON.stringify(newData), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing data file");
        }
        res.status(200).json({
          id: commentId,
          text: updateComment,
        });
        // res.status(200).send({ message: "update successfully" });
      });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.delete("/comments/delete/:commentId", (req, res) => {
  const deleteId = +req.params.commentId;
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }
    try {
      const allData = JSON.parse(data);
      const { comments } = allData;
      const newComments = comments.filter((comment) => comment.id !== deleteId);
      const newData = {
        ...allData,
        comments: newComments,
      };
      fs.writeFile(dbPath, JSON.stringify(newData), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing data file");
        }
        res.status(200).send({ message: "comment deleted successfully" });
      });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.get("/", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error 1reading data file");
      return;
    }
    try {
      const noteData = JSON.parse(data);
      if (noteData.notes) {
        res.json(noteData.notes);
      } else {
        res.status(500).send("No notes data found");
      }
      res.status(200).send({ message: "Note create successfully" });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.get("/api/note/allnotes", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error 1reading data file");
      return;
    }
    try {
      const noteData = JSON.parse(data);
      if (noteData.notes) {
        res.json(noteData.notes);
      } else {
        res.status(500).send("No notes data found");
      }
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.get("/note/:noteType", (req, res) => {
  const noteType = req.params.noteType + "Notes";
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }
    try {
      const noteData = JSON.parse(data);
      if (noteData.notes[noteType]) {
        res.json(noteData.notes[noteType]);
      } else {
        res.status(500).send("No notes data found");
      }
      res.status(200).send({ message: "Note create successfully" });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.post("/api/note/create", (req, res) => {
  const noteData = req.body; // 요청 본문에서 type 추출
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }

    try {
      const allData = JSON.parse(data);
      const updatedNote = {
        ...allData.notes,
        mainNotes: [...allData.notes.mainNotes, noteData],
      };

      const newNote = {
        ...allData,
        notes: updatedNote,
      };
      fs.writeFile(dbPath, JSON.stringify(newNote), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing data file");
        }
        // res.redirect("/");
        res.status(200).send({ message: "Note create successfully" });
      });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.post("/api/note/move/:noteType", (req, res) => {
  const to = req.params.noteType;
  const { from, note: postNote } = req.body; // 요청 본문에서 type 추출

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }

    try {
      const allData = JSON.parse(data);
      allData.notes[from] = allData.notes[from].filter(
        (note) => note.id !== postNote.id
      );
      allData.notes[to] = [...allData.notes[to], postNote];

      const newNote = { ...allData, notes: allData.notes };

      fs.writeFile(dbPath, JSON.stringify(newNote), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing data file");
        }
        res.status(200).send({ message: "Note move successfully" });
      });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.put("/api/note/update/:noteId", (req, res) => {
  const noteId = +req.params.noteId;
  const { note: newNote, pathname } = req.body;
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }
    try {
      const allData = JSON.parse(data);
      const changedNotes = allData.notes[pathname].map((note) => {
        const typeOfNoteId = typeof note.id === "number" ? +noteId : noteId;
        return note.id === typeOfNoteId ? newNote : note;
      });
      const newData = {
        ...allData,
        notes: { ...allData.notes, [pathname]: changedNotes },
      };
      fs.writeFile(dbPath, JSON.stringify(newData), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing data file");
        }
        res.status(200).send({ message: "Note update successfully" });
      });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.delete("/api/note/delete/:noteId", (req, res) => {
  const noteId = req.params.noteId;

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }
    try {
      const allData = JSON.parse(data);
      const isNumberId = typeof noteId === "number" ? +noteId : noteId;
      const newNotes = allData.notes.trashNotes.filter(
        (note) => note.id !== isNumberId
      );
      const newData = {
        ...allData,
        notes: { ...allData.notes, trashNotes: newNotes },
      };
      fs.writeFile(dbPath, JSON.stringify(newData), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing data file");
        }
        res.status(200).send({ message: "Note deleted successfully" });
      });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.patch("/api/note/update/pin/:noteId", (req, res) => {
  const oldNote = req.body;
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }
    try {
      const allData = JSON.parse(data);
      const { notes } = allData;
      // const mainNotes = notes.mainNotes;
      // notes.mainNotes.filter((note) => note.id === noteId ? { ...note, pinned: !note.pinned } : note);

      const newNote = notes.mainNotes.map((note) => {
        return note.id === oldNote.id
          ? { ...note, isPinned: !note.isPinned }
          : note;
      });
      const newData = { ...allData, notes: { ...notes, mainNotes: newNote } };
      fs.writeFile(dbPath, JSON.stringify(newData), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing data file");
        }
        res.status(200).send({ message: "Note deleted successfully" });
        // res.json(newData);
      });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.patch("/api/note/remove/tag", (req, res) => {
  const removedTagData = req.body;
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }
    try {
      const allData = JSON.parse(data);

      const newData = {
        ...allData,
        notes: removedTagData,
      };

      fs.writeFile(dbPath, JSON.stringify(newData), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing data file");
        }
        res.status(200).send({ message: "Note deleted successfully" });
        // res.json(newData);
      });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

/***
 *
 * tag 관련 api
 */

app.get("/api/tag/alltags", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error 1reading data file");
      return;
    }
    try {
      const { tags } = JSON.parse(data);
      if (tags) {
        res.json(tags);
      } else {
        res.status(500).send("No notes data found");
      }
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.post("/api/tag/update", (req, res) => {
  const newTag = req.body;
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error 1reading data file");
      return;
    }
    try {
      const allData = JSON.parse(data);
      const newData = { ...allData, tags: [...allData.tags, newTag] };
      fs.writeFile(dbPath, JSON.stringify(newData), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing data file");
        }
        res.status(200).send({ message: "Tag created successfully" });
      });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.delete("/api/tag/delete/:tagName", (req, res) => {
  const tagName = req.params.tagName;
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error 1reading data file");
      return;
    }
    try {
      const allData = JSON.parse(data);
      const deletedTag = allData.tags.filter(({ tag }) => tag !== tagName);
      const newData = { ...allData, tags: deletedTag };

      fs.writeFile(dbPath, JSON.stringify(newData), (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).send("Error writing data file");
        }
        res.status(200).send({ message: "Tag deleted successfully" });
      });
    } catch (parseError) {
      res.status(500).send("Error parsing JSON data");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
