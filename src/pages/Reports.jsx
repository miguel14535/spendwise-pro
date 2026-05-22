import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  CartesianGrid,
} from "recharts";

import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import { formatCurrency } from "../utils/currency";

const COLORS = ["#22c55e", "#ef4444"];

function formatDate(date) {
  if (!date) return "-";
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
}

function Reports() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const { data } = await api.get("/transactions");
      setTransactions(data);
    } catch {
      alert("Erro ao carregar relatórios.");
    }
  }

  const totals = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((acc, item) => acc + Number(item.amount), 0);

    const expense = transactions
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => acc + Number(item.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  const pieData = [
    { name: "Receitas", value: totals.income },
    { name: "Despesas", value: totals.expense },
  ];

  const categoryData = useMemo(() => {
    const result = {};

    transactions.forEach((item) => {
      if (!result[item.category]) {
        result[item.category] = 0;
      }

      result[item.category] += Number(item.amount);
    });

    return Object.keys(result).map((category) => ({
      category,
      total: result[category],
    }));
  }, [transactions]);

  function exportPDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("SpendWise Pro - Relatório Financeiro", 20, 20);

    doc.setFontSize(12);
    doc.text(`Receitas: ${formatCurrency(totals.income)}`, 20, 40);
    doc.text(`Despesas: ${formatCurrency(totals.expense)}`, 20, 50);
    doc.text(`Saldo: ${formatCurrency(totals.balance)}`, 20, 60);

    let y = 80;

    transactions.forEach((item) => {
      doc.text(
        `${formatDate(item.date)} | ${item.description} | ${
          item.category
        } | ${formatCurrency(Number(item.amount))}`,
        20,
        y
      );

      y += 10;
    });

    doc.save("spendwise-relatorio.pdf");
  }

  function exportExcel() {
    const formattedTransactions = transactions.map((item) => ({
      Data: formatDate(item.date),
      Descrição: item.description,
      Categoria: item.category,
      Tipo: item.type === "income" ? "Receita" : "Despesa",
      Status: item.status,
      Valor: Number(item.amount),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedTransactions);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatorio");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(fileData, "spendwise-relatorio.xlsx");
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="welcome-badge">Relatórios avançados</span>

            <h1>Relatórios</h1>

            <p>Análise financeira avançada das suas transações.</p>
          </div>
        </header>

        <section className="cards">
          <div className="card income">
            <div>
              <h3>Receitas Totais</h3>
              <h2>{formatCurrency(totals.income)}</h2>
            </div>
          </div>

          <div className="card expense">
            <div>
              <h3>Despesas Totais</h3>
              <h2>{formatCurrency(totals.expense)}</h2>
            </div>
          </div>

          <div className="card balance">
            <div>
              <h3>Saldo Final</h3>
              <h2>{formatCurrency(totals.balance)}</h2>
            </div>
          </div>
        </section>

        <div className="actions-row">
          <button className="action-btn pdf" onClick={exportPDF}>
            Exportar PDF
          </button>

          <button className="action-btn excel" onClick={exportExcel}>
            Exportar Excel
          </button>
        </div>

        <section className="charts-grid">
          <div className="chart-container">
            <h2>Receitas x Despesas</h2>

            <div className="chart-box">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index]} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-container">
            <h2>Gastos por Categoria</h2>

            <div className="chart-box">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="category" />
                  <Tooltip />
                  <Bar
                    dataKey="total"
                    fill="#2563eb"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="transactions">
          <div className="transactions-header">
            <h2>Detalhamento Financeiro</h2>
          </div>

          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Valor</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((item) => (
                <tr key={item.id}>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.description}</td>

                  <td>
                    <span className="category-badge">{item.category}</span>
                  </td>

                  <td>{item.type === "income" ? "Receita" : "Despesa"}</td>

                  <td>
                    <span
                      className={`status ${
                        item.status === "Pago" ? "success" : "pending"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td
                    className={
                      item.type === "income" ? "positive" : "negative"
                    }
                  >
                    {item.type === "income" ? "+" : "-"}{" "}
                    {formatCurrency(Number(item.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default Reports;