const bcrypt = require("bcrypt");


const generateHashedPassword =async(password)=>{
    const saltRounds = 10; // Number of salt rounds for bcrypt

    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error('Error generating hashed password');
    }
}

module.exports = { generateHashedPassword };