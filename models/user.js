'use strict';
const { encrypt } = require('../helpers/encrypt');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) { }
  }
  User.init({
    username: {
      type: DataTypes.STRING(50),
      unique: {msg: 'Username is already registered'},
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Username is required'},
        notNull: {msg: 'Username is required'}
      }
    },
    email: {
      type: DataTypes.STRING(50),
      unique: {msg: 'Email is already registered'},
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Email is required'},
        notNull: {msg: 'Email is required'},
        isEmail: {msg: 'Email is invalid'}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'Password is required'},
        notNull: {msg: 'Password is required'},
        len: {
          msg: 'Password must be at least 8 characters long',
          args: [8, 50]
        }
      }
    },
    role: {
      type: DataTypes.ENUM,
      values: ['Admin', 'Staff', 'User'],
      allowNull: false,
      defaultValue: 'User',
      validate: {
        notEmpty: {msg: 'Role is required'},
        notNull: {msg: 'Role is required'},
        isIn: {
          msg: 'Role must be one of three values: \'Admin\', \'Staff\', or \'User\'',
          args: [['Admin', 'Staff', 'User']]
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user, options) => {
    user.dataValues.password = encrypt(user.dataValues.password);
  })
  return User;
};