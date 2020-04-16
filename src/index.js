const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const routes = require("./routes");

dotenv.config();

// Database connection
const username = process.env.DATABASE_MONGO_ATLAS_USERNAME;
const password = process.env.DATABASE_MONGO_ATLAS_PASSWORD;
mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0-8rplu.mongodb.net/salterio-brasileiro?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.connection.on("error", () => {
  console.log("database: connection error");
});
mongoose.connection.once("open", () => {
  console.log("database: connection established");
});

const app = express();

app.use(express.json());
app.use(cors());

app.use("/public", express.static("public"));
app.use("/api", routes);

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`> server listening at port: ${port}`);
});
