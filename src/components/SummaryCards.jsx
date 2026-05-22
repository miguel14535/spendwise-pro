import { motion } from "framer-motion";

import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaChartPie,
} from "react-icons/fa";

import { formatCurrency } from "../utils/currency";

function SummaryCards({ balance, income, expense, total }) {
  const cards = [
    {
      title: "Saldo Atual",
      value: formatCurrency(balance),
      icon: <FaWallet />,
      className: "balance",
      delay: 0.1,
    },
    {
      title: "Receitas",
      value: formatCurrency(income),
      icon: <FaArrowUp />,
      className: "income",
      delay: 0.2,
    },
    {
      title: "Despesas",
      value: formatCurrency(expense),
      icon: <FaArrowDown />,
      className: "expense",
      delay: 0.3,
    },
    {
      title: "Transações",
      value: total,
      icon: <FaChartPie />,
      className: "reports",
      delay: 0.4,
    },
  ];

  return (
    <section className="cards">
      {cards.map((card) => (
        <motion.div
          key={card.title}
          className={`card ${card.className}`}
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.45,
            delay: card.delay,
            ease: "easeOut",
          }}
          whileHover={{
            y: -8,
            scale: 1.02,
          }}
        >
          <motion.div
            className="card-icon"
            whileHover={{
              rotate: 8,
              scale: 1.08,
            }}
            transition={{
              type: "spring",
              stiffness: 250,
            }}
          >
            {card.icon}
          </motion.div>

          <div>
            <h3>{card.title}</h3>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: card.delay + 0.2,
              }}
            >
              {card.value}
            </motion.h2>
          </div>
        </motion.div>
      ))}
    </section>
  );
}

export default SummaryCards;