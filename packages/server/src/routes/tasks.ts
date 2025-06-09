import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Obtener todas las tareas
router.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const tasks = await prisma.task.findMany({
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener tareas" });
    }
  }
);

// Crear tarea
router.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { title, description, weight, assigneeId, startDate, dueDate } =
        req.body;
      const creatorId = req.user?.userId;

      if (!creatorId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      // Validar fechas
      if (!startDate || !dueDate) {
        res
          .status(400)
          .json({ message: "Las fechas de inicio y fin son requeridas" });
        return;
      }

      const task = await prisma.task.create({
        data: {
          title,
          description,
          weight: Math.min(Math.max(weight, 1), 10), // Asegurar que el peso esté entre 1 y 10
          creatorId,
          assigneeId: assigneeId || null,
          status: "PENDING",
          startDate: new Date(startDate),
          dueDate: new Date(dueDate),
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: "Error al crear tarea" });
    }
  }
);

// Actualizar estado de tarea
router.patch(
  "/:id/status",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const task = await prisma.task.findUnique({
        where: { id: Number(id) },
        include: { assignee: true },
      });

      if (!task) {
        res.status(404).json({ message: "Tarea no encontrada" });
        return;
      }

      if (task.assigneeId !== userId && task.creatorId !== userId) {
        res
          .status(403)
          .json({ message: "No tienes permiso para actualizar esta tarea" });
        return;
      }

      const updatedTask = await prisma.task.update({
        where: { id: Number(id) },
        data: { status },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar estado de tarea" });
    }
  }
);

// Agregar comentario a tarea
router.post(
  "/:id/comments",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const task = await prisma.task.findUnique({
        where: { id: Number(id) },
      });

      if (!task) {
        res.status(404).json({ message: "Tarea no encontrada" });
        return;
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          taskId: Number(id),
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Error al agregar comentario" });
    }
  }
);

// Obtener tareas asignadas al usuario
router.get(
  "/assigned",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const tasks = await prisma.task.findMany({
        where: { assigneeId: userId },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener tareas asignadas" });
    }
  }
);

// Obtener tareas creadas por el usuario
router.get(
  "/created",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const tasks = await prisma.task.findMany({
        where: { creatorId: userId },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener tareas creadas" });
    }
  }
);

export default router;
