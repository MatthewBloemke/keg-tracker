const jwt = require("jsonwebtoken");

const generateAuthToken = () => {
    return jwt.sign({user: 'Matthew'}, process.env.SECRET);
};