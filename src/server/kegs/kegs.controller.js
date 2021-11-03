const service = require("./kegs.service");
const shippingService = require("../shippingHistory/shippingHistory.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {userExists} = require("../auth/auth.controller");
const { distributorExists } = require("../distributors/distributors.controller");
const validFields = [
    "keg_name",
    "keg_size",
    "keg_status",
    "date_shipped",
    "distributor_id"
]
const requiredFields = [
    "keg_name",
    "keg_size",
    "keg_status"
]
const validReturnFields = [
    "date_shipped",
    "keg_name",
    "keg_status",
    "employee_email",
    "shipped_to"
]

function kegIsReturned (req, res, next) {
    if (res.locals.keg.keg_status==="returned") {
        return next()
    }
    next({status: 400, message: `Keg ${req.body.data.keg_name} is already shipped`})
}

function kegIsShipped (req, res, next) {
    if (res.locals.keg.keg_status === "shipped") {
        return next()
    }
    next({status: 400, message: `Keg ${req.body.data.keg_name} is already returned`})
}

async function kegExists (req, res, next) {
    let keg = "";
    if (req.params.kegName) {
        keg = await service.read(req.params.kegName)
    } else {
        keg = await service.read(req.body.data.keg_name)        
    }
    if (keg.length) {
        res.locals.keg = keg[0];
        return next()
        
    }
    console.log(req.params.kegName)
    if (req.params.kegName) {
        next({status: 404, message: `Keg ${req.params.kegName} not found`})   
    } else {
        next({status: 404, message: `Keg ${req.body.data.keg_name} not found`})    
    }
    
}

function verifyKeg (req, res, next) {
    res.json({data: res.locals.keg})
}

function hasValidFields (req, res, next) {
    if (!req.body.data) {
        return next({
            status: 400,
            message: "data is missing"
        })
    }
    const invalidFields = []
    const {data ={}} = req.body;
    if (data.keg_status === 'returned') {
        data.date_shipped = null
        requiredFields.forEach(field => {
            if (!data[field]) {
                invalidFields.push(field)
            }
        });    
    } else {
        validFields.forEach(field => {
            if (!data[field]) {
                invalidFields.push(field)
            }
        });        
    }
    if (invalidFields.length) {
        return next({
            status: 400,
            message: `${invalidFields.join(", ")} missing data`
        })
    }
    next()
}

async function list (req, res) {
    const kegs = await service.list()
    res.json({data: kegs})
}

function read (req, res) {
    res.json({data: res.locals.keg})
}

async function createReturnedKeg (req, res) {
    console.log('creating')
    const {keg_name, keg_size, keg_status, employee_email} = req.body.data;
    const newKeg = {
        keg_name,
        keg_size,
        keg_status
    }

    const createdKeg = await service.create(newKeg)
    res.status(201).json({data: createdKeg})
}

async function update (req, res) {
    const {data = {}} = req.body;
    const updatedKeg = {
        keg_id: req.params.kegId,
        keg_name: data.keg_name,
        keg_size: data.keg_size,
        keg_status: res.locals.keg.keg_status
    }

    await service.update(updatedKeg)
    res.status(200).json({data: updatedKeg})
}

async function destroy(req, res) {
    await service.destroy(res.locals.keg.keg_id)
    res.sendStatus(200)
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(kegExists), read],
    create: [asyncErrorBoundary(hasValidFields), createReturnedKeg],
    update: [asyncErrorBoundary(kegExists), asyncErrorBoundary(hasValidFields), update],
    destroy: [asyncErrorBoundary(kegExists), destroy],
    verifyKeg: [asyncErrorBoundary(kegExists), verifyKeg],
}