const mongoose = require("mongoose");

const goalsDataSchema = new mongoose.Schema({
  serialNumber: {
    type: Number,
  },
  goal: {
    type: String,
    required: true,
  },
  deadline: {
    type: String,
    default: function () { 
      return this.deadline
        ? new Date(this.deadline).toLocaleDateString("en-US")
        : null;
    },
    
  },
  completed: {
    type: Boolean,
    default: false,
  },
});
const goalSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  goals: {
    type: [goalsDataSchema],
    required: true,
  },
});

module.exports = mongoose.model("Goal", goalSchema);
