const express = require("express");
const router = express.Router();

const Goal = require("../models/Goal");

router.get("/:userId", async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: {
        userId: req.params.userId,
      },
    });

    res.json(goals);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar metas",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const goal = await Goal.create(req.body);

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar meta",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const goal = await Goal.findByPk(req.params.id);

    if (!goal) {
      return res.status(404).json({
        message: "Meta não encontrada",
      });
    }

    await goal.update(req.body);

    res.json(goal);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar meta",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const goal = await Goal.findByPk(req.params.id);

    if (!goal) {
      return res.status(404).json({
        message: "Meta não encontrada",
      });
    }

    await goal.destroy();

    res.json({
      message: "Meta removida",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao deletar meta",
    });
  }
});

module.exports = router;