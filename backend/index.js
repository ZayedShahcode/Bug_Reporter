const express = require('express');
const cors = require('cors');
require('dotenv').config();

const AuthRouter = require('./routes/AuthRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',AuthRouter)

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});