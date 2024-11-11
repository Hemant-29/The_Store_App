const usersModel = require('../models/users')
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
    try {
        const users = await usersModel.find();

        res.status(200).json({ users: users, nbHits: users.length })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getUser = async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({ user: user })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const addUser = async (req, res) => {
    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ msg: 'Username and password must be provided' });
        }

        const existingUser = await usersModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: 'Username is already taken' });
        }

        const user = await usersModel.create({
            username: username,
            password: password
        })

        res.status(201).json({ msg: "user created sucessfully!", user: user });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password must be provided' });
        }

        const existingUser = await usersModel.findOne({ username });
        if (existingUser) {
            if (existingUser.password == password) {

                const userPayload = {
                    id: existingUser._id,
                    username: existingUser.username,
                }
                const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
                const decodedToken = jwt.decode(accessToken);

                return res.status(200).json({
                    msg: "Logged In sucessfully!",
                    user: userPayload,
                    accessToken: accessToken,
                    iat: decodedToken.iat,
                    exp: decodedToken.exp
                })
            }
            return res.status(401).json({ msg: "Incorrect Password!" });
        }
        res.status(404).json({ msg: "No user found!" });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getAllUsers,
    getUser,
    addUser,
    loginUser
}