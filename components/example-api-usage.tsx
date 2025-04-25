"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Trash } from "lucide-react"

// This is an example component showing how to properly sync frontend and backend
export default function ExampleApiUsage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [newTask, setNewTask] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    setIsLoading(true)
    setError("")

    try {
      const response = await getTasks()
      setTasks(response.data)
    } catch (err) {
      setError("Failed to fetch tasks")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTask.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await createTask({ title: newTask, completed: false })
      setTasks([...tasks, response.data])
      setNewTask("")
    } catch (err) {
      setError("Failed to create task")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleTask(id: number, completed: boolean) {
    setIsLoading(true)
    setError("")

    try {
      await updateTask(id, { completed: !completed })
      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !completed } : task)))
    } catch (err) {
      setError("Failed to update task")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteTask(id: number) {
    setIsLoading(true)
    setError("")

    try {
      await deleteTask(id)
      setTasks(tasks.filter((task) => task.id !== id))
    } catch (err) {
      setError("Failed to delete task")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Tasks</h2>

      {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">{error}</div>}

      <form onSubmit={handleCreateTask} className="flex gap-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </Button>
      </form>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-muted-foreground">No tasks yet</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id, task.completed)}
                  className="h-4 w-4"
                />
                <span className={task.completed ? "line-through text-muted-foreground" : ""}>{task.title}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} aria-label="Delete task">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
