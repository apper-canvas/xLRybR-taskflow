import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setUser, setLoading, setError } from '../store/userSlice';
import Loader from '../components/Loader';

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.user);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
      return;
    }

    dispatch(setLoading());

    const { ApperClient, ApperUI } = window.ApperSDK;
    const CANVAS_ID = '95fcbb75e6f34d94b05fcb1a8415d578';
    const apperClient = new ApperClient(CANVAS_ID);
    
    // Set up ApperUI for authentication
    ApperUI.setup(apperClient, {
      target: '#authentication',
      clientId: CANVAS_ID,
      view: 'both', // Show both login and signup options
      onSuccess: (user) => {
        dispatch(setUser(user));
        navigate('/');
      },
      onError: (error) => {
        console.error('Authentication failed:', error);
        dispatch(setError('Authentication failed. Please try again.'));
      }
    });
    
    // Show the login UI
    ApperUI.showLogin("#authentication");
    
    // Cleanup
    return () => {
      ApperUI.hide();
    };
  }, [dispatch, navigate, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-surface-50 dark:bg-surface-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">T</span>
            </motion.div>
            <h1 className="text-2xl font-bold">
              Task<span className="text-primary">Flow</span>
            </h1>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome to <span className="text-gradient">TaskFlow</span>
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            Log in or sign up to manage your tasks efficiently
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="card p-8 flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div id="authentication" className="card p-8 min-h-[400px]"></div>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;