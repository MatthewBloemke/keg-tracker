const service = require('./fillingHistory.service');
const kegService = require('../kegs/kegs.service');
const employeeService = require("../auth/auth.service");
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const flavorService = require("../flavors/flavors.service")

const list = async (req, res) => {
    const fillingHistory = await service.list();
    res.json({data: fillingHistory});
};

const fillingHistoryExists = async (req, res, next) => {
    let fillingHistory = await service.read(req.params.fillingId)

    if (fillingHistory) {
        res.locals.fillingHistory = fillingHistory;
        return next()
    }
    next({status: 404, message: `Shipping History ${req.params.fillingId} not found`})
}

const hasValidFields = async (req, res, next) => {

    if (!req.body.data) {
        return next({
            status: 400,
            message: "data is missing"
        })
    }

    const invalidFields = []
    const {data = {}} = req.body;
    if (!Date.parse(data.date_filled)) invalidFields.push("date_filled");

    const flavor = await flavorService.read(data.flavor_id);
    if (!flavor) invalidFields.push("flavor_id");

    if (!parseInt(data.keg_id)) {
        invalidFields.push("keg_id")
    } else {
        const keg = await kegService.read(data.keg_id);
        if (!keg) invalidFields.push("keg_id");
    }
    if (!data.employee_email) {
        invalidFields.push("employee_email")
    } else {
        const user = await employeeService.readByEmail(data.employee_email)
        if (!user) invalidFields.push("employee_email")
    }
    res.locals.data = data;
    if (invalidFields.length) {
        return next({
            status: 400,
            message: `${invalidFields.join(", ")} missing data`
        })
    }
    
    next()
}

const createHistory = async (req, res) => {
    const {date_filled, employee_email, keg_id} = req.body.data;
    const newHistory = {
        date_filled,
        keg_id,
        employee_email,
        flavor_id: res.locals.data.flavor_id
    }
    const createdHistory = await service.create(newHistory);
    res.status(201).json({data: createdHistory})
};

const read = (req, res) => {
    res.json({data: res.locals.fillingHistory});
}

const update = async (req, res) => {
    const {date_filled, keg_id, employee_email} = req.body.data;
    const updatedHistory = {
        filling_id: req.params.fillingId,
        date_filled,
        keg_id,
        employee_email,
        flavor_id: res.locals.data.flavor_id
    }
    await service.update(updatedHistory)
    res.status(200).json({data: updatedHistory})
}

const destroy = async (req, res) => {
    await service.destroy(res.locals.fillingHistory.filling_id)
    res.sendStatus(200)
}

function isAdmin(req, res, next) {
    if (req.cookies.admin != "admin") {
        return next({status: 401, message: "Administrator privileges are required"})
    }
    next()
}

module.exports = {
    list: [isAdmin, asyncErrorBoundary(list)],
    read: [isAdmin, asyncErrorBoundary(fillingHistoryExists), read],
    create: [asyncErrorBoundary(hasValidFields), createHistory],
    update: [isAdmin, asyncErrorBoundary(fillingHistoryExists), asyncErrorBoundary(hasValidFields), update],
    destroy: [isAdmin, asyncErrorBoundary(fillingHistoryExists), destroy]
};