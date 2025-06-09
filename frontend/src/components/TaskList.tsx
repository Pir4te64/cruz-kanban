import React, { useState } from "react";
import type { Task } from "../services/taskService";
import AddCommentForm from "./AddCommentForm";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: number, status: TaskStatus) => void;
  onTaskUpdated: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onStatusChange,
  onTaskUpdated,
}) => {
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "text-red-600";
      case "MEDIUM":
        return "text-yellow-600";
      case "LOW":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                {task.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{task.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  task.status as TaskStatus
                )}`}
              >
                {task.status === "PENDING" && "Pendiente"}
                {task.status === "IN_PROGRESS" && "En Progreso"}
                {task.status === "COMPLETED" && "Completada"}
              </span>
              <span
                className={`text-sm font-medium ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority === "HIGH" && "Alta"}
                {task.priority === "MEDIUM" && "Media"}
                {task.priority === "LOW" && "Baja"}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Peso: {task.weight}</p>
              <p className="text-gray-500">
                Fecha de inicio: {new Date(task.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">
                Fecha de vencimiento:{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
              {task.assignedTo && (
                <p className="text-gray-500">
                  Asignado a: {task.assignedTo.name}
                </p>
              )}
            </div>
          </div>

          {task.status !== "COMPLETED" && (
            <div className="mt-4">
              <select
                value={task.status}
                onChange={(e) =>
                  onStatusChange(task.id, e.target.value as TaskStatus)
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PENDING">Pendiente</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="COMPLETED">Completada</option>
              </select>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={() => toggleTaskExpansion(task.id)}
              className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              {expandedTaskId === task.id
                ? "Ocultar comentarios"
                : "Mostrar comentarios"}
            </button>

            {expandedTaskId === task.id && (
              <div className="mt-4">
                {task.comments && task.comments.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {task.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded p-2">
                        <p className="text-sm text-gray-600">
                          {comment.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Por {comment.user.name} el{" "}
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <AddCommentForm
                  taskId={task.id}
                  onCommentAdded={onTaskUpdated}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
