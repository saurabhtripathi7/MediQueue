import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, X } from "lucide-react";

/**
 * IMPROVISED ConfirmModal
 * ============================================================
 * FEATURE UPDATES:
 * - Spring-based entrance animation (Framer Motion)
 * - Semantic Warning Icon for instant recognition
 * - High-contrast typography (Slate-900 / Slate-500)
 * - Glassmorphism Backdrop
 */
const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Back",
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          
          {/* 1. BACKDROP: Glassmorphism effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* 2. MODAL CONTAINER */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            {/* Close Button (Upper Right) */}
            <button 
                onClick={onCancel}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
                <X size={20} />
            </button>

            <div className="p-8 pt-10">
              {/* ICON HEADER: Instant visual "Caution" signal */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="text-rose-600 dark:text-rose-500" size={32} />
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {title}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm font-medium leading-relaxed">
                  {message}
                </p>
              </div>

              {/* ACTION BUTTONS: Clear hierarchy */}
              <div className="flex flex-col gap-3 mt-10">
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-600/30 hover:bg-rose-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    confirmText
                  )}
                </button>

                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-100 dark:border-slate-800"
                >
                  {cancelText}
                </button>
              </div>
            </div>

            {/* Subtle Progress Bar (Visual Polish) */}
            {isLoading && (
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="h-1.5 bg-rose-600 absolute bottom-0 left-0"
                />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;