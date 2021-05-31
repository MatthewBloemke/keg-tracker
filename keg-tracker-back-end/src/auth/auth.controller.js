const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const service = require("./auth.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const validFields = [
    "employee_name",
    "employee_email",
    "password"
]

const hasValidFields = (req, res, next) => {
    const invalidFields = [];
    if (!req.body.data) {
        return next({
            status: 400,
            message: "data is missing"
        })
    }
    const {data = {}} = req.body;
    validFields.forEach(field => {
        if (!data[field]) {
            invalidFields.push(field)
        }
    });
    if (invalidFields.length) {
        return next({
            status: 400,
            message: `${invalidFields.join(", ")} missing data`
        })
    }
    bcrypt.hash(req.body.data.password, 10, (err, hash) => {
        if (err) {
            console.log(err)
        } else {
            res.locals.newAccount = {
                employee_name: data.employee_name,
                employee_email: data.employee_email,
                password: hash
            }
            next()
        }
    })
    
};

async function createAccount (req, res) {
    await service.create(res.locals.newAccount)
    res.json({data: res.locals.newAccount})
}
const list = async (req, res) => {
    res.json({data: await service.list()})
}

const userExists = async (req, res, next) => {
    const employee = await service.readByEmail(req.body.data.employee_email)
    if (employee) {
        res.locals.employee = employee[0];
        return next()
    }
    next({
        status: 404,
        message: "email not found" 
    })
}
const passwordCheck = async (req, res, next) => {
    console.log(req.body.data.password, res.locals.employee)
    await bcrypt.compare(req.body.data.password, res.locals.employee.password, (err, result) => {
        console.log(result)
        if (result) {
            return next()
        } else {
            return next ({
                status: 400,
                message: "password incorrect"
            })
        }
    })
}

const login = async (req, res) => {
    const token = jwt.sign({user: res.locals.employee.employee_name}, process.env.SECRET);    
    res.cookie('token', token, { httpOnly: true });
    res.json({ token });
}

module.exports = {
    createAccount: [hasValidFields, asyncErrorBoundary(createAccount)],
    list,
    login: [asyncErrorBoundary(userExists), passwordCheck, login]
}
