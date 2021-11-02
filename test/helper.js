const jwt = require("jsonwebtoken");

const generateAuthToken = () => {
    const token = jwt.sign({user: 'Matthew'}, process.env.SECRET);
};