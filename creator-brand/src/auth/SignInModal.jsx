import { motion, AnimatePresence } from 'framer-motion';
import SignInForm from './SignInForm';
import { X } from 'lucide-react';

export default function SignInModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-neutral-900 p-6 rounded-xl shadow-2xl w-full max-w-2xl mx-4 relative flex h-[80vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SignInForm />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}