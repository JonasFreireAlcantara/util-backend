const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const app = express();

app.use(cors());

app.use("/public", express.static("public"));
app.use("/api", require("./routes"));

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`> server listening at port: ${port}`);
});
