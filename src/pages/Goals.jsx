import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import api from "../services/api";

function Goals() {
  const user = JSON.parse(
    localStorage.getItem("spendwise_user")
  );

  const [goals, setGoals] = useState([]);

  const [form, setForm] = useState({
    title: "",
    target: "",
    current: "",
  });

  async function loadGoals() {
    try {
      const response = await api.get(
        `/goals/${user.id}`
      );

      setGoals(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadGoals();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("/goals", {
        ...form,
        userId: user.id,
      });

      setForm({
        title: "",
        target: "",
        current: "",
      });

      loadGoals();
    } catch (error) {
      alert("Erro ao salvar meta");
    }
  }

  async function deleteGoal(id) {
    try {
      await api.delete(`/goals/${id}`);

      loadGoals();
    } catch (error) {
      alert("Erro ao remover meta");
    }
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="welcome-badge">
              Metas financeiras
            </span>

            <h1>Metas</h1>

            <p>
              Gerencie seus objetivos financeiros.
            </p>
          </div>
        </header>

        <section className="settings-grid">
          <div className="settings-card">
            <h2>Nova Meta</h2>

            <form
              className="goal-form"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="title"
                placeholder="Nome da meta"
                value={form.title}
                onChange={handleChange}
              />

              <input
                type="number"
                name="target"
                placeholder="Valor objetivo"
                value={form.target}
                onChange={handleChange}
              />

              <input
                type="number"
                name="current"
                placeholder="Valor atual"
                value={form.current}
                onChange={handleChange}
              />

              <button className="primary-btn">
                Criar Meta
              </button>
            </form>
          </div>

          <div className="settings-card">
            <h2>Minhas Metas</h2>

            <div className="goals-list">
              {goals.map((goal) => {
                const progress = Math.min(
                  (goal.current / goal.target) * 100,
                  100
                );

                return (
                  <div
                    className="goal-item"
                    key={goal.id}
                  >
                    <div className="goal-header">
                      <h3>{goal.title}</h3>

                      <button
                        onClick={() =>
                          deleteGoal(goal.id)
                        }
                      >
                        ✕
                      </button>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    <p>
                      R$ {goal.current} de R${" "}
                      {goal.target}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Goals;