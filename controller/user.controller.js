const db = require('../db');
const uuid = require('uuid')
const format = require('pg-format')
const ApiError = require('../error/ApiError');

class UserController {
  async createUser(req, res) {
    const {
      login,
      password,
      age,
    } = req.body;

    const newUser = await db.query(
      `INSERT INTO users(id, login, password, age) values($1, $2, $3, $4) RETURNING *`,
      [
        uuid.v4(),
        login,
        password,
        age
      ]
    );

    res.json(newUser.rows[0]);
  }
  async getUsers(req, res) {
    const users = await db.query('SELECT * FROM users');
    res.json({ users: users.rows, count: users.rowCount });
  }
  async getUserById(req, res) {
    const id = req.params.id;
    const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    res.json(user.rows[0]);
  }
  async updateUser(req, res, next) {
    try {
      const id = req.params.id
      const updatedString = Object.keys(req.body).map((value, key) => `${value} = $${key + 1}`)
      const user = await db.query(
        format(`UPDATE users SET %s WHERE id = $${updatedString.length + 1} RETURNING *`, updatedString.join(', ')),
        [...Object.values(req.body), id]
      );
      res.json(user.rows[0]);

    } catch (e) {
      res.json(ApiError.badRequest(e.message))
    }
  }
  // async deleteUser(req, res) {
  //   const id = req.params.id;
  //   const user = await db.query('UPDATE users SET isdeleted = $1 FROM users WHERE id = $2', [id, isdeleted])
  //   res.json(user.rows)
  // }
}

module.exports = new UserController();
