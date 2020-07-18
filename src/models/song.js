module.exports = (sequelize, DataTypes) => {
  const schema = {
    artistId: DataTypes.INTEGER,
    name: DataTypes.STRING,
  };

  const Song = sequelize.define('Song', schema);
  return Song;
};
