const express = require('express');
const app = express();
const port = 5000;
const morgan = require('morgan');
const { readdirSync } = require('fs');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(cors());


app.use(express.json({ limit: '5mb' }));


app.use(express.json());

readdirSync('./Routes').map((file) => {
  const routePath = path.join(__dirname, 'Routes', file);
  app.use('/api', require(routePath));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
