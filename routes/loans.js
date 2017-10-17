var express = require('express');
var router = express.Router();
var Loan = require('../models').Loan;
var Book = require('../models').Book;
var Patron = require('../models').Patron;
var todaysDate = new Date();
var todaysDateString = todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + todaysDate.getDate();
var returnDateString = todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + (todaysDate.getDate() + 7);

/////////////////////////////
/* Get new loan form */
/////////////////////////////
router.get('/new', function(req, res, next) {
  const allBooks = Book.findAll({
    order: [
      ['title', 'ASC']
    ]
  });

  const allPatrons = Patron.findAll({
    order: [
      ['first_name', 'ASC'],
      ['last_name', 'ASC']
    ]
  });

  Promise.all([allBooks, allPatrons]).then(function(values) {
    res.render('new_loan', {books: values[0], patrons: values[1], todaysDateString, returnDateString});
  });
});

/////////////////////////////
/* Get all Loans */
/////////////////////////////
router.get('/', function(req, res, next) {
  Loan.findAll({
    include: [
      {model: Patron},
      {model: Book}
    ]
  }).then(function(loans) {
    res.render('list_loan', {loans});
  });
});

/////////////////////////////
/* Get overdue Loans */
/////////////////////////////
router.get('/overdue_loans', function(req, res, next) {
  Loan.findAll({
    where: {
      returned_on: null,
      return_by: {
        lt: todaysDate
      }
    },
    include: [
      {model: Book},
      {model: Patron}
    ]
  }).then(function(loans) {
    res.render('list_loan', {loans});
  });
});

/////////////////////////////
/* Get checked out Books */
/////////////////////////////
router.get('/checked_loans', function(req, res, next) {
  Loan.findAll({
    where: {
      returned_on: null,
    },
    include: [
      {model: Book},
      {model: Patron}
    ]
  }).then(function(loans) {
    res.render('list_loan', {loans});
  });
});

/////////////////////////////
/* Post new loan */
/////////////////////////////
router.post('/new', function(req, res, next) {
  Loan.create(req.body).then(function() {
    res.redirect('/loans');
  }).catch(function(error) {
    const allBooks = Book.findAll({
      order: [
        ['title', 'ASC']
      ]
    });

    const allPatrons = Patron.findAll({
      order: [
        ['first_name', 'ASC'],
        ['last_name', 'ASC']
      ]
    });

    Promise.all([allBooks, allPatrons]).then(function(values) {
      res.render('new_loan', {books: values[0], patrons: values[1], todaysDateString, returnDateString, errors: error.errors});
    });
  });
});

module.exports = router;
