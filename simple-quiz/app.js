const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const quizRouter = require('./routes/quizRouter');
const questionRouter = require('./routes/questionRouter');
const userRouter = require('./routes/userRouter');

const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const config = require('./config');

const app = express(); 
app.use(bodyParser.json()); 

const port = 3000; 
const url = config.mongoUrl;
const connect = mongoose.connect(url); 
connect
    .then((db) => console.log('MongoDB successfully connected'))
    .catch((err) => console.log('MongoDB connect to failed'))

//authenticate
app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/users", userRouter);

function auth(req, res, next) {
  console.log(req.user);

  if (!req.user) {
    var err = new Error("You are not authenticated!");
    err.status = 403;
    next(err);
  } else {
    next();
  }
}

//Routes
app.use('/quizzes', quizRouter); 
app.use('/questions', questionRouter); 

app.listen(port, () => {
    console.log(`Server is running with port ${port}`);
})