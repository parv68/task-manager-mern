import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTasks } from "./api";
function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editName, setEditName] = useState("");
  const [filter, setFilter] = useState("all"); // Filter state

  useEffect(() => {
    axios.get("http://localhost:5000/tasks")
      .then((response) => setTasks(response.data))
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);
  // Add Task
  const handleAddTask = () => {
    if (!taskName.trim()) return;
    axios.post("http://localhost:5000/tasks", { name: taskName, completed: false })
      .then((response) => setTasks([...tasks, response.data]))
      .catch((err) => console.error(err));
    setTaskName("");
  };

  // Delete Task
  const handleDeleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => setTasks(tasks.filter((task) => task._id !== id)))
      .catch((err) => console.error(err));
  };

  // Toggle Completed
  const handleToggleComplete = (id) => {
    const task = tasks.find((task) => task._id === id);
    axios.put(`http://localhost:5000/tasks/${id}`, { ...task, completed: !task.completed })
      .then((response) =>
        setTasks(tasks.map((t) => (t._id === id ? response.data : t)))
      )
      .catch((err) => console.error(err));
  };

  // Start Editing Task
  const handleEditTask = (task) => {
    setEditingTask(task._id);
    setEditName(task.name);
  };

  // Save Edited Task
  const handleSaveEdit = (id) => {
    axios.put(`http://localhost:5000/tasks/${id}`, { name: editName })
      .then((response) => {
        setTasks(tasks.map((t) => (t._id === id ? response.data : t)));
        setEditingTask(null);
      })
      .catch((err) => console.error(err));
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 transition duration-300">
      <motion.div
        className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md transition duration-300"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h1 className="text-2xl font-bold text-white mb-4 text-center">Task Manager</h1>
        {/* Input and Add Task Button */}
        <div className="flex mb-4">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task"
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
          />
          <motion.button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
            whileTap={{ scale: 0.9 }}
          >
            Add
          </motion.button>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold">Task List</h2>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-between mb-4">
          {["all", "completed", "incomplete"].map((type) => (
            <motion.button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-md ${filter === type ? "bg-blue-500" : "bg-gray-600"
                }`}
              whileTap={{ scale: 0.9 }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Task List */}
        <ul className="space-y-2">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.li
                key={task._id}
                className="flex justify-between items-center bg-gray-700 p-3 rounded-md transition"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center space-x-2">
                  {/* Complete Task Button */}
                  <motion.button
                    onClick={() => handleToggleComplete(task._id)}
                    className={`px-2 py-1 rounded-md ${task.completed ? "bg-green-500 text-white" : "bg-gray-500"
                      }`}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✓
                  </motion.button>

                  {/* Edit Task */}
                  {editingTask === task._id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="p-1 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-600 text-white"
                    />
                  ) : (
                    <span
                      className={`cursor-pointer ${task.completed ? "line-through text-gray-400" : "text-white"
                        }`}
                      onClick={() => handleToggleComplete(task._id)}
                    >
                      {task.name}
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  {/* Save Edited Task Button */}
                  {editingTask === task._id ? (
                    <motion.button
                      onClick={() => handleSaveEdit(task._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
                      whileTap={{ scale: 0.9 }}
                    >
                      Save
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => handleEditTask(task)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600"
                      whileTap={{ scale: 0.9 }}
                    >
                      Edit
                    </motion.button>
                  )}

                  {/* Delete Button */}
                  <motion.button
                    onClick={() => handleDeleteTask(task._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                    whileTap={{ scale: 0.9 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>
    </div>
  );
}

export default App;
