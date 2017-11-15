var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

module.exports = router;
//router.get('/name/activity')
//router.get('/name')

router.get('/', function(req, res, next) {
  Page.findAll()
  .then(function(foundPages) {
    res.render('index', { foundPages: foundPages });
  })
  .catch(next);
});

router.get('/add', function(req, res, next) {
  res.render('addPage');
});

router.post('/', function(req, res, next) {
  var user = User.findOrCreate({where: {name: req.body.author, email: req.body.email}});
  var userinstance;
  var page = Page.create({
    title: req.body.title,
    content: req.body.content,
    status: req.body.status
  });

  user
  .then(function(userData) {
    userinstance = userData;
    return page;
  })
  .then(function (savedPage) {
    savedPage.setAuthor(userinstance[0]);
    res.redirect(savedPage.route); // route virtual FTW
  })
  .catch(next);
});


router.get('/:urlTitle', function(req, res, next) {
  Page.findOne({
    where: {
        urlTitle: req.params.urlTitle
    },
    include: [
        {model: User, as: 'author'}
    ]
  })
  .then(function (page) {
    // page instance will have a .author property
    // as a filled in user object ({ name, email })
    if (page === null) {
        res.status(404).send();
    } else {
        res.render('wikipage', {
            page: page
        });
    }
  })
  .catch(next);
  // My old code, needs to be fixed to reflect above:
  // Page.findAll({
  //   where: {
  //     urlTitle: req.params.urlTitle
  //   }
  // })
  // .then(function(foundPage) {
  //   console.log('????????????', foundPage[0].name, foundPage[0].authorId)
  //   res.render('wikipage', {
  //     title: foundPage[0].title,
  //     pageContent: foundPage[0].content,
  //     urlTitle: foundPage[0].urlTitle,
  //     authorId: foundPage[0].authorId,
  //     name: foundPage[0].name
  //   });
  // })
  // .catch(next);
});
