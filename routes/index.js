const express = require('express');

const notesRouter = require('./notesRoute');

const app = express();

app.use('/notesRoute', notesRouter);

module.exports = app;