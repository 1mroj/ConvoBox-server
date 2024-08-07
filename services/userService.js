import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET; 
const ERROR_CODES = {
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  SITE_ALREADY_EXISTS: 'SITE_ALREADY_EXISTS'
};

const userService = {};

// const generateOTP = () => {
//   const otp = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 6);
//   return otp;
// };

const generateOTP = () => {
  const otp = crypto.randomInt(1000, 10000).toString();
  return otp;
};


const sendOTP = async (email, otp, businessName) => {
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Convo Box - Password Reset OTP",
    text: `Dear ${businessName} Team,\n\nYou have requested a password reset for your account. Please use the following OTP to proceed:\n\nOTP: **${otp}**\n\nIf you did not request this password reset, please ignore this email.\n\nThank you,\nTeam Convo Box`,
  };

  await transporter.sendMail(mailOptions);
};

userService.createUser = async (
  businessName,
  businessWebsite,
  name,
  email,
  phone,
  password
) => {
  try {
    const existingUser = await prisma.Users.findUnique({ where: { email } });
    const existingSite = await prisma.Users.findUnique({ where: { businessWebsite } });

    if (existingUser) {
      throw {
        code: ERROR_CODES.USER_ALREADY_EXISTS,
        message: "User with this email already exists.",
      };
    }
    if (existingSite) {
      throw { code: ERROR_CODES.SITE_ALREADY_EXISTS, message: 'Business website already exists.' };
    }
    
    
    const user_id = uuidv4().substr(0, 6);

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPhone = await bcrypt.hash(phone, 10);

    const user = await prisma.Users.create({
      data: {
        user_id,
        businessName,
        businessWebsite,
        name,
        email,
        phone: hashedPhone,
        password: hashedPassword,
      },
    });

    const accessToken = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
      }
    );

    console.log(accessToken);

    await prisma.Users.update({
      where: { user_id: user.user_id },
      data: { accessToken },
    });

    return user;
  } catch (error) {
    throw error;
  }
};

userService.getUserByEmail = async (email) => {
  try {
    const user = await prisma.Users.findUnique({ where: { email } });
    return user;
  } catch (error) {
    throw error;
  }
};

userService.forgotPassword = async (email) => {
  try {
    const otp = generateOTP();
    const user = await prisma.Users.findUnique({ where: { email } });
    if (!user) {
      throw {
        code: "USER_NOT_FOUND",
        message: "User with this email not found.",
      };
    }
    await prisma.Users.update({
      where: { email },
      data: { otp },
    });
    await sendOTP(email, otp, user.businessName);
    return { message: "Please check your email for OTP" };
  } catch (error) {
    throw error;
  }
};

userService.resendOTP = async (email) => {
  try {
    const otp = generateOTP();
    const user = await prisma.Users.findUnique({ where: { email } });
    await prisma.Users.update({
      where: { email },
      data: { otp }
    });
    await sendOTP(email, otp, user.businessName);
    return { message: 'New OTP sent successfully' };
  } catch (error) {
    throw error;
  }
};


userService.verifyOTP = async (email, otp) => {
  try {
    const user = await prisma.Users.findUnique({ where: { email } });
    if (user && user.otp === otp) {
      await prisma.Users.update({
        where: { email },
        data: {
          otp: null,
          otpverified: "yes",
        },
      });
      const token = jwt.sign(
        {
          email: user?.email,
          userid: user?.user_id,
        },
        process.env.JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "5m",
        }
      );
      return { status: true, token: token };
    } else {
      return { status: false, token: null };
    }
  } catch (error) {
    throw error;
  }
};

userService.resetPassword = async (email, newPassword, confirmPassword) => {
  try {
    const user = await prisma.Users.findUnique({ where: { email } });
    if (!user) {
      throw { code: 'USER_NOT_FOUND', message: 'User with this email not found.' };
    }
    if (newPassword !== confirmPassword) {
      throw { code: 'PASSWORD_MISMATCH', message: 'Passwords do not match.' };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.Users.update({
      where: { email },
      data: { password: hashedPassword, otpverified: 'no' }
    });
    return { message: 'Password reset successful' };
  } catch (error) {
    throw error;
  }
};

export default userService;
