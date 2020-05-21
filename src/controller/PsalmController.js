const mongoose = require("mongoose");

const Psalm = require("../model/Psalm");

module.exports = {
  async index(req, res) {
    const psalms = await Psalm.find();

    return res.json(psalms);
  },

  async find(req, res) {
    const { title } = req.params;

    const psalm = await Psalm.findOne({ title });

    if (!psalm) {
      return res.status(404).send();
    }

    return res.json(psalm);
  },

  async create(req, res) {
    const psalm = req.body;

    const { authorization } = req.headers;
    const password = process.env.PASSWORD;
    if (authorization !== password) {
      return res.status(403).json({ error: "Access Denied" });
    }

    const search = await Psalm.findOne({ title: psalm.title });
    if (search) {
      await Psalm.findOneAndDelete({ title: psalm.title });
    }

    const result = await Psalm.create(psalm);

    return res.json({ result });
  },

  async delete(req, res) {
    const { title } = req.params;

    const psalm = await Psalm.findOne({ title });

    if (!psalm) {
      return res.status(404).send();
    }

    await Psalm.deleteOne(psalm);

    return res.status(204).send();
  },
};
