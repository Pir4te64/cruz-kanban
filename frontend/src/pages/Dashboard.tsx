import React, { useEffect, useState } from "react";

const columns = [
  { key: "BACKLOG", label: "BACKLOG" },
  { key: "DESIGN", label: "DESIGN" },
  { key: "BUILD_QA", label: "BUILD / QA" },
  { key: "SIGN_OFF", label: "SIGN-OFF" },
  { key: "DONE", label: "DONE" },
];

const allUsers = [
  {
    name: "ADMIN",
    role: "Project Manager",
    color: "bg-indigo-200",
    text: "text-indigo-700",
  },
  {
    name: "GABRIELA",
    role: "Developer",
    color: "bg-pink-200",
    text: "text-pink-700",
  },
  {
    name: "VICTOR",
    role: "Developer",
    color: "bg-green-200",
    text: "text-green-700",
  },
  {
    name: "DANNYS",
    role: "QA",
    color: "bg-yellow-200",
    text: "text-yellow-700",
  },
  {
    name: "DANIEL",
    role: "UX Designer",
    color: "bg-blue-200",
    text: "text-blue-700",
  },
  {
    name: "PEDRO",
    role: "Backend",
    color: "bg-purple-200",
    text: "text-purple-700",
  },
  {
    name: "BRIAN",
    role: "Frontend",
    color: "bg-red-200",
    text: "text-red-700",
  },
  {
    name: "GUILLE",
    role: "Scrum Master",
    color: "bg-teal-200",
    text: "text-teal-700",
  },
  {
    name: "CESAR",
    role: "DevOps",
    color: "bg-orange-200",
    text: "text-orange-700",
  },
  {
    name: "MARIO",
    role: "Tester",
    color: "bg-gray-200",
    text: "text-gray-700",
  },
];

const team = allUsers;

const prototypes = [
  { label: "DESKTOP PROTOTYPE", link: "#" },
  { label: "MOBILE PROTOTYPE", link: "#" },
  { label: "TABLET PROTOTYPE", link: "#" },
];

const initialTasks = [
  {
    id: 1,
    epic: "EPIC",
    title: "Crear tablero kanban",
    ticket: "#1001",
    status: "BACKLOG",
    labels: ["UX"],
    assignedTo: ["ADMIN"],
    comments: ["Revisar requisitos"],
    priority: "Media",
  },
  {
    id: 2,
    epic: "EPIC",
    title: "Diseñar UI",
    ticket: "#1002",
    status: "DESIGN",
    labels: ["UI", "Figma"],
    assignedTo: ["VICTOR"],
    comments: [],
    priority: "Media",
  },
  {
    id: 3,
    epic: "EPIC",
    title: "Implementar drag & drop",
    ticket: "#1003",
    status: "BUILD_QA",
    labels: ["React"],
    assignedTo: ["ADMIN"],
    comments: ["Testear en mobile"],
    priority: "Media",
  },
  {
    id: 4,
    epic: "EPIC",
    title: "QA y pruebas",
    ticket: "#1004",
    status: "SIGN_OFF",
    labels: ["QA"],
    assignedTo: ["VICTOR"],
    comments: [],
    priority: "Media",
  },
  {
    id: 5,
    epic: "EPIC",
    title: "Deploy producción",
    ticket: "#1005",
    status: "DONE",
    labels: ["Deploy"],
    assignedTo: ["ADMIN"],
    comments: ["Listo para cliente"],
    priority: "Media",
  },
];

type Project = {
  name: string;
  dueDate: string;
  prototypes: string[];
  team: string[];
};

// Iconos SVG para comentarios y tareas (puedes reemplazar por librería de iconos si lo prefieres)
const CommentIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 3.866-3.582 7-8 7a8.96 8.96 0 01-4-.93L3 21l1.07-3.21A7.96 7.96 0 013 12c0-3.866 3.582-7 8-7s8 3.134 8 7z"
    />
  </svg>
);
const TaskIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2l4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const columnColors = [
  "bg-[#23272f] text-white border border-[#31343c]",
  "bg-[#23272f] text-white border border-[#31343c]",
  "bg-[#23272f] text-white border border-[#31343c]",
  "bg-[#23272f] text-white border border-[#31343c]",
  "bg-[#23272f] text-white border border-[#31343c]",
];

