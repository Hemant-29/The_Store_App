const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    if (authHeader.split(' ')[0] != 'Bearer' || authHeader.split(' ').length != 2) {
        return res.status(401).json({ error: 'Incorrect authorization header!' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ msg: "Error with Access Token" })
        }
        req.user = user
        next()
    })
}

module.exports = authenticateToken;