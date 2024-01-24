const express = require("express");
const router = express.Router();

const { createURL, getURL } = require("../controllers/urls");

router.route("/").post(createURL);
router.route("/:short_url").get(getURL);

module.exports = router;
