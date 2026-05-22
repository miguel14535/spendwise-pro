import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

function TransactionModal({
  form,
  handleChange,
  handleSubmit,
  closeModal,
  isEditing,
}) {
  return (
    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div
        className="modal"
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="modal-header">
          <div>
            <h2>{isEditing ? "Editar Transação" : "Nova Transação"}</h2>
            <p>{isEditing ? "Atualize os dados da sua transação." : "Cadastre uma nova movimentação financeira."}</p>
          </div>

          <button className="close-btn" onClick={closeModal}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="description"
            placeholder="Descrição"
            value={form.description}
            onChange={handleChange}
          />

          <input
            type="text"
            name="category"
            placeholder="Categoria"
            value={form.category}
            onChange={handleChange}
          />

          <select name="type" value={form.type} onChange={handleChange}>
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Valor"
            value={form.amount}
            onChange={handleChange}
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
          </select>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <button className="submit-btn" type="submit">
            {isEditing ? "Salvar Alterações" : "Salvar Transação"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default TransactionModal;