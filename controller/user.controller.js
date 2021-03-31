const uuid = require('uuid');
const ApiError = require('../error/ApiError');
let users = require('../data/users');
const { querySchema, bodySchemaForCreate, bodySchemaForUpdate } = require('../schemas/userSchema');

class UserController {
    async createUser(req, res) {
        try {
            await bodySchemaForCreate.validateAsync(req.body);

            const createNewUser = ({ login, password, age }) => ({
                id: uuid.v4(),
                login,
                password,
                age,
                isdeleted: false
            });

            const newUser = createNewUser(req.body);

            const isLoginExists = users.filter(user => user.login === newUser.login);
            if (isLoginExists.length) {
                return res.json({ message: 'login should be unique' });
            }

            users.push(newUser);

            res.json(newUser);
        } catch (err) {
            res.status(400).json(ApiError.badRequest(err.details[0].message));
        }
    }

    async getUsers(req, res) {
        try {
            await querySchema.validateAsync(req.query);

            const { limit, sort, loginSubstring } = req.query;

            const getAutoSuggestUsers = () => {
                const num = sort === 'desc' ? 1 : -1;

                const filteredUsersList = users.filter(user => loginSubstring ? user.login.includes(loginSubstring) : true);

                const sortedUsersList = filteredUsersList.sort((a, b) => {
                    const loginA = a.login.toLowerCase();
                    const loginB = b.login.toLowerCase();
                    if (loginA < loginB) return num;
                    if (loginA > loginB) return -num;
                    return 0;
                });

                const newUsersList = limit ? sortedUsersList.slice(0, limit) : sortedUsersList;

                return { users: newUsersList, count: newUsersList.length };
            };

            res.json(getAutoSuggestUsers(loginSubstring, limit));
        } catch (err) {
            res.status(400).json(ApiError.badRequest(err.details[0].message));
        }
    }

    async getUserById(req, res) {
        const id = req.params.id;
        const currentUser = users.filter(user => user.id === id);
        res.json(currentUser);
    }
    async updateUser(req, res) {
        try {
            await bodySchemaForUpdate.validateAsync(req.body);

            const id = req.params.id;
            const currentUser = users.filter(user => user.id === id);
            users = users.filter(user => user.id !== id);

            if (req.method === 'DELETE') {
                if (currentUser[0].isdeleted === true) {
                    return res.status(400).json(ApiError.badRequest('user not found'));
                }

                const deletedUser = {
                    ...currentUser[0],
                    isdeleted: true
                };

                users.push(deletedUser);
                return res.json(deletedUser);
            }

            const updatedUser = {
                ...currentUser[0],
                ...req.body
            };
            users.push(updatedUser);
            res.json(updatedUser);
        } catch (err) {
            res.status(400).json(ApiError.badRequest(err.details[0].message));
        }
    }
}

module.exports = new UserController();
