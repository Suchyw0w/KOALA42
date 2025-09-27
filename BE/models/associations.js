const Character = require("./Character");
const Nemesis = require("./Nemesis");
const Secret = require("./Secret");

Character.hasMany(Nemesis, {
  foreignKey: "character_id",
  as: "nemeses",
  onDelete: "CASCADE",
});

Nemesis.belongsTo(Character, {
  foreignKey: "character_id",
  as: "character",
});

Nemesis.hasMany(Secret, {
  foreignKey: "nemesis_id",
  as: "secrets",
  onDelete: "CASCADE",
});

Secret.belongsTo(Nemesis, {
  foreignKey: "nemesis_id",
  as: "nemesis",
});

module.exports = {
  Character,
  Nemesis,
  Secret,
};
