const { User } = require("../models");
const { compare } = require('../helpers/encrypt');
const { signToken } = require('../helpers/jwt');
const {OAuth2Client, auth} = require('google-auth-library');
const client = new OAuth2Client();

class Controller {

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({where: {username}});
      if (!user) throw { name: 'InvalidLogin' };
      if (!compare(password, user.password)) throw { name: 'InvalidLogin' };
      const accessToken = signToken({
        id: user.id, 
        username: user.username,
        role: user.role
      }, '7d');
      res.status(200).json({
        access_token: accessToken
      });
    } catch(err) {
      next(err);
    }
  }

  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const user = await User.create({
        username, email, password
      });
      delete user.dataValues.password;
      res.status(201).json(user);
    } catch(err) {
      next(err);
    }
  }

  static async glogin(req, res, next) {
    try {

      const { google_token } = req.headers;
      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID
      })

      const payload = ticket.getPayload();

      const [user, created] = await User.findOrCreate({
        where: {email: payload.email},
        defaults: {
          username: payload.name,
          email: payload.email,
          role: "User",
          password: encrypt("google-login")
        },
        hooks: false
      })
      const { id, username, role } = user;
      if (role !== 'User') throw {name: 'InvalidLogin', message: `Invalid user/password`};
      const accessToken = signToken({id, username, role}, '7d');
      res.status(200).json({
        access_token: accessToken
      });
    } catch (err) {
      next(err);
    }
  }

}

module.exports = Controller;
