var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;


// Destructuring assignment

//var {Page, User} = require('../models');


//other examples:

// const myObj  = {name: "Cassio", age: 30};


// const name = myObj.name;
// const age = myObj.age;

// const {name, age} = myObj;


module.exports = router;
//router.get('/name/activity')
//router.get('/name')

router.get('/search', function(req, res, next) {
  var tags = req.query.tags.trim().split(' ');
  Page.findAll({
    // $overlap matches a set of possibilities
    where : {
        tags: {
            $overlap: tags
        }
    }
  })
  .then(function(similarPagesArray){
    console.log('???????????????????', similarPagesArray);
    res.render('index', { foundPages: similarPagesArray });
  })
  .catch(next);
});

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
  var tagsArray = req.body.tags.trim().split(' ');
  var user = User.findOrCreate({where: {name: req.body.author, email: req.body.email}});
  var userinstance;
  var page = Page.create({
    title: req.body.title,
    content: req.body.content,
    status: req.body.status,
    tags: tagsArray
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

router.get('/:urlTitle/similar', function(req, res, next) {
  Page.findOne({
    where: {
        urlTitle: req.params.urlTitle
    }
  })
  .then(function (page) {
    return page.findSimilar();
  })
  .then(function(similarPages) {
    res.render('index', { foundPages: similarPages });
  })
  .catch(next);
});


router.get('/:urlTitle', function(req, res, next) {
  Page.findOne({
    where: {
        urlTitle: req.params.urlTitle
    },
    include: [ // include is the "join" in SQL
        {model: User, as: 'author'}
    ]
  })
  .then(function (page) {
    // page instance will have a .author property
    // as a filled in user object ({ name, email })
    if (page === null) {
        res.status(404).send();
    } else {
        var tagsString = page.tags.join(', ');
        res.render('wikipage', {
            page: page,
            tags: tagsString
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
