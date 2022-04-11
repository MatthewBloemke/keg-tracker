const service = require('./shippingHistory.service');
const kegService = require('../kegs/kegs.service');
const employeeService = require("../auth/auth.service");
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const distributorService = require('../distributors/distributors.service');

const list = async (req, res) => {
    const shippingHistory = await service.list();
    res.json({data: shippingHistory});
};

const shippingHistoryExists = async (req, res, next) => {
    let shippingHistory = await service.read(req.params.shippingId)

    if (shippingHistory) {
        res.locals.shippingHistory = shippingHistory;
        return next()
    }
    next({status: 404, message: `Shipping History ${req.params.shippingId} not found`})
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
    if (data.keg_status != 'returned' && data.keg_status != "shipped") invalidFields.push("keg_status")
    if (!Date.parse(data.date_shipped)) invalidFields.push("date_shipped");
    if (data.keg_status === "returned") {
        data.distributor_id = null;
    } else if (!parseInt(data.distributor_id)) {
        invalidFields.push("distributor_id")
    } else {
        const distributor = await distributorService.read(data.distributor_id);
        if (!distributor) invalidFields.push("distributor_id");
    }
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
    const {date_shipped, employee_email, keg_id, keg_status} = req.body.data;
    const newHistory = {
        date_shipped,
        keg_id,
        employee_email,
        distributor_id: res.locals.data.distributor_id,
        keg_status
    }
    const createdHistory = await service.create(newHistory);
    res.status(201).json({data: createdHistory})
};

const read = (req, res) => {
    res.json({data: res.locals.shippingHistory});
}

const update = async (req, res) => {
    const {date_shipped, keg_id, employee_email, keg_status} = req.body.data;
    const updatedHistory = {
        shipping_id: req.params.shippingId,
        date_shipped,
        keg_id,
        employee_email,
        distributor_id: res.locals.data.distributor_id,
        keg_status
    }
    await service.update(updatedHistory)
    res.status(200).json({data: updatedHistory})
}

const destroy = async (req, res) => {
    await service.destroy(res.locals.shippingHistory.shipping_id)
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
    read: [isAdmin, asyncErrorBoundary(shippingHistoryExists), read],
    create: [asyncErrorBoundary(hasValidFields), createHistory],
    update: [isAdmin, asyncErrorBoundary(shippingHistoryExists), asyncErrorBoundary(hasValidFields), update],
    destroy: [isAdmin, asyncErrorBoundary(shippingHistoryExists), destroy]
};