const express = require('express');
const bodyParser = require('body-parser');
const Question = require('../models/question');
const authenticate = require('../authenticate');

const questionRouter = express.Router(); 
questionRouter.use(bodyParser.json()); 

/** Router question */
questionRouter.route('/')
    .get((req, res, next) => {
        Question.find()
            .then((question) => {
                res.setHeader("Content-Type", "application/json"); 
                res.status(200).json(question);
            })
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Question.create(req.body)
            .then((question) => {
                res.setHeader("Content-Type", "application/json");
                res.status(200).json({ message: "Created document", data: question });
            })
            .catch((err) => next(err));
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.send("PUT operation not supported on /questions");
    })

    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Question.deleteMany({})
            .then((resp) => {
                res.setHeader("Content-Type", "application/json");
                res.status(200).json({ message: "Deleted successfully", resp });
            })
            .catch((err) => next(err));
    })


/** Router -> question/:questionId */
questionRouter.route('/:questionId')
    .get((req, res, next) => {
        Question.findById(req.params.questionId)
            .then((question) => {
                res.setHeader("Content-Type", "application/json"); 
                res.status(200).json(question);
            })
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.send("POST operation not supported on /questions/" + req.params.questionId);
    })

    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Question.findByIdAndUpdate(req.params.questionId, {$set: req.body}, {new: true})
            .then((question) => {
                res.setHeader("Content-Type", "application/json");
                res.status(200).json({ message: "Updated document", data: question });
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
    })

module.exports = questionRouter;