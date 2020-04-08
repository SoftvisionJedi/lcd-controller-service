import express from "express";
import next from "next";

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const port = parseInt(process.env.PORT, 10) || 3000;

// fake DB
const messages = [];

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    messages.push(data);
    socket.broadcast.emit("message", data);
  });
});

nextApp.prepare().then(() => {
  app.get("/messages", (req, res) => {
    res.json(messages);
  });

  app.get("/login", (req, res) => {
    return nextApp.render(req, res, "/login", req.query);
  });

  app.get("/register", (req, res) => {
    return nextApp.render(req, res, "/register", req.query);
  });

  app.get("/forgot", (req, res) => {
    return nextApp.render(req, res, "/forgot", req.query);
  });

  app.all("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
