import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "../services/api";

function AuthPage({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";

      const payload = isLogin
        ? {
            email: form.email,
            password: form.password,
          }
        : form;

      const { data } = await api.post(endpoint, payload);

      if (data.token) {
        localStorage.setItem("spendwise_token", data.token);
        localStorage.setItem("spendwise_user", JSON.stringify(data.user));

        setUser(data.user);

        toast.success("Login realizado com sucesso!");
      } else {
        toast.success("Conta criada com sucesso! Faça login.");
        setIsLogin(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro na autenticação.");
    }
  }

  return (
    <div className="auth-page premium-auth">
      <Toaster position="top-right" />

      <div className="auth-left">
        <h1>SpendWise Pro</h1>

        <p>
          Controle seus gastos, visualize relatórios e gerencie sua vida
          financeira com uma plataforma moderna.
        </p>

        <div className="auth-stats">
          <div>
            <strong>100%</strong>
            <span>Full Stack</span>
          </div>

          <div>
            <strong>JWT</strong>
            <span>Seguro</span>
          </div>

          <div>
            <strong>MySQL</strong>
            <span>Real DB</span>
          </div>
        </div>
      </div>

      <div className="auth-card">
        <h2>{isLogin ? "Entrar na conta" : "Criar conta"}</h2>

        <p>
          {isLogin
            ? "Acesse seu painel financeiro."
            : "Cadastre-se para começar."}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Nome completo"
              value={form.name}
              onChange={handleChange}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
          />

          <button className="submit-btn" type="submit">
            {isLogin ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          className="auth-switch"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Não tenho conta, quero cadastrar"
            : "Já tenho conta, quero entrar"}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;