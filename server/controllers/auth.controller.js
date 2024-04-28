const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const axios = require("axios").default;
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user.model");

class AuthController {
  async signup(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
          const salt = await bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(password, salt);
          const createdUser = await UserModel.create({
            name,
            email,
            password: hashed,
            provider: "local",
          });
          const token = jwt.sign(
            {
              id: createdUser._id,
            },
            "jwtsecret",
            { expiresIn: 1000 * 7 * 24 * 60 * 60 }
          );
          res.cookie("passport_jwt", token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
          });
          return res
            .status(201)
            .json({ message: "Your accout has been created successfully" });
        } else {
          const error = {
            status: 400,
            message: "Email is already taken",
            type: "string",
            field: "email",
          };
          next(error);
        }
      } catch (err) {
        next(err); // Pass the error to the error handling middleware
      }
    } else {
      const error = { status: 400, message: errors.array(), type: "array" };
      next(error);
    }
  }
  async localLogin(email, password, done) {
    if (!email || email.trim === "" || !password) {
      return done(null, false, {
        message: "Please fill out form",
        error: true,
      });
    }
    try {
      const user = await UserModel.findOne({
        $and: [{ email }, { provider: "local" }],
      });
      if (user) {
        // user exist
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
          return done(null, false, {
            message: "Incorrect password",
            error: true,
          });
        }
        return done(null, user);
      } else {
        return done(null, false, {
          message: "User not found",
          error: true,
        });
      }
    } catch (error) {
      return done(error, null);
    }
  }
  async github(accessToken, refreshToken, profile, done) {
    try {
      let githubEmail = profile?.email;
      if (!profile.email) {
        const { data } = await axios.get(`https://api.github.com/user/emails`, {
          headers: {
            Authorization: `token ${process.env.GITHUB_KEY}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        data.forEach((item) => {
          if (item?.email) {
            githubEmail = item?.email;
            return;
          }
        });
      }
      const findUser = await UserModel.findOne({
        id: profile.id,
      });
      if (!findUser) {
        const createdUser = await UserModel.create({
          id: profile.id,
          email: githubEmail,
          provider: profile.provider,
          github: profile,
        });
        return done(null, { ...profile, githubEmail, _id: createdUser._id });
      } else if (findUser) {
        await UserModel.findOneAndUpdate(
          { id: profile.id },
          { provider: profile.provider }
        );
        return done(null, { ...profile, githubEmail, _id: findUser._id });
      }
    } catch (error) {
      return done(error, null);
    }
  }
  async logout(req, res) {
    try {
      res.cookie("passport_jwt", "", {
        maxAge: -1,
        httpOnly: true,
        domain: "localhost",
      });
      res.cookie("passport_user", "", {
        maxAge: -1,
        httpOnly: true,
        domain: "localhost",
      });
      res.cookie("connect.sid", "", {
        maxAge: -1,
        httpOnly: true,
        domain: "localhost",
      });
      return res.json({ message: "Successfully signed out!" });
    } catch (err) {
      console.log(err);
    }
  }
  // google
  async google(accessToken, refreshToken, profile, done) {
    try {
      const findUser = await UserModel.findOne({
        id: profile.id,
      });
      if (!findUser) {
        const createdUser = await UserModel.create({
          id: profile.id,
          email: profile.email,
          provider: profile.provider,
          google: profile,
        });
        return done(null, { ...profile, _id: createdUser._id });
      } else if (findUser) {
        await UserModel.findOneAndUpdate(
          { id: profile.id },
          { provider: profile.provider }
        );
        return done(null, { ...profile, _id: findUser._id });
      }
    } catch (error) {
      return done(error, null);
    }
  }
}
module.exports = new AuthController();
