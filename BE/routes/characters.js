const express = require("express");
const router = express.Router();

const {
    getAllCharacters,
    getCharacter
} = require("../controllers/characters");

router.route("/")
    .get(getAllCharacters);

router.route("/:id")
    .get(getCharacter);

module.exports = router;