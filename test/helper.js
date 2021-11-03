const jwt = require("jsonwebtoken");

require('dotenv').config();

const generateAuthToken = () => {
    return jwt.sign({user: 'Matthew'}, process.env.SECRET);
};