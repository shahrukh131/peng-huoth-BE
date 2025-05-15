const sendResponse = require("@utils/sendResponse");
const { User } = require("@models");
const { createData } = require("../utils/GenericMethods");
const { generateHashedPassword } = require("../utils/GenerateHash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../validations/user");
const Joi = require("joi");
const { generateOTPExpiry, generateOTP } = require("../utils/generateOTP");
const register = async (req, res) => {
  //* Saves User into the database.

  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { staff_id, staff_name, email, phoneNumber, password } = req.body;

  try {
    const newData = {
      // staff_id,
      // staff_name,
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
      // return sendResponse(res, 401, null, "Invalid password");
      return sendResponse(res, 400, null, null, "Invalid password");
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        staff_id: user.staff_id,
        staff_name: user.staff_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    sendResponse(res, 200, { token }, null, "User logged in successfully");
  } catch (error) {
    sendResponse(res, 400, null, error.message);
  }
};

const initiateRegister = async (req, res) => {
  const { staff_id, staff_name, email, phoneNumber } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (user) {
      if (user.isRegistered) {
        return sendResponse(res, 400, null, "User already registered");
      }
      const currentTime = Date.now();
      if (user.otp && user.otpExpiry > currentTime) {
        return sendResponse(
          res,
          200,
          { otp: user.otp, otpExpiry: user.otpExpiry },
          null,
          "OTP already sent"
        );
      }
    } else {
      user = await User.create({
        staff_id,
        staff_name,
        email,
        phoneNumber,
      });
    }

    // Generate OTP and its expiry time
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    sendResponse(res, 200, { otp, otpExpiry }, null, "OTP Sent Successfully");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!email || !otp) {
      sendResponse(res, 400, null, "User ID and OTP are required");
    }

    if (!user) {
      return sendResponse(res, 404, null, "User not found");
    }

    if (user.otp !== otp) {
      return sendResponse(res, 400, null, "Invalid OTP");
    }

    if (user.otpExpiry < Date.now()) {
      // Check if OTP has expired
      return sendResponse(res, 400, null, "OTP has expired");
    }

    // user.isRegistered = true;
    user.isPhoneVerfied = true;
    user.otp = null; // Clear OTP after successful verification
    await user.save();

    sendResponse(res, 200, null, null, "OTP verified successfully");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
};

const completeRegistration = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    const hashedPassword = await generateHashedPassword(password);

    user.password = hashedPassword;
    user.isRegistered = true;
    user.isPhoneVerfied = true;
    user.otp = null; // Clear OTP after successful registration
    user.otpExpiry = null;
    await user.save();
    sendResponse(res, 200, user, null, "User registered successfully");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    if (newPassword !== confirmPassword) {
      return sendResponse(res, 400, null, "Passwords do not match");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return sendResponse(res, 404, null, "User not found");
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return sendResponse(res, 400, null, "Invalid current password");
    }

    const hashedPassword = await generateHashedPassword(newPassword);
     await User.update(
      { 
        password: hashedPassword, 
        updated_at: new Date() 
      },
      {
        where: { id: userId }
      }
    );

     return sendResponse(res, 200, null, null, "Password updated successfully");
  } catch (error) {
    return sendResponse(res, 500, null, error.message);
  }
};

module.exports = {
  register,
  login,
  initiateRegister,
  verifyOTP,
  completeRegistration,
  changePassword,
};
