const sendResponse = require("@utils/sendResponse");
const { User } = require("@models");
const { createData } = require("../utils/GenericMethods");
const { generateHashedPassword } = require("../utils/GenerateHash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../validations/user");
const register = async (req, res) => {
  //* Saves User into the database.

  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { staff_id, staff_name, email, phoneNumber, password } = req.body;

  try {
    const newData = {
      staff_id,
      staff_name,
      email,
      phoneNumber,
      password: await generateHashedPassword(password),
    };

    const data = await createData(User, newData);
    sendResponse(res, 201, data, null, "User registered successfully");
  } catch (error) {
    sendResponse(res, 400, null, error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return sendResponse(res, 404, null, "User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, staff_id: user.staff_id,staff_name:user.staff_name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    sendResponse(res, 200, { token }, null, "User logged in successfully");
  } catch (error) {
    sendResponse(res, 400, null, error.message);
  }
};

module.exports = { register, login };
