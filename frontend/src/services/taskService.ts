import api from "./api";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  weight: number;
  startDate: string;
  dueDate: string;
  assignedTo?: {
    id: number;
    name: string;
    email: string;
  };
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
  comments: {
    id: number;
    content: string;
    createdAt: string;
    user: {
      id: number;
      name: string;
    };
  }[];
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  weight: number;
  startDate: string;
  dueDate: string;
  assignedToId?: number;
}

export interface UpdateTaskStatusData {
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export interface AddCommentData {
  content: string;
}

const taskService = {
  // Obtener todas las tareas
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get("/tasks");
    return response.data;
  },

  // Obtener tareas asignadas al usuario actual
  getAssignedTasks: async (): Promise<Task[]> => {
    const response = await api.get("/tasks/assigned");
    return response.data;
  },

  // Obtener tareas creadas por el usuario actual
  getCreatedTasks: async (): Promise<Task[]> => {
    const response = await api.get("/tasks/created");
    return response.data;
  },

  // Crear una nueva tarea
  createTask: async (data: CreateTaskData): Promise<Task> => {
    const response = await api.post("/tasks", data);
    return response.data;
  },

  // Actualizar el estado de una tarea
  updateTaskStatus: async (
    taskId: number,
    data: UpdateTaskStatusData
  ): Promise<Task> => {
    const response = await api.patch(`/tasks/${taskId}/status`, data);
    return response.data;
  },

  // Agregar un comentario a una tarea
  addComment: async (taskId: number, data: AddCommentData): Promise<Task> => {
    const response = await api.post(`/tasks/${taskId}/comments`, data);
    return response.data;
  },
};

export default taskService;
