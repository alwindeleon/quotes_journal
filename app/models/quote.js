// Example model


module.exports = (sequelize, DataTypes) => {

  const Quote = sequelize.define('Quote', {
    body: DataTypes.STRING,
    author: DataTypes.STRING,
    curated: DataTypes.BOOLEAN,
    public: DataTypes.BOOLEAN,
    likes: DataTypes.INTEGER,
    user_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Quote.hasMany(models.Comment);
      }
    }
  });

  return Quote;
};

