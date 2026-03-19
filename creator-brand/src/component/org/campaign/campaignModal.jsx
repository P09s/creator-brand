import { motion, AnimatePresence } from 'framer-motion';
import CampaignForm from './campaignForm';
import { X } from 'lucide-react';

export default function CampaignModal({ isOpen, onClose, prefillData }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl w-full relative flex flex-col"
            style={{ maxWidth: '640px', maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <CampaignForm prefillData={prefillData} onSuccess={onClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}