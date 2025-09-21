const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const { signToken, verifyToken } = require("../utils/token"); 

const prisma = new PrismaClient();

const createUserSchema = z.object({
  name: z.string().min(2).max(20),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["Reporter", "Admin"]).optional()
});

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

async function signup(req, res) {
  try {
    const userData = createUserSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email: userData.email }
    });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    userData.password = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({ data: userData });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return res
      .status(201)
      .json({ message: "User created successfully", user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function login(req, res) {
  try {
    const loginData = loginUserSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: loginData.email }
    });
    if (!user) {
      return res.status(400).json({ message: "User does not exist. Please sign up." });
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { signup, login };
