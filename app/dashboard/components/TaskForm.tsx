"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { taskSchema } from "@/lib/validators/task";
import { useTasks } from "@/lib/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";

type TaskFormData = z.infer<typeof taskSchema>;

export default function TaskForm() {
  const { addTask } = useTasks();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      assignee: "",
    },
  });

  const onSubmit = (data: TaskFormData) => {
    addTask.mutate(data);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Task title" {...form.register("title")} />
      {form.formState.errors.title && (
        <p className="text-red-500 text-sm">
          {form.formState.errors.title.message}
        </p>
      )}

      <Textarea placeholder="Description" {...form.register("description")} />

      <Select
        onValueChange={(val) =>
          form.setValue("status", val as TaskFormData["status"])
        }
        defaultValue={form.getValues("status")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="To Do">To Do</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Done">Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        onValueChange={(val) =>
          form.setValue("priority", val as TaskFormData["priority"])
        }
        defaultValue={form.getValues("priority")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="High">High</SelectItem>
        </SelectContent>
      </Select>

      <Input type="date" {...form.register("dueDate")} />

      <Input placeholder="Assignee (optional)" {...form.register("assignee")} />

      <Button type="submit" disabled={addTask.isPending}>
        {addTask.isPending ? "Adding..." : "Add Task"}
      </Button>
    </form>
  );
}
