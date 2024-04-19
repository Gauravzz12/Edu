const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db/config');

const AuthRoutes = require('./routes/Authroutes');
const GoalsRoutes = require('./routes/Goalsroutes');
const MarksRoutes = require('./routes/Marksroutes');

const app = express();
const PORT = 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/auth', AuthRoutes);
app.use('/goals', GoalsRoutes);
app.use('/marks', MarksRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

