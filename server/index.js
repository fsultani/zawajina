const http = require("http");
const express = require("express");
const es6Renderer = require("express-es6-template-engine");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const osascript = require("node-osascript");
const flash = require("connect-flash");
const mongo = require("mongodb");
const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const JWT_SECRET = Buffer.from("fe1a1915a379f3be5394b64d14794932", "hex");

const app = express();

const { connectToServer, usersCollection } = require("./db.js");
const authenticateToken = require("./config/auth");
const User = require("./models/user");
const index = require("./routes/index");
const registerRoute = require("./routes/registerRoute");
const user = require("./routes/user");
const conversation = require("./routes/conversation");
const messages = require("./routes/messages");

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set static folder
app.use("/static", express.static(path.join(process.env.PWD)));

app.engine("html", es6Renderer);
app.set("views", path.join(__dirname, "../client/views"));
app.set("view engine", "html");

app.use((req, res, next) => {
  connectToServer(err => {
    if (err) throw err;
    next();
  });
});

// Catch all GET requests, and respond with an html file
app.get("*", (req, res, next) => {
  const { userId, token } = req.cookies;
  if (!token && req.url.indexOf("/api/") === -1) {
    switch (req.url) {
      case "/":
        res.render("landing-pages/_layouts/index", {
          locals: {
            title: "My Match",
            styles: [
              "https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700",
              "/static/client/views/landing-pages/_layouts/global-styles.css",
              "/static/client/views/landing-pages/_partials/styles/landing-page-nav.css",
              "/static/client/views/landing-pages/_partials/styles/footer.css",
              "/static/client/views/landing-pages/home/styles.css",
            ],
            scripts: [
              "https://unpkg.com/scrollreveal",
              "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
              "/static/client/views/landing-pages/home/animations.js",
            ],
          },
          partials: {
            nav: "landing-pages/_partials/landing-page-nav",
            body: "landing-pages/home/index",
            footer: "landing-pages/_partials/footer",
          },
        });
        break;
      case "/about":
        res.render("landing-pages/_layouts/index", {
          locals: {
            title: "About Us - My Match",
            styles: [
              "https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700",
              "/static/client/views/landing-pages/_layouts/global-styles.css",
              "/static/client/views/landing-pages/_partials/styles/landing-page-nav.css",
              "/static/client/views/landing-pages/_partials/styles/footer.css",
              "/static/client/views/landing-pages/about/styles.css",
            ],
            scripts: [
              "https://unpkg.com/scrollreveal@4.0.5/dist/scrollreveal.min.js",
              "/static/client/views/landing-pages/home/animations.js",
            ],
          },
          partials: {
            nav: "landing-pages/_partials/landing-page-nav",
            body: "landing-pages/about/index",
            footer: "landing-pages/_partials/footer",
          },
        });
        break;
      case "/login":
        res.render("landing-pages/_layouts/index", {
          locals: {
            title: "Login - My Match",
            styles: [
              "https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css",
              "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
              "/static/client/views/landing-pages/_layouts/global-styles.css",
              "/static/client/views/landing-pages/_partials/styles/landing-page-nav.css",
              "/static/client/views/landing-pages/_partials/styles/footer.css",
              "/static/client/views/landing-pages/login/styles.css",
            ],
            scripts: [
              "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
              "https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js",
              "/static/client/views/landing-pages/login/handleFocusEvent.js",
              "/static/client/views/landing-pages/login/handleLogin.js",
            ],
          },
          partials: {
            nav: "landing-pages/_partials/landing-page-nav",
            body: "landing-pages/login/index",
            footer: "landing-pages/_partials/footer",
          },
        });
        break;
      case "/signup":
        res.render("landing-pages/_layouts/index", {
          locals: {
            title: "Sign Up - My Match",
            styles: [
              "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
              "/static/client/views/landing-pages/_layouts/global-styles.css",
              "/static/client/views/landing-pages/_partials/styles/landing-page-nav.css",
              "/static/client/views/landing-pages/_partials/styles/footer.css",
              "/static/client/views/landing-pages/signup/styles.css",
            ],
            scripts: [
              "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
              "https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js",
              "/static/client/views/landing-pages/signup/js/includeHTML.js",
              "/static/client/views/landing-pages/signup/js/togglePassword.js",
              "/static/client/views/landing-pages/signup/js/handleSignupStepOne.js",
            ],
          },
          partials: {
            nav: "landing-pages/_partials/landing-page-nav",
            body: "landing-pages/signup/index",
            footer: "landing-pages/_partials/footer",
          },
        });
        break;
      case "/signup/profile":
        res.render("landing-pages/_layouts/index", {
          locals: {
            title: "Sign Up - My Match",
            styles: [
              "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
              "/static/client/views/landing-pages/_layouts/global-styles.css",
              "/static/client/views/landing-pages/_partials/styles/landing-page-nav.css",
              "/static/client/views/landing-pages/_partials/styles/footer.css",
              "/static/client/views/landing-pages/signup-profile/styles.css",
            ],
            scripts: [
              "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
              "https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js",
              "/static/client/views/landing-pages/signup-profile/js/helpers.js",
              "/static/client/views/landing-pages/signup-profile/js/signupProfileInit.js",
              "/static/client/views/landing-pages/signup-profile/js/handleCreateNewAccount.js",
              "/static/client/views/landing-pages/signup-profile/js/imageUpload.js",
            ],
          },
          partials: {
            nav: "landing-pages/_partials/landing-page-nav",
            body: "landing-pages/signup-profile/index",
            footer: "landing-pages/_partials/footer",
          },
        });
        break;
      case "/terms":
        res.render("landing-pages/_layouts/index", {
          locals: {
            title: "Terms of Service - My Match",
            styles: [
              "https://fonts.googleapis.com/css?family=Heebo:400,700|Playfair+Display:700",
              "/static/client/views/landing-pages/_layouts/global-styles.css",
              "/static/client/views/landing-pages/_partials/styles/landing-page-nav.css",
              "/static/client/views/landing-pages/_partials/styles/footer.css",
              "/static/client/views/landing-pages/terms/styles.css",
            ],
          },
          partials: {
            nav: "landing-pages/_partials/landing-page-nav",
            body: "landing-pages/terms/index",
            footer: "landing-pages/_partials/footer",
          },
        });
        break;
      default:
        res.redirect("/login");
    }
  } else {
    if (userId) return next();
    if (token === null) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, async (err, authUser) => {
      if (err) {
        return res.render("landing-pages/_layouts/index", {
          locals: {
            title: "Login - My Match",
            styles: [
              "https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css",
              "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
              "/static/client/views/landing-pages/_layouts/global-styles.css",
              "/static/client/views/landing-pages/_partials/styles/landing-page-nav.css",
              "/static/client/views/landing-pages/_partials/styles/footer.css",
              "/static/client/views/landing-pages/login/styles.css",
            ],
            scripts: [
              "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
              "https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js",
              "/static/client/views/landing-pages/login/handleFocusEvent.js",
              "/static/client/views/landing-pages/login/handleLogin.js",
            ],
          },
          partials: {
            nav: "landing-pages/_partials/landing-page-nav",
            body: "landing-pages/login/index",
            footer: "landing-pages/_partials/footer",
          },
        });
      }

      usersCollection().findOne({ _id: ObjectId(authUser.userId) }, (error, user) => {
        if (err) console.error(error);
        req.authUser = user;
        next();
      });
    });
  }
});

// Use index.js for any routes beginning with '/'
app.use("/", index);
app.use("/register", registerRoute);
app.use("/user", user);
app.use("/conversation", conversation);
app.use("/messages", messages);

const port = process.env.PORT || 3000;

// Reload the app on every file change in development mode only
if (process.env.DEVELOPMENT) {
  osascript.execute(
    `
    tell application "Google Chrome"
      set current_site to URL of active tab of front window
      if current_site contains ("localhost") then
        reload active tab of front window
      end if
    end tell
    tell application "Safari"
      set current_site to URL of document 1
      if current_site contains ("localhost") then
        tell window 1
          do JavaScript "window.location.reload(true)" in current tab
        end tell
      end if
    end tell

    `,
    (err, result, raw) => {
      if (err) return console.error(err);
    }
  );
}

app.listen(port, () => {
  if (process.send) {
    process.send("online");
    console.log(`Listening on port ${port}`);
  }
});

module.exports = app;
