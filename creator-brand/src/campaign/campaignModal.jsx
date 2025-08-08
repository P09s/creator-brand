import { motion, AnimatePresence } from 'framer-motion';
import CampaignForm from './campaignForm';
import { ArrowLeft, X } from 'lucide-react';

export default function CampaignModal({ isOpen, onClose }) {
  console.log('CampaignModal render, isOpen:', isOpen);

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
            className="bg-neutral-900 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-4xl mx-4 relative flex h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                console.log('Close button clicked');
                onClose();
              }}
              className="absolute top-3 right-4  text-neutral-400 p-2 transition z-[1000]"
            >
              <X className="w-5 h-5" />
            </button>
            <CampaignForm />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}