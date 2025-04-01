const db = require("../models/queries");
const { validateSignUp, validateEmail } = require("../utils/input-validation");
const pw = require("../utils/pw-encrypt");
const { validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/send-email");
const bcrypt = require("bcrypt");

// Local implementation of date conversion utility
const convertUTCToLocalUTC = (utcString) => {
  // Create a new Date object from the input
  const date = new Date(utcString);

  // Check if date is valid
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return null;
  }

  // Format the date in ISO format
  return date.toISOString();
};

exports.home = (req, res) => {
  res.json({ message: "Welcome to the API" });
};

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

      const subject = "Email Verification";
      const message = `
      <h3>Welcome,  ${user.username}!</h3>
      <p>Click <a href="${url}">here</a> to verify your email</p>
    `;
      await sendEmail(user.email, subject, message);

      res.status(201).send({ message: "Email Sent" });

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
    // Pass user ID if user is authenticated
    const userId = req.user ? req.user.id : null;
    console.log("Controller - getWorkouts");
    console.log("Authenticated user:", req.user);
    console.log("Using userId:", userId);
    console.log("Query params:", req.query);

    const workouts = await db.getWorkouts(req.query.split, userId);
    console.log(`Retrieved ${workouts.length} workouts`);
    console.log("Global workouts:", workouts.filter((w) => w.isGlobal).length);
    console.log(
      "User workouts:",
      workouts.filter((w) => w.userId === userId).length
    );

    res.send(workouts);
  } catch (error) {
    console.error("Error in getWorkouts controller:", error);
    res.status(500).send({ error: "Failed to fetch workouts" });
  }
};

exports.getWorkoutById = async (req, res) => {
  const { id } = req.params;
  try {
    const workout = await db.getWorkoutById(id);
    if (!workout) {
      return res.status(404).send({ error: "Workout not found" });
    }
    res.send(workout);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch workout" });
  }
};

exports.createWorkout = async (req, res) => {
  const {
    name,
    sets,
    reps,
    amrap,
    type,
    alt,
    ss,
    supersettedId,
    alternateId,
    isTemplate,
    isGlobal,
    userId: clientProvidedUserId, // Extract userId from request if provided
  } = req.body;

  console.log("Create workout request body:", req.body);
  console.log("Authenticated user:", req.user);

  try {
    // Validate required fields
    if (!name || sets === undefined || !reps || !type) {
      console.error("Missing required workout fields:", {
        name,
        sets,
        reps,
        type,
      });
      return res.status(400).send({ error: "Missing required workout fields" });
    }

    // Set workout owner to current authenticated user
    const authenticatedUserId = req.user.id;
    console.log("Authenticated user ID:", authenticatedUserId);

    // For security, only admins can create workouts for other users
    // Otherwise, always use the authenticated user's ID
    let workoutUserId = authenticatedUserId;

    // If global workout, set userId to null
    // Determine if the workout should be global (admin only) or personal
    const isWorkoutGlobal = req.user.admin && isGlobal === true;

    if (isWorkoutGlobal) {
      workoutUserId = null; // Global workouts have null userId
    }

    console.log("Final workout userId:", workoutUserId);
    console.log("Is workout global:", isWorkoutGlobal);

    const workoutData = {
      name,
      sets,
      reps,
      amrap: amrap || false,
      type,
      alt: alt || false,
      ss: ss || false,
      isTemplate: isTemplate || false,
      isGlobal: isWorkoutGlobal,
      userId: workoutUserId,
      supersettedId,
      alternateId,
    };

    console.log("Creating workout with data:", workoutData);
    const workout = await db.createWorkout(workoutData);
    console.log("Workout created:", workout);

    res.status(201).send(workout);
  } catch (error) {
    console.error("Error creating workout:", error);
    res.status(500).send({ error: "Failed to create workout" });
  }
};

exports.updateWorkout = async (req, res) => {
  const { id } = req.params;
  const { name, sets, reps, amrap, type, alt, ss, isGlobal } = req.body;

  try {
    // Get the user ID
    const userId = req.user.id;
    const isAdmin = req.user.admin;

    // Determine if user wants to create a personal copy of a global workout
    const makePersonal = isGlobal === false;

    // Check if workout exists
    const existingWorkout = await db.getWorkoutById(id);
    if (!existingWorkout) {
      return res.status(404).send({ error: "Workout not found" });
    }

    const workoutData = {
      name,
      sets,
      reps,
      amrap,
      type,
      alt,
      ss,
      isGlobal: isAdmin ? isGlobal : false,
    };

    const workout = await db.updateWorkout(id, workoutData, userId);
    res.send(workout);
  } catch (error) {
    console.error(error);
    if (error.message === "Unauthorized to update this workout") {
      return res.status(403).send({ error: error.message });
    }
    res.status(500).send({ error: "Failed to update workout" });
  }
};

