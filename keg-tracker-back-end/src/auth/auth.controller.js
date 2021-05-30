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
    console.log(res.locals.newAccount)
    res.json({data: res.locals.newAccount})
}
const list = async (req, res) => {
    // bcrypt.compare(password, hashedPassword, (err, result) => {
    //     console.log(result)
    // })
    res.json({data: await service.list()})
}

module.exports = {
    createAccount: [hasValidFields, asyncErrorBoundary(createAccount)],
    list
}
