import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, Trash2, Calendar, Clock, AlertCircle, Plus } from "lucide-react";
import { format } from "date-fns";
import { createTask, updateTask, removeTask } from "../store/taskSlice";
import Loader from "./Loader";

const MainFeature = ({ 
  categories, 
  tasks, 
  activeCategory 
}) => {
  const dispatch = useDispatch();
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    categoryId: categories[0]?.id || "",
    dueDate: "",
    completed: false,
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!newTask.title.trim()) {
      errors.title = "Task title is required";
    }
    
    if (!newTask.categoryId) {
      errors.categoryId = "Please select a category";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await dispatch(createTask(newTask)).unwrap();
        
        // Reset form
        setNewTask({
          title: "",
          description: "",
          priority: "medium",
          categoryId: categories[0]?.id || "",
          dueDate: "",
          completed: false,
        });
        
        setIsFormOpen(false);
      } catch (error) {
        console.error("Failed to create task:", error);
        setFormErrors({ submit: "Failed to create task. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const toggleTaskCompletion = async (id) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      await dispatch(updateTask({
        id,
        data: { completed: !taskToUpdate.completed }
      })).unwrap();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(removeTask(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-green-500";
      default:
        return "text-surface-500";
    }
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : "#6366f1";
  };
  
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {activeCategory === "all" 
            ? "All Tasks" 
            : activeCategory === "completed" 
            ? "Completed Tasks"
            : getCategoryName(activeCategory) + " Tasks"}
        </h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Task
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="card-neu mb-6">
              <h3 className="text-xl font-semibold mb-4">Create New Task</h3>
              
              {formErrors.submit && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {formErrors.submit}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block mb-1 font-medium">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className={`input ${formErrors.title ? "border-red-500 focus:ring-red-500" : ""}`}
                    placeholder="What needs to be done?"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block mb-1 font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    className="input min-h-[80px]"
                    placeholder="Add details about this task..."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="categoryId" className="block mb-1 font-medium">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={newTask.categoryId}
                      onChange={handleInputChange}
                      className={`input ${formErrors.categoryId ? "border-red-500 focus:ring-red-500" : ""}`}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.categoryId && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.categoryId}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block mb-1 font-medium">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={newTask.priority}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dueDate" className="block mb-1 font-medium">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      className="input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary flex items-center justify-center min-w-[100px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader /> : "Create Task"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-8 text-center"
        >
          <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-surface-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
          <p className="text-surface-500 mb-6">
            {activeCategory === "all" 
              ? "You don't have any tasks yet. Create your first task to get started!"
              : activeCategory === "completed"
              ? "You haven't completed any tasks yet."
              : `You don't have any tasks in the ${getCategoryName(activeCategory)} category.`}
          </p>
          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus size={18} className="mr-1" />
              Add Your First Task
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`card p-4 border-l-4 ${
                  task.completed ? "border-green-500" : ""
                }`}
                style={{ 
                  borderLeftColor: task.completed ? "#22c55e" : getCategoryColor(task.categoryId) 
                }}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="mt-1 flex-shrink-0 focus:outline-none"
                    aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {task.completed ? (
                      <CheckCircle size={22} className="text-green-500" />
                    ) : (
                      <Circle size={22} className="text-surface-400 hover:text-primary" />
                    )}
                  </button>
                  
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-medium text-lg ${
                          task.completed ? "line-through text-surface-500" : ""
                        }`}>
                          {task.title}
                        </h3>
                        
                        {task.description && (
                          <p className={`mt-1 text-surface-600 dark:text-surface-400 ${
                            task.completed ? "line-through text-surface-500" : ""
                          }`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-surface-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                        aria-label="Delete task"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${getCategoryColor(task.categoryId)}20`,
                          color: getCategoryColor(task.categoryId)
                        }}
                      >
                        {getCategoryName(task.categoryId)}
                      </span>
                      
                      <span className={`inline-flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                        <AlertCircle size={14} />
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      </span>
                      
                      {task.dueDate && (
                        <span className="inline-flex items-center gap-1 text-surface-500">
                          <Calendar size={14} />
                          Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </span>
                      )}
                      
                      <span className="inline-flex items-center gap-1 text-surface-500">
                        <Clock size={14} />
                        Created: {format(new Date(task.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MainFeature;