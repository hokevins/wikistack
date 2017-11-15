var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

module.exports = router;

router.get('/', function(req, res, next) {
  User.findAll({}).then(function(users) {
    res.render('users', { users: users });
  })
  .catch(next);
});

router.get('/:userId', function(req, res, next) {
  var user = User.findById(req.params.userId);
  var pages = Page.findAll({
    where: {
      authorId: req.params.userId
    }
  });
  Promise.all([user, pages])
  .then(function(data) {
    res.render('user', {user: data[0], pages: data[1]});
  })
  .catch(next);
});

router.post('/', function(req, res, next) {
  res.redirect('/');
});

router.put('/:user', function(req, res, next) {
  res.redirect('/');
});

router.delete('/:user', function(req, res, next) {
  res.redirect('/');
});
