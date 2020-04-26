const mongoose = require("mongoose");

const PsalmSchema = new mongoose.Schema({
  title: String,

  composer: String,
  harmonization: String,
  melody: String,
  metric: String,
  letter: String,

  url: String,

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
