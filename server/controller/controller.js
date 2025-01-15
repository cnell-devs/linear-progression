const db = require("../models/queries");
const { validateSignUp, validateEmail } = require("../utils/input-validation");
const pw = require("../utils/pw-encrypt");
const { validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/send-email");

console.log(process.env.API_URL);

exports.emailLink = async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id);
    if (!user) return res.status(400).send({ message: "Invalid Link" });

    const token = await db.getToken(req.params.id, req.params.token);
    if (!token) return res.status(400).send({ message: "invalid Link" });

    await db.verifyUser(req.params.id);
    await db.removeToken(token);

    // res.status(200).send({ message: "Email Verified successfully" });
    res.redirect(`${process.env.CLIENT_URL}`);
  } catch (error) {
    res.status(500).send({ message: "Internally Server Error" });
  }
};

exports.signUpPost = [
  validateSignUp,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send(errors.array().map((error) => error.msg));
      return;
    }

    try {
      if (await db.getUser(req.body.email)) {
        throw new Error("Email has already been used");
      }
      if (await db.getUser(req.body.username)) {
        throw new Error("Username has already been used");
      }

      req.body.password = await pw.encryptPW(req.body.password);
      const user = await db.addUser(req.body);

      console.log(user);

      // create Token and save to db
      // send verification email
      //add email to signup form and test
      const token = jwt.sign(user, "verify");

      console.log("token", token);

      const addToken = await db.addToken(user, token);
      console.log(addToken);

      const url = `${process.env.API_URL}/verify/${user.id}/${token}`;

      const subject = " Please Verify Email";
      const message = `
      <h3>Hello ${user.username}</h3>
      <p>Thanks yor for registering for our services.</p>
      <p>Click this link <a href="${url}">here</a> to verify your email</p>
    `;
      await sendEmail(user.email, subject, message);

      res.status(201).send({ message: "An Email sent to your account please" });

      // res.send(addToken);
    } catch (error) {
      console.log(error);

      res.status(400).send([error.message]);

      return error;
    }
  },
];

exports.logInPost = async (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user,
      });
    }
    req.login(user, { session: false }, async (err) => {
      if (err) {
        console.log(err);

        res.send(err);
      }
      await db.updateLastLogin(user.id);
      // generate a signed json web token with the contents of user object and return it in the response
      const token = jwt.sign(user, "swole");
      return res.json({ user, token });
    });
  })(req, res);
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await db.deleteUser(req.params.id);
    console.log(deletedUser);
    res.status(200).send({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    return error;
  }
};

exports.logout = (req, res, next) => {
  res.send("remove jwt on client side and redirect");
};

exports.getWorkouts = async (req, res) => {
  const alternate = req.query.alt === "true";
  try {
    const workouts = await db.getWorkouts(req.query.split);

    // console.log(workouts);

    res.send(workouts);
  } catch (error) {
    console.error(error);
    return error;
  }
};

exports.addWeight = async (req, res) => {
  const { userId } = req.body;
  const { workoutId } = req.body;
  const { weight } = req.body;

  const date = req.body.date ? new Date(date) : new Date();

  try {
    const checkDate = await db.getWeightEntry(userId, workoutId, date);

    console.log("checkDate", checkDate);

    const workouts = !checkDate
      ? await db.addWeightEntry(userId, workoutId, weight, date)
      : await db.updateWeightEntry(checkDate.id, userId, workoutId, weight);

    // console.log(workouts);
    res.send(workouts);
  } catch (error) {
    console.error(error);
    return error;
  }
};

exports.updateWeight = async (req, res) => {
  const { userId } = req.body;
  const { workoutId } = req.body;
  const { weight } = req.body;
  try {
    const workouts = await db.updateWeightEntry(userId, workoutId, weight);

    res.send(workouts);
  } catch (error) {
    console.error(error);
    return error;
  }
};

exports.deleteWeight = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const deleted = await db.deleteWeightEntry(Number(id));

    res.send(deleted);
  } catch (error) {
    console.error(error);
    return error;
  }
};

exports.passwordLink = [
  validateEmail,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).send(errors.array().map((error) => error.msg));
        return;
      }

      let user = await db.getUser(req.body.email);
      if (!user)
        return res.status(409).send(["User with email doesn't exist."]);

      let token = await db.getToken(user.id);

      if (!token) {
        token = await db.addToken(user, jwt.sign(user, "verify"));
      }
      console.log(process.env.API_URL);
      const url = `${process.env.API_URL}/recovery/${user.id}/${token.token}`;
      const subject = "Password Reset";
      const message = `
      <p>Here is a link to reset your password</p>
      <p>Click this link <a href="${url}">here</a> to reset your password</p>
    `;

      await sendEmail(user.email, subject, message);

      res
        .status(200)
        .send({ message: "password reset link is sent to your email account" });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  },
];

exports.verifyUrl = async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id);
    if (!user) return res.status(400).send({ message: "Invalid user" });

    const token = await db.getToken(req.params.id, req.params.token);
    if (!token) return res.status(400).send({ message: "Invalid token" });

    res.redirect(
      `${process.env.CLIENT_URL}/reset-password/${req.params.id}/${req.params.token}`
    );
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // const validate = (data) => {
    //   const passwordSchema = Joi.object({
    //     password: passwordComplexity().required().label("password"),
    //   });
    //   return passwordSchema.validate(data);
    // };
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send({
    //     message: error.details[0].message,
    //   });

    const user = await db.getUserById(req.params.id);
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await db.getToken(req.params.id, req.params.token);
    if (!token) return res.status(400).send({ message: "Invalid Link" });

    user.password = await pw.encryptPW(req.body.password);
    await db.changePassword(user.id, user.password);

    if (!user.verified) await db.verifyUser(user.id);
    await db.removeToken(token);

    res.status(200).send({ message: "password successfully reset" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};
