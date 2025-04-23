import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import MainFeature from "../components/MainFeature";
import Loader from "../components/Loader";
import { fetchAllCategories } from "../store/categorySlice";
import { fetchAllTasks } from "../store/taskSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { items: categories, isLoading: categoriesLoading } = useSelector(state => state.categories);
  const { items: tasks, isLoading: tasksLoading } = useSelector(state => state.tasks);
  
  const [activeCategory, setActiveCategory] = useState("all");

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchAllTasks());
  }, [dispatch]);

  const isLoading = categoriesLoading || tasksLoading;

  // Filter tasks based on active category
  const filteredTasks = activeCategory === "all" 
    ? tasks 
    : activeCategory === "completed"
    ? tasks.filter(task => task.completed)
    : tasks.filter(task => task.categoryId === activeCategory);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Organize your tasks with <span className="text-gradient">TaskFlow</span>
          </h1>
          <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
            A beautiful and intuitive task management app to help you stay organized and productive.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <div className="card p-4 sticky top-4">
              <h2 className="font-semibold mb-3 text-lg">Categories</h2>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeCategory === "all"
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-surface-100 dark:hover:bg-surface-700"
                    }`}
                  >
                    All Tasks
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                        activeCategory === category.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-surface-100 dark:hover:bg-surface-700"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      ></span>
                      {category.name}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => setActiveCategory("completed")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeCategory === "completed"
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-surface-100 dark:hover:bg-surface-700"
                    }`}
                  >
                    Completed
                  </button>
                </li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
                <h2 className="font-semibold mb-3 text-lg">Statistics</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Total Tasks</span>
                    <span className="font-medium">{tasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Completed</span>
                    <span className="font-medium">{tasks.filter(t => t.completed).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Pending</span>
                    <span className="font-medium">{tasks.filter(t => !t.completed).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-9">
            <MainFeature 
              categories={categories} 
              tasks={filteredTasks}
              activeCategory={activeCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;