exports.deleteWorkout = async (req, res) => {
  const { id } = req.params;

  try {
    // Get the user ID
    const userId = req.user.id;

    // Try to delete the workout
    await db.deleteWorkout(id, userId);
    res.send({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.message === "Unauthorized to delete this workout") {
      return res.status(403).send({ error: error.message });
    } else if (error.message === "Workout not found") {
      return res.status(404).send({ error: error.message });
    }
    res.status(500).send({ error: "Failed to delete workout" });
  }
};

exports.addWeight = async (req, res) => {
  try {
    // Get userId either from request body or from auth token
    let userId;

    if (req.user && req.user.id) {
      // For authenticated requests (/weights/add endpoint)
      userId = req.user.id;
    } else if (req.body.userId) {
      // For backward compatibility with /weight-entry endpoint
      userId = req.body.userId;
    } else {
      return res.status(400).send({ error: "User ID is required" });
    }

    const { workoutId: rawWorkoutId, weight: rawWeight } = req.body;

    if (rawWorkoutId === undefined || rawWorkoutId === null) {
      return res.status(400).send({ error: "workoutId is required" });
    }

    // Check for non-numeric IDs (like template IDs 'push-1')
    if (typeof rawWorkoutId === "string" && !/^\d+$/.test(rawWorkoutId)) {
      console.error("Invalid workoutId format (non-numeric):", rawWorkoutId);
      return res.status(400).send({
        error: "workoutId must be a numeric value, not a string like 'push-1'",
      });
    }

    if (rawWeight === undefined || rawWeight === null) {
      return res.status(400).send({ error: "weight is required" });
    }

    // Parse and validate workoutId
    console.log(
      "Raw workoutId from request:",
      rawWorkoutId,
      "type:",
      typeof rawWorkoutId
    );
    const workoutId = parseInt(rawWorkoutId);
    if (isNaN(workoutId)) {
      return res
        .status(400)
        .send({ error: "workoutId must be a valid number" });
    }
    console.log("Parsed workoutId:", workoutId, "type:", typeof workoutId);

    // Parse and validate weight
    const weight = parseInt(rawWeight);
    if (isNaN(weight)) {
      return res.status(400).send({ error: "weight must be a valid number" });
    }

    // Handle date parameter
    console.log("REQUEST DATE", req.body.date);

    let date;
    try {
      if (req.body.date) {
        // Try to parse the date from the request
        date = new Date(req.body.date);
      } else {
        date = convertUTCToLocalUTC(new Date());
      }

      // Validate that the date is valid
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error("Invalid date:", req.body.date);
        return res.status(400).send({
          error:
            "Invalid date format. Please use a valid ISO date string (YYYY-MM-DDTHH:mm:ss.sssZ)",
        });
      }
    } catch (error) {
      console.error("Error parsing date:", error, req.body.date);
      return res.status(400).send({
        error: "Failed to parse date: " + error.message,
      });
    }

    console.log("CONTROLLER date:", date);

    // Check if entry already exists for this date
    const checkDate = await db.getWeightEntry(userId, workoutId, date);
    console.log("checkDate", checkDate);
    console.log("compare", date, checkDate?.date);

    // Create or update weight entry
    const workouts = !checkDate
      ? await db.addWeightEntry(userId, workoutId, weight, date)
      : await db.updateWeightEntry(checkDate.id, userId, workoutId, weight);

    console.log("Result:", workouts);
    res.send(workouts);
  } catch (error) {
    console.error("Error in addWeight:", error);
    res.status(500).send({ error: error.message });
  }
};

exports.updateWeight = async (req, res) => {
  try {
    // Validate required parameters
    const { userId, workoutId: rawWorkoutId, weight: rawWeight } = req.body;

    if (!userId) {
      return res.status(400).send({ error: "userId is required" });
    }

    if (rawWorkoutId === undefined || rawWorkoutId === null) {
      return res.status(400).send({ error: "workoutId is required" });
    }

    // Check for non-numeric IDs (like template IDs 'push-1')
    if (typeof rawWorkoutId === "string" && !/^\d+$/.test(rawWorkoutId)) {
      console.error("Invalid workoutId format (non-numeric):", rawWorkoutId);
      return res.status(400).send({
        error: "workoutId must be a numeric value, not a string like 'push-1'",
      });
    }

    if (rawWeight === undefined || rawWeight === null) {
      return res.status(400).send({ error: "weight is required" });
    }

    // Parse and validate workoutId
    console.log(
      "Raw workoutId from request:",
      rawWorkoutId,
      "type:",
      typeof rawWorkoutId
    );
    const workoutId = parseInt(rawWorkoutId);
    if (isNaN(workoutId)) {
      return res
        .status(400)
        .send({ error: "workoutId must be a valid number" });
    }

    // Parse and validate weight
    const weight = parseInt(rawWeight);
    if (isNaN(weight)) {
      return res.status(400).send({ error: "weight must be a valid number" });
    }

    // Update weight entry
    const workouts = await db.updateWeightEntry(userId, workoutId, weight);
    if (!workouts) {
      return res.status(404).send({ error: "Weight entry not found" });
    }

    console.log("Updated weight:", workouts);
    res.send(workouts);
  } catch (error) {
    console.error("Error in updateWeight:", error);
    res.status(500).send({ error: error.message });
  }
};

