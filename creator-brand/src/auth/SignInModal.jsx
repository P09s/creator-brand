import { motion, AnimatePresence } from 'framer-motion';
import SignInForm from './SignInForm';
import { ArrowLeft } from 'lucide-react';

export default function SignInModal({ isOpen, onClose }) {
  console.log('SignInModal render, isOpen:', isOpen);

  return (
    <AnimatePresence
      onExitComplete={() => console.log('Exit animation completed')}
    >
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50, transition: { duration: 0.4 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-neutral-900 p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-2xl mx-4 relative flex h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                console.log('Close button clicked');
                onClose();
              }}
              className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white text-black rounded-full p-1 sm:p-2 hover:bg-gray-200 transition z-[1000]"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <SignInForm />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}