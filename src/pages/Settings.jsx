import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";

function Settings() {
  const navigate = useNavigate();

  const savedUser = JSON.parse(
    localStorage.getItem("spendwise_user")
  );

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("spendwise_theme");
    return saved ? JSON.parse(saved) : true;
  });

  const [profile, setProfile] = useState({
    name: savedUser?.name || "",
    email: savedUser?.email || "",
    password: "",
  });

  function handleChange(e) {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  }

  function toggleTheme() {
    const newTheme = !darkMode;

    setDarkMode(newTheme);

    localStorage.setItem(
      "spendwise_theme",
      JSON.stringify(newTheme)
    );

    if (newTheme) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }

  function saveProfile(e) {
    e.preventDefault();

    const updatedUser = {
      ...savedUser,
      name: profile.name,
      email: profile.email,
    };

    localStorage.setItem(
      "spendwise_user",
      JSON.stringify(updatedUser)
    );

    alert("Perfil atualizado com sucesso!");
  }

  function logout() {
    localStorage.removeItem("spendwise_token");
    localStorage.removeItem("spendwise_user");

    navigate("/login");
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="welcome-badge">
              Preferências da conta
            </span>

            <h1>Configurações</h1>

            <p>
              Gerencie seu perfil, segurança e preferências do sistema.
            </p>
          </div>
        </header>

        <section className="settings-grid">
          <div className="settings-card profile-card">
            <div className="avatar-circle">
              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <h2>{profile.name || "Usuário"}</h2>

            <p>{profile.email}</p>

            <button className="logout-settings-btn" onClick={logout}>
              <FaSignOutAlt />
              Sair da conta
            </button>
          </div>

          <div className="settings-card">
            <h2>Perfil</h2>

            <form onSubmit={saveProfile}>
              <label>
                <FaUser />
                Nome
              </label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />

              <label>
                <FaEnvelope />
                E-mail
              </label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />

              <button className="submit-btn" type="submit">
                Salvar Perfil
              </button>
            </form>
          </div>

          <div className="settings-card">
            <h2>Segurança</h2>

            <form>
              <label>
                <FaLock />
                Nova senha
              </label>

              <input
                type="password"
                name="password"
                placeholder="Digite uma nova senha"
                value={profile.password}
                onChange={handleChange}
              />

              <button
                className="submit-btn"
                type="button"
                onClick={() =>
                  alert("Troca de senha será integrada ao backend.")
                }
              >
                Alterar Senha
              </button>
            </form>
          </div>

          <div className="settings-card">
            <h2>Aparência</h2>

            <p className="settings-muted">
              Personalize a experiência visual da plataforma.
            </p>

            <button className="theme-settings-btn" onClick={toggleTheme}>
              {darkMode ? <FaSun /> : <FaMoon />}
              {darkMode ? "Ativar tema claro" : "Ativar tema escuro"}
            </button>
          </div>

          <div className="settings-card">
            <h2>Segurança da Conta</h2>

            <p className="settings-muted">
              Sua sessão está protegida por autenticação JWT e rotas protegidas.
            </p>

            <div className="security-badge">
              <FaShieldAlt />
              Conta protegida
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Settings;