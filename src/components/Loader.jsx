import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <motion.div
        className="w-4 h-4 bg-primary rounded-full mx-1"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          times: [0, 0.5, 1],
          delay: 0
        }}
      />
      <motion.div
        className="w-4 h-4 bg-primary rounded-full mx-1"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          times: [0, 0.5, 1],
          delay: 0.2
        }}
      />
      <motion.div
        className="w-4 h-4 bg-primary rounded-full mx-1"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          times: [0, 0.5, 1],
          delay: 0.4
        }}
      />
    </div>
  );
};

export default Loader;