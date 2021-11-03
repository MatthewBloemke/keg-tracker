const jwt = require("jsonwebtoken");

require('dotenv').config();

export const generateAuthToken = () => {
    return jwt.sign({user: 'Matthew'}, process.env.SECRET);
};