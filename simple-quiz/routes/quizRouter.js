const express = require('express');
const bodyParser = require('body-parser');
const Quiz = require('../models/quiz');
const Question = require('../models/question');
const authenticate = require('../authenticate');

const quizRouter = express.Router(); 
quizRouter.use(bodyParser.json()); 

quizRouter.route('/')
    .get((req, res, next) => {
        Quiz.find()
            .then((quiz) => {
                res.setHeader("Content-Type", "application/json"); 
                res.status(200).json(quiz);
            })
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Quiz.create(req.body)
            .then((quiz) => {
                res.setHeader("Content-Type", "application/json");
                res.status(200).json({ message: "Created document", data: quiz });
            })
            .catch((err) => next(err));
    })

    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.send("PUT operation not supported on /quizzes");
    })

    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Question.deleteMany({})
            .then((resp) => {
                res.setHeader("Content-Type", "application/json");
                res.status(200).json({ message: "Deleted successfully", resp });
            })
            .catch((err) => next(err));
    })

    /** Router -> quizzes/:quizzesId */
quizRouter
  .route("/:quizId")
  .get((req, res, next) => {
    Quiz.findById(req.params.quizId)
      .then((quiz) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(quiz);
      })
      .catch((err) => next(err));
  })

  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.send(
      "POST operation not supported on /quizzes/" + req.params.quizId
    );
  })

  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Quiz.findByIdAndUpdate(
      req.params.quizId,
      { $set: req.body },
      { new: true }
    )
      .then((quiz) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ message: "Updated document", data: quiz });
      })
      .catch((err) => next(err));
  })

  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Question.findByIdAndDelete(req.params.questionId)
      .then((resp) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json({ message: "Deleted successfully", resp });
      })
      .catch((err) => next(err));
  });

quizRouter.route('/:quizId/populate')
  .get((req, res, next) => {
    Quiz.findById(req.params.quizId)
        .populate({ path: 'questions', match: { text: { $regex: /capital/i } }})

        .then((quiz) => {
          if(!quiz) {
            const err = new Error('Quiz not found')
            err.status = 404
            throw err
          }
          res.status(200)
          res.setHeader('Content-Type', 'application/json')
          res.json(quiz)
        })
  })


module.exports = quizRouter;