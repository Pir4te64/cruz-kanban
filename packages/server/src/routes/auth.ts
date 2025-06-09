import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware, isAdmin, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Registro de usuario
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ message: "El usuario ya existe" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = await prisma.role.findUnique({
      where: { name: "USER" },
    });

    if (!userRole) {
      res.status(500).json({ message: "Error: Rol de usuario no encontrado" });
      return;
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: userRole.id,
        isApproved: false,
      },
    });

    res.status(201).json({
      message:
        "Usuario registrado exitosamente. Esperando aprobación del administrador.",
      userId: user.id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }

    if (!user.isApproved) {
      res.status(401).json({ message: "Usuario pendiente de aprobación" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.status(401).json({ message: "Credenciales inválidas" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role.name },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

// Aprobar usuario (solo admin)
router.post(
  "/approve/:userId",
  authMiddleware,
  isAdmin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      const user = await prisma.user.update({
        where: { id: Number(userId) },
        data: { isApproved: true },
      });

      res.json({ message: "Usuario aprobado exitosamente", user });
    } catch (error) {
      res.status(500).json({ message: "Error al aprobar usuario" });
    }
  }
);

// Obtener usuarios pendientes (solo admin)
router.get(
  "/pending",
  authMiddleware,
  isAdmin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const pendingUsers = await prisma.user.findMany({
        where: { isApproved: false },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      res.json(pendingUsers);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuarios pendientes" });
    }
  }
);

export default router;
