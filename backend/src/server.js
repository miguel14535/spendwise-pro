const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/db.js");

require("./models/User");
require("./models/Transaction");
require("./models/Goal");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const goalRoutes = require("./routes/goals");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "SpendWise Pro API rodando.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Banco de dados conectado.");
    console.log("Tabelas sincronizadas com sucesso.");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar no banco:", error);
  });