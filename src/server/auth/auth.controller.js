const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const service = require("./auth.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const validFields = [
    "employee_name",
    "employee_email",
]

function isAdmin(req, res, next) {
    if (req.cookies.admin != "admin") {
        return next({status: 401, message: "Administrator privileges are required"})
    }
    next()
}

function adminCheck(req, res, next) {
    if (req.cookies.admin != "admin") {
        return next({status: 401, message: "Administrator privileges are required"})
    }
    res.json({data: "working"})
}

const hasPassword = (req, res, next) => {
    bcrypt.hash(req.body.data.password, 10, (err, hash) => {
        if (err) {
            return next({
                status: 400,
                message: "Error creating password"
            })
        } else {
            if (res.locals.newAccount) {
                res.locals.newAccount["password"] = hash;
            } else {
                res.locals.newAccount = {
                    password: hash
                }                
            }
            next()
        }
    })
}
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
    if (typeof data.admin != "boolean") {
        invalidFields.push("admin")
    }
    if (invalidFields.length) {
        return next({
            status: 400,
            message: `${invalidFields.join(", ")} missing data`
        })
    }
    res.locals.newAccount = {
        employee_name: data.employee_name,
        employee_email: data.employee_email,
        admin: data.admin
    }
    next()
};

async function createAccount (req, res) {
    await service.create(res.locals.newAccount)
    res.status(201).json({data: res.locals.newAccount})
}
const list = async (req, res) => {
    res.json({data: await service.list()})
}

const userExistsById = async (req, res, next) => {
    const employee = await service.read(req.params.employeeId)
    if (employee) {
        res.locals.employee = employee;
        return next()
    }
    next({
        status: 404,
        message: "email not found" 
    })

}

const userExists = async (req, res, next) => {
    const employee = await service.readByEmail(req.body.data.employee_email)

    if (employee) {
        res.locals.employee = employee;
        return next()
    }
    next({
        status: 404,
        message: "email not found" 
    })
}
const passwordCheck = async (req, res, next) => {
    bcrypt.compare(req.body.data.password, res.locals.employee.password, (err, result) => {
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

const read = (req, res) => {
    res.json({data: res.locals.employee})
}

const update = async (req, res) => {
    const {data = {}} = req.body;
    const updatedEmployee = {
        employee_name,
        employee_email,
        admin
    } = data;
    if (data.password) {
        updatedEmployee.password = res.locals.newAccount.password
    }
    updatedEmployee.employee_id = req.params.employeeId;
    
    await service.update(updatedEmployee)
    res.status(200).json({data: updatedEmployee})
}

const isUniqueUser = async (req, res, next) => {
    const user = await service.readByEmail(req.body.data.employee_email)
    if (user) {
        if (user.employee_id != req.params.employeeId) {
            return next({status: 400, message: `User ${req.body.data.employee_email} already exists`})
        }
    }
    next()
}

const destroy = async (req, res) => {
    await service.destroy(req.params.employeeId)
    res.sendStatus(200)
}

const login = async (req, res) => {
    const token = jwt.sign({user: res.locals.employee.employee_name}, process.env.SECRET);
    res.cookie('token', token, { maxAge: 60000 * 60 * 6, httpOnly: true });
    if (res.locals.employee.admin) {
        res.cookie('admin', "admin", { maxAge: 60000 * 60 * 6, httpOnly: true })
    }
    res.json({ "data": {employee_id: res.locals.employee.employee_id, employee_name: res.locals.employee.employee_name}});
}

const logout = async (req, res) => {
    res.clearCookie("token");
    res.clearCookie("admin")
    res.json({"data": "logged out"});
}

module.exports = {
    createAccount: [isAdmin, hasValidFields, hasPassword, asyncErrorBoundary(isUniqueUser), asyncErrorBoundary(createAccount)],
    list: [isAdmin, list],
    login: [asyncErrorBoundary(userExists), passwordCheck, login],
    userExists,
    logout,
    read: [asyncErrorBoundary(userExistsById), read],
    update: [hasValidFields, asyncErrorBoundary(userExistsById), asyncErrorBoundary(isUniqueUser), update],
    destroy: [isAdmin, asyncErrorBoundary(userExistsById), destroy],
    resetPassword: [hasPassword, asyncErrorBoundary(userExistsById), update],
    adminCheck
}
