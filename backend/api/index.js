// backend/api/index.js
const express = require('express');
const checkin = require('../routes/checkin');
const servicos = require('../routes/servicos');
const admin = require('../routes/admin');

const app = express();
app.use(express.json());
app.use('/checkin', checkin);
app.use('/servicos', servicos);
app.use('/admin', admin);

module.exports = app;
