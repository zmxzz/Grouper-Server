const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connecting to database configged at config/database.js
mongoose.connect(config.database, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
    console.log('Connected to database ' + config.database);
});

mongoose.connection.on('error', (err) => {
    console.log('Database error ' + err);
});

const app = express();

// Port number
const port = 3000;

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routers Required
const user = require('./routes/user');
const file = require('./routes/file');

// Router Information
app.use('/user', user);
app.use('/file', file);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
})

app.listen(port, () => {
    console.log('Server started on port ' + port);
});