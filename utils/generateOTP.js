const generateOTP = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
};

const generateOTPExpiry = (expiryMinutes = 1) => {
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + expiryMinutes);
    return otpExpiry.getTime();;
};

module.exports = {generateOTP, generateOTPExpiry};