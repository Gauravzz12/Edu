const express = require("express");
const GoalsListModel = require("../models/GoalsListModel");
const router = express.Router();
router.get('/',(req,res)=>{
  res.send("Hello World");
})
router.get("/getgoals", async (req, res) => {
  const { id } = req.query;

  try {
    const goals = await GoalsListModel.find({ _id: id });
    res.send(goals[0].goals);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "Internal Server Error", msg: "Something went wrong!" });
  }
});

router.post("/saveGoals", async (req, res) => {
  const { goal, id } = req.body;
  const ifExists = await GoalsListModel.findOne({ _id: id });
  const length = ifExists ? ifExists.goals.length + 1 : 1;
  try {
    const newGoal = {
      serialNumber: length,
      goal: goal.Goal,
      deadline: goal.deadline,
      completed:false
    };
    if (ifExists) {
      const newGoalsEntry=await GoalsListModel.findByIdAndUpdate(
        { _id: id },
        { $push: { goals: newGoal } },
        { new: true }
      );
      res.json(newGoalsEntry.goals[newGoalsEntry.goals.length-1]);
 
    } else {
      const newGoalsEntry = new GoalsListModel({
        _id: id,
        goals: [newGoal],
      });
      await newGoalsEntry.save();
      res.json(newGoalsEntry.goals[newGoalsEntry.goals.length-1]);
    }
    
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "Internal Server Error", msg: "Something went wrong!" });
  }
});

router.put("/updateGoals/:goalId", async (req, res) => {
  const { id, goal } = req.body;
  const { goalId } = req.params;
  
  try {
    const data = await GoalsListModel.findOneAndUpdate(
      { _id: id, "goals._id": goalId },
      {
        $set: {
          "goals.$.goal": goal.goal,
          "goals.$.deadline": goal.deadline,
          "goals.$.completed":goal.completed
        },
      },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({ error: "Goals entry not found" });
    }
    res.json(data);
  } catch (error) {
    console.error("Error updating goals entry:", error);
    res.status(500).json({ error: "Failed to update goals entry" });
  }
});


router.delete("/deleteGoals", async (req, res) => {
  const { id, goalId } = req.query;

  try {
    const data = await GoalsListModel.findByIdAndUpdate(
      { _id: id },
      { $pull: { goals: { _id: goalId } } },
      { new: true }
    );
    res.json(data);
  } catch (err) {
    console.error("Error removing goals entry:", err);
    res.status(500).json({ error: "Failed to remove goals entry" });
  }
});

module.exports = router;
