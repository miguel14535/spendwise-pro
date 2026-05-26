import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { formatCurrency } from "../utils/currency";

function Goals() {
  const user = JSON.parse(localStorage.getItem("spendwise_user"));

  const [goals, setGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    target: "",
    current: "",
  });

  useEffect(() => {
    loadGoals();
  }, []);

  async function loadGoals() {
    try {
      setLoading(true);

      const { data } = await api.get(`/goals/${user.id}`);

      setGoals(data);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar metas.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function resetForm() {
    setForm({
      title: "",
      target: "",
      current: "",
    });

    setEditingGoal(null);
  }

  function startEdit(goal) {
    setEditingGoal(goal);

    setForm({
      title: goal.title,
      target: goal.target,
      current: goal.current,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.target) {
      toast.error("Preencha o nome e o valor objetivo.");
      return;
    }

    try {
      const payload = {
        title: form.title,
        target: Number(String(form.target).replace(",", ".")),
        current: Number(String(form.current || 0).replace(",", ".")),
        userId: user.id,
      };

      if (editingGoal) {
        const { data } = await api.put(
          `/goals/${editingGoal.id}`,
          payload
        );

        setGoals((prev) =>
          prev.map((goal) =>
            goal.id === editingGoal.id ? data : goal
          )
        );

        toast.success("Meta atualizada com sucesso!");
      } else {
        const { data } = await api.post("/goals", payload);

        setGoals((prev) => [data, ...prev]);

        toast.success("Meta criada com sucesso!");
      }

      resetForm();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao salvar meta.");
    }
  }

  async function deleteGoal(id) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja remover esta meta?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/goals/${id}`);

      setGoals((prev) => prev.filter((goal) => goal.id !== id));

      if (editingGoal?.id === id) {
        resetForm();
      }

      toast.success("Meta removida com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao remover meta.");
    }
  }

  return (
    <div className="app">
      <Toaster position="top-right" />

      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="welcome-badge">
              Metas financeiras
            </span>

            <h1>Metas</h1>

            <p>
              Gerencie seus objetivos financeiros e acompanhe
              seu progresso em tempo real.
            </p>
          </div>
        </header>

        <section className="settings-grid">
          <div className="settings-card">
            <h2>
              {editingGoal ? "Editar Meta" : "Nova Meta"}
            </h2>

            <form
              className="goal-form"
              onSubmit={handleSubmit}
            >
              <label>Nome da meta</label>
              <input
                type="text"
                name="title"
                placeholder="Ex: Reserva de emergência"
                value={form.title}
                onChange={handleChange}
              />

              <label>Valor objetivo</label>
              <input
                type="text"
                name="target"
                placeholder="Ex: 10000"
                value={form.target}
                onChange={handleChange}
              />

              <label>Valor atual</label>
              <input
                type="text"
                name="current"
                placeholder="Ex: 3500"
                value={form.current}
                onChange={handleChange}
              />

              <button className="primary-btn" type="submit">
                {editingGoal ? "Salvar Alterações" : "Criar Meta"}
              </button>

              {editingGoal && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={resetForm}
                >
                  Cancelar edição
                </button>
              )}
            </form>
          </div>

          <div className="settings-card">
            <h2>Minhas Metas</h2>

            {loading ? (
              <p className="settings-muted">
                Carregando metas...
              </p>
            ) : goals.length === 0 ? (
              <p className="settings-muted">
                Nenhuma meta cadastrada ainda.
              </p>
            ) : (
              <div className="goals-list">
                {goals.map((goal) => {
                  const target = Number(goal.target || 0);
                  const current = Number(goal.current || 0);

                  const progress =
                    target > 0
                      ? Math.min((current / target) * 100, 100)
                      : 0;

                  const remaining = Math.max(target - current, 0);

                  return (
                    <div
                      className="goal-item"
                      key={goal.id}
                    >
                      <div className="goal-header">
                        <div>
                          <h3>{goal.title}</h3>

                          <span>
                            {progress.toFixed(1)}% concluído
                          </span>
                        </div>

                        <div className="goal-actions">
                          <button
                            className="edit-goal-btn"
                            onClick={() => startEdit(goal)}
                          >
                            Editar
                          </button>

                          <button
                            className="delete-goal-btn"
                            onClick={() => deleteGoal(goal.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>

                      <div className="goal-stats">
                        <div className="goal-box">
                          <span>Objetivo</span>

                          <strong>
                            {formatCurrency(target)}
                          </strong>
                        </div>

                        <div className="goal-box">
                          <span>Atual</span>

                          <strong>
                            {formatCurrency(current)}
                          </strong>
                        </div>

                        <div className="goal-box">
                          <span>Restante</span>

                          <strong>
                            {formatCurrency(remaining)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Goals;