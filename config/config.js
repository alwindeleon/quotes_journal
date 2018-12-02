const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'quotes-journal'
    },
    port: process.env.PORT || 3000,
    db: process.env.CLEARDB_DATABASE_URL || 'mysql://root:alwindeleon@localhost/quotes_journal'
  },

  test: {
    root: rootPath,
    app: {
      name: 'quotes-journal'
    },
    port: process.env.PORT || 3000,
    db: process.env.CLEARDB_DATABASE_URL || 'mysql://localhost/quotes_journal'
  },

  production: {
    root: rootPath,
    app: {
      name: 'quotes-journal'
    },
    port: process.env.PORT || 3000,
    db: process.env.CLEARDB_DATABASE_URL || 'mysql://localhost/quotes_journal'
  }
};

module.exports = config[env];
