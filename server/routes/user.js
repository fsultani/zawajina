// routes/user
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");

const authenticateToken = require("../config/auth");
const User = require("../models/user");
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const jwt = require("jwt-simple");
const JWT_SECRET = Buffer.from("fe1a1915a379f3be5394b64d14794932", "hex");

router.get("/:userId", (req, res, next) => {
  const { userId } = req.params;
  User.findOne({ _id: userId }, (err, user) => {
    if (err) return res.sendStatus(403);
    if (user !== null) {
      res.render("layouts/app/index", {
        locals: {
          title: "My Match",
          styles: [
            "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
            "/static/client/views/partials/styles/app-nav.css",
            "/static/client/views/layouts/app/app-global-styles.css",
            "/static/client/views/app/profile/styles.css",
          ],
          scripts: [
            "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
            "https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js",
            "/static/client/views/layouts/app/handleLogout.js",
            // '/static/client/views/app/profile/main.js',
          ],
          user,
        },
        partials: {
          nav: "partials/app-nav",
          body: "app/profile/index",
        },
      });
    } else {
      res.sendStatus(403);
    }
  });
});

module.exports = router;
