const { Router } = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { generateErrorMessage, ErrorMessageOptions } = require("zod-error");

const signupValidations = require("../validations");
const authController = require("../controllers/auth.controller");
const userSchema = require("../validations/zodValidations");
const { validationResult } = require("express-validator");
const router = Router();
router.post("/api/signup", signupValidations, authController.signup);

router.post("/api/signin", function (req, res, next) {
  passport.authenticate(
    "local",
    {
      successRedirect: "/",
      failureRedirect: "/api/error",
      failureFlash: true,
    },
    (err, user, info) => {
      if (info?.error || info?.message) {
        return res.status(400).json(info);
      } else if (user) {
        const token = jwt.sign(
          {
            id: user._id,
          },
          process.env.SECRET,
          { expiresIn: "7d" }
        );
        res.cookie("passport_jwt", token, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
        });
        user.password = null;
        res.cookie(
          "passport_user",
          JSON.stringify({ ...user, provider: "local" }),
          {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
          }
        );
        return res
          .status(200)
          .json({ message: "You are logged in successfully" });
      }
    }
  )(req, res, next);
});
router.get(
  "/api/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// github auth
router.get(
  "/api/github",
  passport.authenticate("github", {
    scope: ["profile", "email", "photo"],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/failed",
  }),
  function (req, res) {
    console.log("user --> ", req.user);
    const token = jwt.sign({ user: { id: req.user.id } }, process.env.SECRET, {
      expiresIn: "7d",
    });
    // send token in cookie
    res.cookie("passport_jwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      domain: "localhost",
      secure: req.secure,
    });
    const jsonUser = JSON.parse(req.user._raw);
    res.cookie(
      "passport_user",
      JSON.stringify({
        ...jsonUser,
        provider: req.user.provider,
        _id: req.user._id,
      }),
      {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        domain: "localhost",
        secure: req.secure,
      }
    );
    return res.redirect("http://localhost:3000/dashboard");
  }
);
router.get(
  "/api/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:3000/failed",
    session: false,
  }),
  function (req, res) {
    console.log("github user --> ", req.user);
    const token = jwt.sign({ user: { id: req.user.id } }, process.env.SECRET, {
      expiresIn: "7d",
    });
    // send token in cookie
    res.cookie("passport_jwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      domain: "localhost",
      secure: req.secure,
    });
    const jsonUser = JSON.parse(req.user._raw);
    res.cookie(
      "passport_user",
      JSON.stringify({
        ...jsonUser,
        email: req.user.githubEmail,
        provider: req.user.provider,
        _id: req.user._id,
      }),
      {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        domain: "localhost",
        secure: req.secure,
      }
    );
    return res.redirect("http://localhost:3000/dashboard");
  }
);
// Serialize and deserialize user instances to and from the session
passport.serializeUser(function (user, done) {
  console.log("serialize user -> ", user);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  // Fetch user from database or any other data source based on user id
  const user = { id: 1, username: "john" }; // Replace with actual user fetching logic
  console.log("des function -> ", user);
  done(null, user);
});
router.post("/api/logout", authController.logout);

module.exports = router;
