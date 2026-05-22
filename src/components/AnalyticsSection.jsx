import { motion } from "framer-motion";

function AnalyticsSection({ income, expense, balance }) {
  const expensePercentage =
    income > 0 ? ((expense / income) * 100).toFixed(1) : 0;

  const goal = 10000;
  const progress = Math.min((balance / goal) * 100, 100);

  const cards = [
    {
      title: "Meta Financeira",
      content: (
        <>
          <p>
            Objetivo: <strong>R$ 10.000</strong>
          </p>

          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>

          <span>{progress.toFixed(1)}% concluído</span>
        </>
      ),
    },
    {
      title: "Gastos",
      content: (
        <>
          <div className="analytics-number danger">
            {expensePercentage}%
          </div>

          <p>da sua receita já foi utilizada.</p>
        </>
      ),
    },
    {
      title: "Status Financeiro",
      content: (
        <>
          <div
            className={`analytics-number ${
              balance >= 0 ? "success" : "danger"
            }`}
          >
            {balance >= 0 ? "Positivo" : "Negativo"}
          </div>

          <p>Continue mantendo o controle financeiro.</p>
        </>
      ),
    },
  ];

  return (
    <section className="analytics-grid">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          className="analytics-card"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: index * 0.12,
          }}
          whileHover={{
            y: -8,
            scale: 1.02,
          }}
        >
          <h2>{card.title}</h2>
          {card.content}
        </motion.div>
      ))}
    </section>
  );
}

export default AnalyticsSection;