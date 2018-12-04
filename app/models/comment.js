// Example model


module.exports = (sequelize, DataTypes) => {

  const Article = sequelize.define('Comment', {
    body: DataTypes.STRING,
    user: DataTypes.STRING,
    quote_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        // example on how to add relations
        // Article.hasMany(models.Comments);
      }
    }
  });

  return Article;
};

