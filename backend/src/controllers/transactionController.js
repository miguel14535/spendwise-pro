const Transaction = require("../models/Transaction");

exports.createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      userId: req.userId,
    });

    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar transação.",
      error: error.message,
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.userId },
      order: [["createdAt", "DESC"]],
    });

    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao listar transações.",
      error: error.message,
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transação não encontrada.",
      });
    }

    await transaction.update(req.body);

    return res.json(transaction);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar transação.",
      error: error.message,
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transação não encontrada.",
      });
    }

    await transaction.destroy();

    return res.json({
      message: "Transação deletada com sucesso.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao deletar transação.",
      error: error.message,
    });
  }
};