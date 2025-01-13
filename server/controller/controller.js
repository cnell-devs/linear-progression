const db = require("../models/queries");
const { validateSignUp } = require("../utils/input-validation");
const pw = require("../utils/pw-encrypt");
const { validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");


const emailLink = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid Link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "inValid Link" });
    await User.updateOne({ _id: user._id }, { verified: true });
    await token.remove();

    res.status(200).send({ message: "Email Verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internally Server Error" });
  }
};

exports.signUpPost = [
  validateSignUp,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send(errors.array().map((error) => "msg: " + error.msg));
      return;
    }
    const user = await db.getUser(req.body.username)
    console.log(user);


    try {
      if (user) throw new Error("User already created")

      req.body.password = await pw.encryptPW(req.body.password);
      const result = await db.addUser(req.body);

      // create Token and save to db
      // send verification email
      //add email to signup form and test
      const token = jwt.sign(user, "verify");




      res.send(result);
    } catch (error) {
      console.log(error);

      return error;
    }
  },
];



exports.logInPost = (req, res) => {

  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        console.log(err);

        res.send(err);
      }
      // generate a signed json web token with the contents of user object and return it in the response
      const token = jwt.sign(user, "swole");

      return res.json({ user, token });
    });
  })(req, res);
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

  try {
    const checkDate = await db.getWeightEntry(
      userId,
      workoutId,
      new Date().toLocaleDateString()
    );

    console.log("checkDate", checkDate);

    const workouts = !checkDate
      ? await db.addWeightEntry(userId, workoutId, weight)
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

    // console.log(workouts);

    res.send(workouts);
  } catch (error) {
    console.error(error);
    return error;
  }
};
