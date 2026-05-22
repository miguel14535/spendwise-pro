import { FaPlus, FaCalendarAlt } from "react-icons/fa";

function Header({ openModal }) {
  const user = JSON.parse(localStorage.getItem("spendwise_user"));

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="topbar premium-header">
      <div>
        <span className="welcome-badge">
          Bem-vindo, {user?.name || "Usuário"}
        </span>

        <h1>Painel Financeiro</h1>

        <p>
          Gerencie receitas, despesas e acompanhe sua evolução financeira.
        </p>

        <div className="date-pill">
          <FaCalendarAlt />
          {today}
        </div>
      </div>

      <button className="add-btn" onClick={openModal}>
        <FaPlus />
        Nova Transação
      </button>
    </header>
  );
}

export default Header;