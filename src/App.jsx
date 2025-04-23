import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Sun, Moon, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { clearUser } from "./store/userSlice";
import { logout } from "./services/apperService";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" || 
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearUser());
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && (
        <header className="py-4 px-6 border-b border-surface-200 dark:border-surface-800">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center"
              >
                <span className="text-white font-bold text-lg">T</span>
              </motion.div>
              <h1 className="text-xl font-bold">
                Task<span className="text-primary">Flow</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {user && (
                <div className="mr-4 text-sm">
                  <span className="hidden md:inline">Welcome, </span>
                  <span className="font-medium">{user.firstName || user.emailAddress}</span>
                </div>
              )}
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-surface-600" />
                )}
              </motion.button>
              
              {isAuthenticated && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="p-2 rounded-full bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={20} className="text-surface-600 dark:text-surface-400" />
                </motion.button>
              )}
            </div>
          </div>
        </header>
      )}

      <main className="flex-grow">
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {isAuthenticated && (
        <footer className="py-4 px-6 border-t border-surface-200 dark:border-surface-800 text-center text-sm text-surface-500">
          <div className="container mx-auto">
            <p>© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;