import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SummaryCards from "../components/SummaryCards";
import Filters from "../components/Filters";
import ChartsSection from "../components/ChartsSection";
import AnalyticsSection from "../components/AnalyticsSection";
import TransactionsTable from "../components/TransactionsTable";
import TransactionModal from "../components/TransactionModal";
import EmptyState from "../components/EmptyState";
import ActionButtons from "../components/ActionButtons";
import DashboardSkeleton from "../components/DashboardSkeleton";
import ConfirmModal from "../components/ConfirmModal";

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "income",
    category: "",
    status: "Pago",
    date: todayDate(),
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      setLoading(true);

      const { data } = await api.get("/transactions");

      setTransactions(data);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar transações.");
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    return [...new Set(transactions.map((item) => item.category))];
  }, [transactions]);

  function formatDateInput(date) {
    return date.toISOString().split("T")[0];
  }

  function applyQuickPeriod(days) {
    const today = new Date();
    const initial = new Date();

    initial.setDate(today.getDate() - days);

    setStartDate(formatDateInput(initial));
    setEndDate(formatDateInput(today));
  }

  function applyToday() {
    const today = formatDateInput(new Date());

    setStartDate(today);
    setEndDate(today);
  }

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

  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch = item.description
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      filterType === "all" || item.type === filterType;

    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;

    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;

    const matchesDate = isInsideDateRange(item);

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesCategory &&
      matchesDate
    );
  });

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

  function openCreateModal() {
    setEditingTransaction(null);

    setForm({
      description: "",
      amount: "",
      type: "income",
      category: "",
      status: "Pago",
      date: todayDate(),
    });

    setIsModalOpen(true);
  }

  function openEditModal(transaction) {
    setEditingTransaction(transaction);

    setForm({
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      status: transaction.status,
      date: transaction.date || todayDate(),
    });

    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingTransaction(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.description || !form.category || !form.amount || !form.date) {
      toast.error("Preencha todos os campos.");
      return;
    }

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      if (editingTransaction) {
        const { data } = await api.put(
          `/transactions/${editingTransaction.id}`,
          payload
        );

        setTransactions((prev) =>
          prev.map((item) =>
            item.id === editingTransaction.id ? data : item
          )
        );

        toast.success("Transação atualizada com sucesso!");
      } else {
        const { data } = await api.post("/transactions", payload);

        setTransactions((prev) => [data, ...prev]);

        toast.success("Transação criada com sucesso!");
      }

      closeModal();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao salvar transação.");
    }
  }

  function askDeleteTransaction(id) {
    setTransactionToDelete(id);
  }

  async function confirmDeleteTransaction() {
    if (!transactionToDelete) return;

    try {
      await api.delete(`/transactions/${transactionToDelete}`);

      setTransactions((prev) =>
        prev.filter((item) => item.id !== transactionToDelete)
      );

      setTransactionToDelete(null);

      toast.success("Transação removida com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao remover transação.");
    }
  }

  const hasActiveFilters =
    search ||
    filterType !== "all" ||
    filterStatus !== "all" ||
    filterCategory !== "all" ||
    startDate ||
    endDate;

  function clearFilters() {
    setSearch("");
    setFilterType("all");
    setFilterStatus("all");
    setFilterCategory("all");
    setStartDate("");
    setEndDate("");
  }

  return (
    <div className="app">
      <Toaster position="top-right" />

      <Sidebar />

      <main className="main-content">
        <Header openModal={openCreateModal} />

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar transação..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Filters
              filterType={filterType}
              setFilterType={setFilterType}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              categories={categories}
            />

            <div className="quick-periods">
              <button onClick={applyToday}>Hoje</button>

              <button onClick={() => applyQuickPeriod(7)}>
                Últimos 7 dias
              </button>

              <button onClick={() => applyQuickPeriod(30)}>
                Últimos 30 dias
              </button>

              <button onClick={clearFilters}>Limpar período</button>
            </div>

            <div className="date-filters">
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
            </div>

            <div className="results-info">
              <span>
                Exibindo <strong>{filteredTransactions.length}</strong> de{" "}
                <strong>{transactions.length}</strong> transações
              </span>

              {hasActiveFilters && (
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Limpar filtros
                </button>
              )}
            </div>

            <SummaryCards
              balance={totals.balance}
              income={totals.income}
              expense={totals.expense}
              total={filteredTransactions.length}
            />

            <ChartsSection
              income={totals.income}
              expense={totals.expense}
              transactions={filteredTransactions}
            />

            <AnalyticsSection
              income={totals.income}
              expense={totals.expense}
              balance={totals.balance}
            />

            <ActionButtons transactions={filteredTransactions} />

            {filteredTransactions.length > 0 ? (
              <TransactionsTable
                transactions={filteredTransactions}
                removeTransaction={askDeleteTransaction}
                editTransaction={openEditModal}
              />
            ) : (
              <EmptyState />
            )}
          </>
        )}
      </main>

      {isModalOpen && (
        <TransactionModal
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          closeModal={closeModal}
          isEditing={!!editingTransaction}
        />
      )}

      {transactionToDelete && (
        <ConfirmModal
          title="Excluir transação?"
          message="Essa ação não poderá ser desfeita. A transação será removida permanentemente do sistema."
          onCancel={() => setTransactionToDelete(null)}
          onConfirm={confirmDeleteTransaction}
        />
      )}
    </div>
  );
}

export default Dashboard;