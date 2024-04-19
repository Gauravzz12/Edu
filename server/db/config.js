const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://Gaurav:1234@edutrack.ucgazvd.mongodb.net/EduTrack?retryWrites=true&w=majority&appName=Edutrack", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }); 
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

module.exports = connectDB;