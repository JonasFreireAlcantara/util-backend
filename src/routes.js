const express = require("express");
const routes = express.Router();

const PsalmController = require("./controller/PsalmController");

// default route
routes.get("/", (req, res) => res.json({ message: "Util backend" }));

routes.get("/psalms", PsalmController.index);
routes.get("/psalms/:title", PsalmController.find);
routes.post("/psalms", PsalmController.create);
routes.delete("/psalms/:title", PsalmController.delete);

module.exports = routes;
