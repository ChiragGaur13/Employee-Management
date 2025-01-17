'use client';
import { useState, useEffect } from 'react';
import { teamMembers } from '@/api/team';

type Task = {
  id: number;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Completed';
};

export default function TaskManagementPage({ params }: { params: { id: string } }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'To Do' as 'To Do' | 'In Progress' | 'Completed',
  });
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [employeeName, setEmployeeName] = useState<string | null>(null);

  const employeeId = params?.id ? parseInt(params.id, 10) : null;

  useEffect(() => {
    if (employeeId) {
      const employees = teamMembers();
      const employee = employees.find((emp) => emp.id === employeeId);
      setEmployeeName(employee ? employee.name : null);

      const storedTasks = localStorage.getItem(`tasks_${employeeId}`);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    }
  }, [employeeId]);

  if (!employeeId) {
    return <div className="text-center text-red-500 mt-10">Error: Invalid Employee ID</div>;
  }

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.description.trim()) {
      alert('Please provide both a title and a description for the task.');
      return;
    }

    const newTaskToAdd = { id: Date.now(), ...newTask };
    const updatedTasks = [...tasks, newTaskToAdd];
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${employeeId}`, JSON.stringify(updatedTasks));
    setNewTask({ title: '', description: '', status: 'To Do' });
  };

  const handleDeleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${employeeId}`, JSON.stringify(updatedTasks));
  };

  const handleEditTask = (id: number) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setNewTask(taskToEdit);
      setEditTaskId(id);
    }
  };

  const handleSaveEdit = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editTaskId ? { ...task, ...newTask } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${employeeId}`, JSON.stringify(updatedTasks));
    setNewTask({ title: '', description: '', status: 'To Do' });
    setEditTaskId(null);
  };

  return (
    <main className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Task Management for {employeeName}
      </h1>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Task Title"
          className="border p-3 rounded-md flex-grow"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Task Description"
          className="border p-3 rounded-md flex-grow"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <select
          className="border p-3 rounded-md"
          value={newTask.status}
          onChange={(e) =>
            setNewTask({
              ...newTask,
              status: e.target.value as 'To Do' | 'In Progress' | 'Completed',
            })
          }
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        {editTaskId ? (
          <button
            className="bg-green-500 text-white px-4 py-3 rounded-md"
            onClick={handleSaveEdit}
          >
            Save Task
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-3 rounded-md"
            onClick={handleAddTask}
          >
            Add Task
          </button>
        )}
      </div>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-4 bg-white shadow-md rounded-md flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-lg">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-white text-sm ${
                  task.status === 'Completed'
                    ? 'bg-green-500'
                    : task.status === 'In Progress'
                    ? 'bg-yellow-500'
                    : 'bg-gray-500'
                }`}
              >
                {task.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-yellow-500 text-white px-3 py-2 rounded-md"
                onClick={() => handleEditTask(task.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-2 rounded-md"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
