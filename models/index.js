var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

const Page = db.define('page', {
  title: {  // these are the 'attribute' parameters for our Page model
    type: Sequelize.STRING, // STRING's default is 255 characters
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open', 'closed') // Enumerated Values where fields can only be 1 or the other, aka public or private page
  }
}, { // these are the 'options' parameters of Page
  getterMethods: {
    route() {
      return '/wiki/' + this.urlTitle;
    }
  },
  hooks: {
    beforeValidate: function(page, options) {
      if (page.title) {
      page.urlTitle = page.title.trim().replace(/\s+/g, '_').replace(/\W/g, '');
    } else {
      page.urlTitle = Math.random().toString(36).substring(2, 7);
    }
    }
  }
});

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true // these are a constraint at the application level and not the database level, so inside a validate object
    }
  }
});

module.exports = {
  Page: Page,
  User: User,
  db: db
};
