import { motion } from "framer-motion";
import { FaTrash, FaEdit } from "react-icons/fa";

import { formatCurrency } from "../utils/currency";

function formatDate(date) {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
}

function TransactionsTable({
  transactions,
  removeTransaction,
  editTransaction,
}) {
  return (
    <motion.section
      className="transactions"
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="transactions-header">
        <h2>Últimas Transações</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Data</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <td>{item.description}</td>

              <td>
                <span
                  className={`category-badge ${item.category
                    .toLowerCase()
                    .replace(/\s/g, "-")}`}
                >
                  {item.category}
                </span>
              </td>

              <td>{formatDate(item.date)}</td>

              <td className={item.type === "income" ? "positive" : "negative"}>
                {item.type === "income" ? "+" : "-"}{" "}
                {formatCurrency(Number(item.amount))}
              </td>

              <td>
                <span className={`status ${item.status === "Pago" ? "success" : "pending"}`}>
                  {item.status}
                </span>
              </td>

              <td>
                <div className="table-actions">
                  <button className="edit-btn" onClick={() => editTransaction(item)}>
                    <FaEdit />
                  </button>

                  <button className="delete-btn" onClick={() => removeTransaction(item.id)}>
                    <FaTrash />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.section>
  );
}

export default TransactionsTable;