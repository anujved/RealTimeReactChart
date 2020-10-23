const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();

app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    clearInterval(interval);
  });
});
const data = [
  {
    country: "USA",
    visits: 23725,
  },
  {
    country: "China",
    visits: 1882,
  },
  {
    country: "Japan",
    visits: 1809,
  },
  {
    country: "Germany",
    visits: 1322,
  },
  {
    country: "UK",
    visits: 1122,
  },
  {
    country: "France",
    visits: 1114,
  },
  {
    country: "India",
    visits: 984,
  },
  {
    country: "Spain",
    visits: 711,
  },
  {
    country: "Netherlands",
    visits: 665,
  },
  {
    country: "Russia",
    visits: 580,
  },
  {
    country: "South Korea",
    visits: 443,
  },
  {
    country: "Canada",
    visits: 441,
  },
];
let counter = 0;
const getApiAndEmit = (socket) => {
  let localCounter;

  if (data[counter]) {
    localCounter = data[counter];
  } else {
    localCounter = {
      country: Math.random(),
      visits: Math.random() * 10000,
    };
  }

  socket.emit("chartRender", localCounter);
  counter++;
};

server.listen(port, () => console.log(`Listening on port ${port}`));
