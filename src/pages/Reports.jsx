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
import toast, { Toaster } from "react-hot-toast";

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
  const [category, setCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const { data } = await api.get("/transactions");
      setTransactions(data);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar relatórios.");
    }
  }

  const categories = useMemo(() => {
    return [...new Set(transactions.map((item) => item.category))];
  }, [transactions]);

  function isInsideDateRange(item) {
    if (!startDate && !endDate) return true;
    if (!item.date) return false;

    const transactionDate = new Date(`${item.date}T00:00:00`);

    if (startDate) {
      const initialDate = new Date(`${startDate}T00:00:00`);

      if (transactionDate < initialDate) {
        return false;
      }
    }

    if (endDate) {
      const finalDate = new Date(`${endDate}T23:59:59`);

      if (transactionDate > finalDate) {
        return false;
      }
    }

    return true;
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesCategory =
        category === "all" || item.category === category;

      const matchesDate = isInsideDateRange(item);

      return matchesCategory && matchesDate;
    });
  }, [transactions, category, startDate, endDate]);

  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter((item) => item.type === "income")
      .reduce((acc, item) => acc + Number(item.amount), 0);

    const expense = filteredTransactions
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => acc + Number(item.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [filteredTransactions]);

  const pieData = [
    { name: "Receitas", value: totals.income },
    { name: "Despesas", value: totals.expense },
  ];

  const categoryData = useMemo(() => {
    const result = {};

    filteredTransactions.forEach((item) => {
      if (!result[item.category]) {
        result[item.category] = 0;
      }

      result[item.category] += Number(item.amount);
    });

    return Object.keys(result).map((categoryName) => ({
      category: categoryName,
      total: result[categoryName],
    }));
  }, [filteredTransactions]);

  function clearFilters() {
    setCategory("all");
    setStartDate("");
    setEndDate("");
  }

  function exportPDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("SpendWise Pro - Relatório Financeiro", 20, 20);

    doc.setFontSize(12);
    doc.text(`Receitas: ${formatCurrency(totals.income)}`, 20, 40);
    doc.text(`Despesas: ${formatCurrency(totals.expense)}`, 20, 50);
    doc.text(`Saldo: ${formatCurrency(totals.balance)}`, 20, 60);
    doc.text(`Transações filtradas: ${filteredTransactions.length}`, 20, 70);

    let y = 90;

    filteredTransactions.forEach((item) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      doc.text(
        `${formatDate(item.date)} | ${item.description} | ${
          item.category
        } | ${item.type === "income" ? "Receita" : "Despesa"} | ${
          item.status
        } | ${formatCurrency(Number(item.amount))}`,
        20,
        y
      );

      y += 10;
    });

    doc.save("spendwise-relatorio.pdf");
  }

  function exportExcel() {
    const formattedTransactions = filteredTransactions.map((item) => ({
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
      <Toaster position="top-right" />

      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="welcome-badge">Relatórios avançados</span>

            <h1>Relatórios</h1>

            <p>Análise financeira avançada das suas transações.</p>
          </div>
        </header>

        <section className="report-filters">
          <div>
            <label>Categoria</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">Todas categorias</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Data inicial</label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label>Data final</label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Limpar filtros
          </button>
        </section>

        <div className="results-info">
          <span>
            Exibindo <strong>{filteredTransactions.length}</strong> de{" "}
            <strong>{transactions.length}</strong> transações
          </span>
        </div>

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

          <div className="card reports">
            <div>
              <h3>Transações</h3>
              <h2>{filteredTransactions.length}</h2>
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

                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
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
                  <XAxis dataKey="category" stroke="#94a3b8" />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
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
              {filteredTransactions.map((item) => (
                <tr key={item.id}>
                  <td>{formatDate(item.date)}</td>

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