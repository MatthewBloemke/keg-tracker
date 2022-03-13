const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const service = require("./auth.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const validFields = [
    "employee_name",
    "employee_email",
    "password",
]

//take password out of hasValidFields and move the password validation and hashing
//into it's own function, then hasValidFields can be used in create and update

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
    bcrypt.hash(req.body.data.password, 10, (err, hash) => {
        if (err) {
            console.log(err)
        } else {
            res.locals.newAccount = {
                employee_name: data.employee_name,
                employee_email: data.employee_email,
                password: hash,
                admin: data.admin
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

    if (employee.length) {
        res.locals.employee = employee[0];
        return next()
    }
    next({
        status: 404,
        message: "email not found" 
    })
}
const passwordCheck = async (req, res, next) => {
    await bcrypt.compare(req.body.data.password, res.locals.employee.password, (err, result) => {
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
        password,
        admin
    } = data;
    updatedEmployee.employee_id = req.params.employeeId;
    await service.update(updatedEmployee)
    res.status(200).json({data: updatedEmployee})
}

const destroy = async (req, res) => {
    await service.destroy(req.params.employeeId)
    res.sendStatus(200)
}

const login = async (req, res) => {
    const token = jwt.sign({user: res.locals.employee.employee_name}, process.env.SECRET);
    res.cookie('token', token, { httpOnly: true });
    res.json({ "data": "working" });
}

const logout = async (req, res) => {
    res.clearCookie("token");
    res.end();
}

module.exports = {
    createAccount: [hasValidFields, asyncErrorBoundary(createAccount)],
    list,
    login: [asyncErrorBoundary(userExists), passwordCheck, login],
    userExists,
    logout,
    read: [asyncErrorBoundary(userExistsById), read],
    update: [asyncErrorBoundary(hasValidFields), asyncErrorBoundary(userExistsById), update],
    destroy: [asyncErrorBoundary(userExistsById), destroy]
}
