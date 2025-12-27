import React from "react";

/**
 * ConfirmModal (Enhanced)
 * ============================================================
 * UPDATES:
 * - Added Dark Mode support (dark: classes)
 * - Added "Click Outside" to dismiss
 * - Styled Cancel button to turn red on hover (as requested)
 * - Improved accessibility (ARIA roles)
 */
const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    // OVERLAY: Added onClick={onCancel} so clicking the black background closes modal
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      {/* MODAL CONTENT: 
         - Added e.stopPropagation() so clicking inside the box doesn't close it 
         - Added dark mode colors 
      */}
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-xl p-6 w-[90%] max-w-sm shadow-xl border border-gray-100 dark:border-gray-700 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TITLE */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>

        {/* MESSAGE */}
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {message}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          {/* CANCEL BUTTON 
             - Default: Neutral Gray
             - Hover: Red Text + Red Background Tint (Your Request)
             - Dark Mode: Adjusts to look good on dark background
          */}
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 
                       hover:bg-red-50 hover:text-red-600 hover:border-red-200 
                       dark:border-gray-600 dark:text-gray-300 
                       dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800
                       disabled:opacity-50 transition-colors duration-200"
          >
            {cancelText}
          </button>

          {/* CONFIRM BUTTON 
             - Solid Red (Destructive)
          */}
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 focus:ring-4 focus:ring-red-500/30
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                {/* Simple SVG Spinner */}
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;