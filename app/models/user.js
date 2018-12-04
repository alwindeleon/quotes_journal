// Example model


module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true},
    email: { type: DataTypes.STRING, unique: true},
    fullname: DataTypes.STRING,
    password: DataTypes.STRING,
    curator: DataTypes.BOOLEAN,
    admin: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: (models) => {
        // example on how to add relations
        // Article.hasMany(models.Comments);
      }
    }
  });

  return User;
};

