import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, isAdmin, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Obtener todos los usuarios (solo admin)
router.get(
  "/",
  authMiddleware,
  isAdmin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          isApproved: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  }
);

// Obtener usuario por ID
router.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = Number(id);

      // Verificar si el usuario es admin o está accediendo a su propio perfil
      if (req.user?.role !== "ADMIN" && req.user?.userId !== userId) {
        res.status(403).json({ message: "Acceso denegado" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          isApproved: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener usuario" });
    }
  }
);

// Actualizar usuario
router.put(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = Number(id);
      const { name, email } = req.body;

      // Verificar si el usuario es admin o está actualizando su propio perfil
      if (req.user?.role !== "ADMIN" && req.user?.userId !== userId) {
        res.status(403).json({ message: "Acceso denegado" });
        return;
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          email,
        },
        select: {
          id: true,
          email: true,
          name: true,
          isApproved: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar usuario" });
    }
  }
);

export default router;
