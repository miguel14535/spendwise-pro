import { motion } from "framer-motion";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import { formatCurrency } from "../utils/currency";

const COLORS = ["#22c55e", "#ef4444"];

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function ChartsSection({ income, expense, transactions = [] }) {
  const pieData = [
    { name: "Receitas", value: income },
    { name: "Despesas", value: expense },
  ];

  const monthlyData = MONTHS.map((month, index) => {
    const monthTransactions = transactions.filter((item) => {
      if (!item.date) return false;

      const transactionDate = new Date(`${item.date}T00:00:00`);

      return transactionDate.getMonth() === index;
    });

    const receitas = monthTransactions
      .filter((item) => item.type === "income")
      .reduce((acc, item) => acc + Number(item.amount), 0);

    const despesas = monthTransactions
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => acc + Number(item.amount), 0);

    return {
      month,
      Receitas: receitas,
      Despesas: despesas,
      Saldo: receitas - despesas,
    };
  });

  return (
    <section className="charts-grid">
      <motion.div
        className="chart-container"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        whileHover={{ y: -6 }}
      >
        <h2>Resumo Financeiro</h2>

        <div className="chart-box">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                animationDuration={900}
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        className="chart-container"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        whileHover={{ y: -6 }}
      >
        <h2>Movimentação Mensal Real</h2>

        <div className="chart-box">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

              <XAxis dataKey="month" stroke="#94a3b8" />

              <YAxis stroke="#94a3b8" />

              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
              />

              <Legend />

              <Bar
                dataKey="Receitas"
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
                animationDuration={900}
              />

              <Bar
                dataKey="Despesas"
                fill="#ef4444"
                radius={[8, 8, 0, 0]}
                animationDuration={900}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
}

export default ChartsSection;