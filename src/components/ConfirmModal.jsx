import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

function ConfirmModal({
  title,
  message,
  onCancel,
  onConfirm,
}) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="confirm-modal"
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
      >
        <div className="confirm-icon">
          <FaExclamationTriangle />
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="confirm-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancelar
          </button>

          <button className="confirm-delete-btn" onClick={onConfirm}>
            Excluir
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ConfirmModal;