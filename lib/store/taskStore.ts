import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task } from "@/lib/validators/task";

type Filters = {
  searchText: string;
  status: string;
  priority: string;
};

type TaskStore = {
  tasks: Task[];
  filters: Filters;
  editingTask: Task | null;

  // Task operations
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, newStatus: Task["status"]) => void;
  setTasks: (tasks: Task[]) => void;

  // Filters
  setFilters: (filters: Partial<Filters>) => void;

  // Modal editing
  setEditingTask: (task: Task | null) => void;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      // Initial state
      tasks: [],
      filters: {
        searchText: "",
        status: "",
        priority: "",
      },
      editingTask: null,

      // Task CRUD
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),

      updateTask: (task) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      updateTaskStatus: (id, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status: newStatus } : task
          ),
        })),

      setTasks: (tasks) => set({ tasks }),

      // Filters
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      // Editing modal control
      setEditingTask: (task) => set({ editingTask: task }),
    }),
    {
      name: "task-storage", // Key in localStorage
      partialize: (state) => ({
        tasks: state.tasks, // Only persist tasks
      }),
    }
  )
);