const labelColors: Record<string, string> = {
  UX: "bg-[#ff4d00] text-white",
  UI: "bg-[#4DFFFF] text-gray-900",
  Figma: "bg-[#bdbdbd] text-gray-900",
  React: "bg-[#bdbdbd] text-gray-900",
  QA: "bg-[#bdbdbd] text-gray-900",
  Deploy: "bg-[#bdbdbd] text-gray-900",
  Research: "bg-[#bdbdbd] text-gray-900",
  Development: "bg-[#bdbdbd] text-gray-900",
  Design: "bg-[#bdbdbd] text-gray-900",
};

const priorityColors: Record<string, string> = {
  Alta: "bg-[#ff4d00] bg-opacity-80 text-white border border-[#ff4d00]",
  Media: "bg-gray-400 text-white border border-gray-400",
  Baja: "bg-[#4DFFFF] bg-opacity-80 text-gray-900 border border-[#4DFFFF]",
};

const Dashboard: React.FC = () => {
  const [kanbanUser, setKanbanUser] = useState<string | null>(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [projects, setProjects] = useState<Project[]>([
    {
      name: "Logistica Argentina",
      dueDate: "00/00/00",
      prototypes: prototypes.map((p) => p.label),
      team: team.map((t) => t.name),
    },
  ]);
  const [selectedProject, setSelectedProject] = useState(0);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState<Project>({
    name: "",
    dueDate: "",
    prototypes: [],
    team: [],
  });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    epic: "EPIC",
    title: "",
    ticket: "",
    status: columns[0].key,
    labels: [] as string[],
    assignedTo: [] as string[],
    comments: [] as string[],
    priority: "Media" as "Baja" | "Media" | "Alta",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("kanban_user");
    setKanbanUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("kanban_user");
    window.location.href = "/login";
  };

  const handleDragStart = (task: any) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: string) => {
    if (draggedTask) {
      setTasks(
        tasks.map((task) =>
          task.id === draggedTask.id ? { ...task, status } : task
        )
      );
      setDraggedTask(null);
    }
  };

  const moveTask = (taskId: number, newStatus: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const addComment = (taskId: number) => {
    if (!newComment[taskId]?.trim()) return;
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, newComment[taskId]] }
          : task
      )
    );
    setNewComment({ ...newComment, [taskId]: "" });
  };

  const getNextColumn = (currentStatus: string) => {
    const currentIndex = columns.findIndex((col) => col.key === currentStatus);
    if (currentIndex < columns.length - 1) {
      return columns[currentIndex + 1];
    }
    return null;
  };

  const getPrevColumn = (currentStatus: string) => {
    const currentIndex = columns.findIndex((col) => col.key === currentStatus);
    if (currentIndex > 0) {
      return columns[currentIndex - 1];
    }
    return null;
  };

  const getUser = (name: string) => team.find((u) => u.name === name);

  // Crear proyecto
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    setProjects([
      ...projects,
      {
        ...newProject,
        prototypes: newProject.prototypes,
        team: newProject.team,
      },
    ]);
    setNewProject({ name: "", dueDate: "", prototypes: [], team: [] });
    setShowProjectForm(false);
    setSelectedProject(projects.length);
  };

  // Crear tarea
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    setTasks([
      ...tasks,
      {
        ...newTask,
        id: Date.now(),
      },
    ]);
    setNewTask({
      epic: "EPIC",
      title: "",
      ticket: "",
      status: columns[0].key,
      labels: [],
      assignedTo: [],
      comments: [],
      priority: "Media",
    });
    setShowTaskForm(false);
  };

  // Eliminar tarea
  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Eliminar proyecto con confirmación
  const handleDeleteProject = () => {
    setShowDeleteModal(true);
  };
  const confirmDeleteProject = () => {
    const newProjects = projects.filter((_, idx) => idx !== selectedProject);
    setProjects(newProjects);
    setSelectedProject(0);
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen flex bg-black font-aeonik">
      {/* Modal de confirmación de borrado de proyecto */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#23272f] p-8 rounded-xl shadow-xl text-white w-full max-w-sm flex flex-col items-center">
            <div className="text-xl font-bold mb-4 font-stange">
              ¿Eliminar proyecto?
            </div>
            <div className="mb-6 text-center text-gray-300">
              Esta acción no se puede deshacer. ¿Seguro que deseas eliminar este
              proyecto?
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteProject}
                className="px-4 py-2 rounded bg-red-700 hover:bg-red-800 text-white font-semibold"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <aside className="w-72 bg-[#111] border-r border-[#23272f] flex flex-col p-6 min-h-screen shadow-md">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/CRUZ.png"
              alt="CRUZ logo"
              className="w-24 h-auto object-contain"
            />
          </div>
          {/* Selector de proyecto */}
          <div className="mb-4 flex gap-2 items-center">
            <select
              className="w-full p-2 rounded border border-[#23272f] bg-[#181a20] text-white"
              value={selectedProject}
              onChange={(e) => setSelectedProject(Number(e.target.value))}
            >
              {projects.length === 0 ? (
                <option value={0}>Sin proyectos</option>
              ) : (
                projects.map((p, idx) => (
                  <option key={idx} value={idx}>
                    {p.name}
                  </option>
                ))
              )}
            </select>
            <button
              className="px-3 py-2 bg-red-900 text-red-300 rounded-xl font-bold hover:bg-red-700 shadow"
              onClick={handleDeleteProject}
              title="Eliminar proyecto"
              disabled={projects.length === 0}
            >
              ×
            </button>
          </div>
          <button
            className="w-full mb-4 px-4 py-2 bg-pink-700 text-white rounded-xl font-semibold hover:bg-pink-800 shadow"
            onClick={() => setShowProjectForm((v) => !v)}
          >
            {showProjectForm ? "Cancelar" : "Crear nuevo proyecto"}
          </button>
          {showProjectForm && (
            <form
              onSubmit={handleCreateProject}
              className="mb-4 bg-[#23272f] p-4 rounded-xl shadow space-y-2"
            >
              <input
                type="text"
                placeholder="Nombre del proyecto"
                className="w-full p-2 rounded border border-[#23272f] bg-[#181a20] text-white"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
              />
              <input
                type="date"
                placeholder="Fecha de entrega"
                className="w-full p-2 rounded border border-[#23272f] bg-[#181a20] text-white"
                value={newProject.dueDate}
                onChange={(e) =>
                  setNewProject({ ...newProject, dueDate: e.target.value })
                }
              />
              <div className="text-xs text-white">Prototipos</div>
              {prototypes.map((p) => (
                <label
                  key={p.label}
                  className="flex items-center gap-2 text-sm text-white"
                >
                  <input
                    type="checkbox"
                    checked={newProject.prototypes.includes(p.label)}
                    onChange={() => {
                      setNewProject({
                        ...newProject,
                        prototypes: newProject.prototypes.includes(p.label)
                          ? newProject.prototypes.filter((l) => l !== p.label)
                          : [...newProject.prototypes, p.label],
                      });
                    }}
                  />
                  {p.label}
                </label>
              ))}
              <div className="text-xs text-white">Miembros</div>
              <select
                className="w-full p-2 rounded border border-[#23272f] bg-[#181a20] text-white"
                multiple
                value={newProject.team}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions).map(
                    (opt) => opt.value
                  );
                  setNewProject({ ...newProject, team: options });
                }}
              >
                {allUsers.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
              <button
                className="w-full mt-2 px-4 py-2 bg-pink-700 text-white rounded-xl font-semibold hover:bg-pink-800 shadow"
                type="submit"
              >
                Crear proyecto
              </button>
            </form>
          )}
          {/* Info del proyecto seleccionado */}
          {projects.length > 0 && (
            <>
              <div className="text-lg text-white mb-8 font-stange">
                {projects[selectedProject].name}
              </div>
              <div className="text-xs text-white mb-1">DUE DATE</div>
              <div className="text-base mb-6 flex items-center gap-2">
                <span className="text-gray-400">📅</span>
                {projects[selectedProject].dueDate}
              </div>
              <div className="text-xs text-white mt-4 mb-1">PROTOTYPE</div>
              <ul className="mb-4 space-y-1">
                {projects[selectedProject]?.prototypes.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2 text-xs font-semibold text-[#b30059]"
                  >
                    <span className="text-lg leading-none">•</span> {p}
                  </li>
                ))}
              </ul>
              <div className="text-xs text-white mb-2">THE TEAM</div>
              <ul
                className="space-y-3 max-h-96 overflow-y-auto pr-1"
                style={{ maxHeight: "19rem" }}
              >
                {allUsers
                  .filter((m) =>
                    projects[selectedProject].team.includes(m.name)
                  )
                  .map((member) => (
                    <li
                      key={member.name}
                      className="flex items-center gap-3 bg-[#23272f] rounded-xl p-3"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${member.color} ${member.text}`}
                      >
                        {member.name[0]}
                      </div>
                      <div>
                        <div className="text-base font-bold text-white font-stange">
                          {member.name}
                        </div>
                        <div className="text-xs text-gray-200">
                          {member.role}
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col bg-[#000]">
        {/* Header minimalista */}
        <header className="flex items-center justify-end px-16 py-8 bg-[#000] border-b-2 border-[#23272f]">
          <div className="flex flex-col items-end gap-2">
            <div className="text-lg text-white font-stange">
              Bienvenido,{" "}
              <span className="font-bold text-pink-400">{kanbanUser}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 shadow text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </header>
        {/* Kanban columns */}
        <main className="flex-1 overflow-x-auto p-12">
          <div className="flex gap-6 min-w-[1200px]">
            {columns.map((col, idx) => (
              <div key={col.key} className="flex-1 min-w-[220px]">
                {/* Column header */}
                <div
                  className={`flex items-center gap-2 mb-6 rounded-xl px-4 py-2 ${
                    columnColors[idx % columnColors.length]
                  }`}
                >
                  <span className="font-bold text-lg font-stange">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-lg font-stange">
                    {col.label.replace("_", " ")}
                  </span>
                  <span className="ml-auto font-bold text-base font-stange">
                    {tasks.filter((t) => t.status === col.key).length}
                  </span>
                </div>
                {/* Formulario para crear tarea nueva (igual, pero fondo oscuro y textos claros) */}
                {col.key === columns[0].key && (
                  <div className="mb-4">
                    <button
                      className="w-full mb-2 px-3 py-1 bg-pink-700 text-white rounded-xl font-semibold hover:bg-pink-800 shadow text-sm"
                      onClick={() => setShowTaskForm((v) => !v)}
                    >
                      {showTaskForm ? "Cancelar" : "Agregar tarea"}
                    </button>
                    {showTaskForm && (
                      <form
                        onSubmit={handleCreateTask}
                        className="bg-[#1f2124] p-2 rounded-xl shadow space-y-2 text-sm"
                      >
                        <input
                          type="text"
                          placeholder="Título"
                          className="w-full p-1 rounded border border-[#23272f] bg-[#000] text-white"
                          value={newTask.title}
                          onChange={(e) =>
                            setNewTask({ ...newTask, title: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Ticket"
                          className="w-full p-1 rounded border border-[#23272f] bg-[#000] text-white"
                          value={newTask.ticket}
                          onChange={(e) =>
                            setNewTask({ ...newTask, ticket: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Etiquetas (separadas por coma)"
                          className="w-full p-1 rounded border border-[#23272f] bg-[#000] text-white"
                          value={newTask.labels.join(", ")}
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              labels: e.target.value
                                .split(",")
                                .map((l) => l.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                        <div className="text-xs text-white">Asignar a</div>
                        <div className="flex flex-col gap-1 mb-2">
                          {projects.length > 0 &&
                            allUsers
                              .filter((u) =>
                                projects[selectedProject].team.includes(u.name)
                              )
                              .map((m) => (
                                <label
                                  key={m.name}
                                  className="flex items-center gap-2 text-sm text-white"
                                >
                                  <input
                                    type="checkbox"
                                    checked={newTask.assignedTo.includes(
                                      m.name
                                    )}
                                    onChange={() => {
                                      setNewTask({
                                        ...newTask,
                                        assignedTo: newTask.assignedTo.includes(
                                          m.name
                                        )
                                          ? newTask.assignedTo.filter(
                                              (n) => n !== m.name
                                            )
                                          : [...newTask.assignedTo, m.name],
                                      });
                                    }}
                                  />
                                  {m.name}
                                </label>
                              ))}
                        </div>
                        <div className="text-xs text-white">Prioridad</div>
                        <select
                          className="w-full p-1 rounded border border-[#23272f] bg-[#000] text-white mb-2"
                          value={newTask.priority}
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              priority: e.target.value as
                                | "Baja"
                                | "Media"
                                | "Alta",
                            })
                          }
                        >
                          <option value="Baja">Baja</option>
                          <option value="Media">Media</option>
                          <option value="Alta">Alta</option>
                        </select>
                        <button
                          className="w-full mt-2 px-3 py-1 bg-pink-700 text-white rounded-xl font-semibold hover:bg-pink-800 shadow text-sm"
                          type="submit"
                        >
                          Crear tarea
                        </button>
                      </form>
                    )}
                  </div>
                )}
                {/* Tarjetas de tarea */}
                <div className="flex flex-col gap-4">
                  {tasks
                    .filter((t) => t.status === col.key)
                    .map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className="bg-[#000] rounded-xl shadow p-4 flex flex-col gap-2 border border-[#23272f] hover:shadow-lg transition-shadow text-white relative"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-pink-400">
                              {task.ticket}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {getPrevColumn(task.status) && (
                              <button
                                onClick={() =>
                                  moveTask(
                                    task.id,
                                    getPrevColumn(task.status)!.key
                                  )
                                }
                                className="text-base px-2 py-1 rounded-lg bg-[#23272f] hover:bg-[#31343c] text-gray-300 font-bold shadow"
                                title={`Mover a ${
                                  getPrevColumn(task.status)!.label
                                }`}
                              >
                                ←
                              </button>
                            )}
                            {getNextColumn(task.status) && (
                              <button
                                onClick={() =>
                                  moveTask(
                                    task.id,
                                    getNextColumn(task.status)!.key
                                  )
                                }
                                className="text-base px-2 py-1 rounded-lg bg-[#23272f] hover:bg-[#31343c] text-gray-300 font-bold shadow"
                                title={`Mover a ${
                                  getNextColumn(task.status)!.label
                                }`}
                              >
                                →
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-base px-2 py-1 rounded-lg bg-red-900 hover:bg-red-700 text-red-300 font-bold shadow ml-2"
                              title="Eliminar tarea"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <div className="text-base font-semibold text-white mb-1 font-stange">
                          {task.title}
                        </div>
                        <div className="flex gap-1 flex-wrap mb-1">
                          {task.labels.map((label, idx) => (
                            <span
                              key={idx}
                              className={`text-xs rounded-full px-2 py-0.5 font-semibold mr-1 ${
                                labelColors[label] ||
                                "bg-gray-700 text-gray-200"
                              }`}
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {task.assignedTo.map((user, idx) => {
                            const u = getUser(user);
                            return (
                              <div
                                key={user}
                                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${u?.color} ${u?.text} border-2 border-[#23272f]`}
                              >
                                {user[0]}
                              </div>
                            );
                          })}
                        </div>
                        {/* Comentarios y contadores */}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-gray-200">
                            <CommentIcon />
                            <span className="text-xs">
                              {task.comments.length}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-200">
                            <TaskIcon />
                            <span className="text-xs">1</span>
                          </div>
                        </div>
                        {/* Comentarios */}
                        <div className="mt-1">
                          <div className="flex gap-1 mb-1">
                            <input
                              type="text"
                              value={newComment[task.id] || ""}
                              onChange={(e) =>
                                setNewComment({
                                  ...newComment,
                                  [task.id]: e.target.value,
                                })
                              }
                              placeholder="Agregar comentario..."
                              className="flex-1 text-xs px-2 py-1 border border-[#23272f] rounded-lg bg-[#23272f] text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                            <button
                              onClick={() => addComment(task.id)}
                              className="text-xs px-2 py-1 bg-pink-700 text-white rounded-lg hover:bg-pink-800 font-bold shadow"
                            >
                              +
                            </button>
                          </div>
                          {task.comments.length > 0 && (
                            <div className="text-xs space-y-1">
                              {task.comments.map((c, idx) => (
                                <div
                                  key={idx}
                                  className="bg-[#23272f] border border-[#31343c] rounded-lg p-1 shadow-sm text-gray-200"
                                >
                                  {c}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div
                            className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                              priorityColors[task.priority || "Media"]
                            }`}
                          >
                            {task.priority || "Media"}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