exports.deleteWeight = async (req, res) => {
  try {
    // Validate id parameter
    const rawId = req.params.id;
    if (!rawId) {
      return res.status(400).send({ error: "Weight entry ID is required" });
    }

    // Parse and validate ID
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).send({ error: "ID must be a valid number" });
    }

    console.log("Deleting weight entry with ID:", id);

    // Delete weight entry
    const deleted = await db.deleteWeightEntry(id);
    if (!deleted) {
      return res.status(404).send({ error: "Weight entry not found" });
    }

    console.log("Weight entry deleted:", deleted);
    res.send(deleted);
  } catch (error) {
    console.error("Error in deleteWeight:", error);
    res.status(500).send({ error: error.message });
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
        return res.status(409).send(["No User Found With Given Email"]);

      let token = await db.getToken(user.id);

      if (!token) {
        token = await db.addToken(user, jwt.sign(user, "verify"));
      }
      console.log(process.env.API_URL);
      const url = `${process.env.API_URL}/recovery/${user.id}/${token.token}`;
      const subject = "Password Reset";
      const message = `
      <p>Click <a href="${url}">this link</a> to reset your password</p>
    `;

      await sendEmail(user.email, subject, message);

      res.status(200).send({ message: "Reset Link Sent to Email" });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
];

exports.verifyUrl = async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id);
    if (!user) return res.status(400).send({ message: "Invalid User" });

    const token = await db.getToken(req.params.id, req.params.token);
    if (!token) return res.status(400).send({ message: "Invalid Token" });

    res.redirect(
      `${process.env.CLIENT_URL}/reset-password/${req.params.id}/${req.params.token}`
    );
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id);
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await db.getToken(req.params.id, req.params.token);
    if (!token) return res.status(400).send({ message: "Invalid Link" });

    user.password = await pw.encryptPW(req.body.password);
    await db.changePassword(user.id, user.password);

    if (!user.verified) await db.verifyUser(user.id);
    await db.removeToken(token);

    res.status(200).send({ message: "Password Reset" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.createWorkoutTemplate = async (req, res) => {
  const { name, description, workoutIds } = req.body;
  const userId = req.user.id;

  try {
    const template = await db.createWorkoutTemplate({
      name,
      description,
      userId,
      workoutIds,
    });
    res.status(201).send(template);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create template" });
  }
};

exports.getWorkoutTemplates = async (req, res) => {
  const userId = req.user.id;

  try {
    const templates = await db.getWorkoutTemplates(userId);
    res.send(templates);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch templates" });
  }
};

exports.getWorkoutTemplate = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const template = await db.getWorkoutTemplate(id, userId);
    if (!template) {
      return res.status(404).send({ error: "Template not found" });
    }
    res.send(template);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch template" });
  }
};

exports.updateWorkoutTemplate = async (req, res) => {
  const { id } = req.params;
  const { name, description, workoutIds } = req.body;
  const userId = req.user.id;

  try {
    const template = await db.updateWorkoutTemplate(id, userId, {
      name,
      description,
      workoutIds,
    });
    if (!template) {
      return res.status(404).send({ error: "Template not found" });
    }
    res.send(template);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to update template" });
  }
};

exports.deleteWorkoutTemplate = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const template = await db.deleteWorkoutTemplate(id, userId);
    if (!template) {
      return res.status(404).send({ error: "Template not found" });
    }
    res.send({ message: "Template deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to delete template" });
  }
};

exports.validate = (req, res) => {
  res.status(200).json({ user: req.user });
};

// User Preferences
exports.getUserPreferences = async (req, res) => {
  const userId = req.user.id;

  try {
    const preferences = await db.getUserPreferences(userId);
    res.status(200).json(preferences);
  } catch (error) {
    console.error("Error getting user preferences:", error);
    res.status(500).json({ error: "Failed to get user preferences" });
  }
};

exports.updateTemplateOrder = async (req, res) => {
  const userId = req.user.id;
  const { templateOrder } = req.body;

  if (!Array.isArray(templateOrder)) {
    return res.status(400).json({ error: "Template order must be an array" });
  }

  try {
    const preferences = await db.updateTemplateOrder(userId, templateOrder);
    res.status(200).json(preferences);
  } catch (error) {
    console.error("Error updating template order:", error);
    res.status(500).json({ error: "Failed to update template order" });
  }
};
