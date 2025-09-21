const express = require('express');
const cors = require('cors');
require('dotenv').config();

const AuthRouter = require('./routes/AuthRoutes');
const BugRouter = require('./routes/BugRoutes')

const corsOptions = {
  origin: ["http://localhost:5173","https://bug-reporter-nine.vercel.app"],
  methods: ["GET","POST","PUT","PATCH","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}


const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth',AuthRouter)
app.use('/api/bugs',BugRouter)

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});