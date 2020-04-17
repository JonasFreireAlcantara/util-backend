const mongoose = require("mongoose");

const PsalmSchema = new mongoose.Schema({
  title: String,

  stanzas: [
    [
      {
        cipher: String,
        text: String,
      },
    ],
  ],
});

module.exports = mongoose.model("Psalm", PsalmSchema);
