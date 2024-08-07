// UserController.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export function extractUserParams(req) {
    const { businessName, businessWebsite, name, email, phone, password } = req.body;
    return { businessName, businessWebsite, name, email, phone, password };
}

export async function loginUser(email, password) {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid password");
  }
  return user;
}

export async function updateUserLastLogin(email) {
  await prisma.users.update({
    where: { email },
    data: { lastLoginAt: new Date() }
  });
}

export async function resetPassword(email, newPassword, confirmPassword) {
  try {
    const user = await prisma.Users.findUnique({ where: { email } });
    
    if (!user) {
      return {
        status: false,
        code: "USER_NOT_FOUND",
        message: "User with this email not found.",
      };
    }

    if (user.otpverified !== "yes") {
      return {
        status: false,
        code: "OTP_NOT_VERIFIED",
        message: "Please verify your email before resetting password.",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        status: false,
        code: "PASSWORD_MISMATCH",
        message: "Passwords do not match.",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.Users.update({
      where: { email },
      data: { password: hashedPassword, otpverified: "no" },
    });

    return {
      status: true,
      code: "Password Reset",
      message: "Password is reset",
    };
  } catch (error) {
    throw error;
  }
}

