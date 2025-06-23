import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "../validators/task";

export const useTasks = () => {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await fetch("/api/tasks");
      return res.json();
    },
  });

  const addTask = useMutation({
    mutationFn: async (task: Omit<Task, "id">) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(task),
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      await fetch("/api/tasks", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return { tasks, isLoading, addTask, deleteTask };
};
