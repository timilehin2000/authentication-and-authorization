const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const {
  signUpValidation,
  loginValidation,
} = require("../middlewares/validator");

exports.userSignup = async (req, res) => {
  //validate user's details
  const { error } = await signUpValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user exists
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) res.status(400).send(`${req.body.email} already exists`);

  //hash users password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //register the user
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hashPassword,
    role: req.body.role,
  });

  //generate a token for the registered user
  const token = jwt.sign({ id: user._id }, process.env.TOKEN, {
    expiresIn: "48hr",
  });
  user.token = token;

  try {
    const savedUser = await user.save();
    res.status(200).json({
      message: `${user.email} succesfully registered`,
      data: {
        savedUser,
      },
    });
  } catch (err) {
    res.status(404).send(err);
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { error } = await loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user is registered
    const user = await User.findOne({ email: req.body.email });
    if (!user) res.status(400).send(`email or password is incorrect`);

    //check if the user's password is the same as the registered password
    const validPassword = bcrypt.compare(req.body.password, user.password);
    if (!validPassword) res.status(400).send("email or password is incorrect");

    //generate a token for the loggedIn user
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.TOKEN,
      {
        expiresIn: "48hr",
      }
    );

    //update the new token with the previous
    const result = await User.findByIdAndUpdate(
      user._id,
      { token: token },
      { useFindAndModify: false }
    );
    console.log(result);
    //console.log(req.user);
    return res.header("auth-token", token).send({
      status: "Login succesfull",
      _id: result.id,
      token: result.token,
    });
    // token = req.token;
  } catch (err) {
    console.log(err);
  }
};

exports.becomeAdmin = async (req, res) => {
  try {
    const result = await User.findOne({ _id: req.user.id });

    if (!result) res.status(401).send("You have to login first");
    if (result.role === "tutor") {
      const userUpdatedRole = await User.findByIdAndUpdate(
        result._id,
        { role: "admin" },
        { useFindAndModify: false }
      );
      console.log(userUpdatedRole);
      res.status(401).send({
        message: `congrats!, ${result.email} You're now an admin`,
        role: userUpdatedRole.role,
      });
    } else if (result.role === "admin") {
      res.status(400).send({
        message: "You cannot become an amin",
      });
    } else {
      res.status(400).send("You have to be a tutor");
    }
  } catch (err) {
    console.log(err);
  }
};
