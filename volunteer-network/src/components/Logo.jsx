import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const Logo = () => {
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-white"
      >
        <Users className="w-8 h-8 fill-white/10 stroke-[1.5]" />
      </motion.div>
      <motion.h1 
        className="text-2xl font-bold text-white font-heading tracking-wide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          delay: 0.2,
          type: "spring",
          stiffness: 100 
        }}
      >
        Frivillig Nettverk
      </motion.h1>
    </motion.div>
  );
};

export default Logo; 