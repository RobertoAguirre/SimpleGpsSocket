const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Event handler for new client connections
io.on("connection", (socket) => {
  console.log("New client connected");

  // Event handler for incoming GPS coordinates
  socket.on("gpsCoordinates", (data) => {
    console.log("Received GPS coordinates:", data);

    // Broadcast the coordinates to all connected clients
    socket.broadcast.emit("gpsCoordinates", data);
  });

  // Event handler for client disconnections
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
