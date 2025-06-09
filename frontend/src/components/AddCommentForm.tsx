import React, { useState } from "react";
import taskService from "../services/taskService";

interface AddCommentFormProps {
  taskId: number;
  onCommentAdded: () => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({
  taskId,
  onCommentAdded,
}) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("El comentario no puede estar vacío");
      return;
    }

    try {
      await taskService.addComment(taskId, { content });
      setContent("");
      setError("");
      onCommentAdded();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al agregar el comentario");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex space-x-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe un comentario..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={2}
        />
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Comentar
        </button>
      </div>
    </form>
  );
};

export default AddCommentForm;
