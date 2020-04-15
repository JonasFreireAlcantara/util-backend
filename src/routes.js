const express = require("express");
const routes = express.Router();

// default route
routes.get("/", (req, res) => res.json({ message: "Util backend" }));

module.exports = routes;
