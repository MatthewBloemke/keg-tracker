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

async function kegExists (req, res, next) {
    const keg = await service.read(req.params.kegId)

    if (keg) {
        res.locals.keg = keg;
        return next()
    }
    next({status: 404, message: `Keg ${req.params.kegId}`})
}

function hasValidFields (req, res, next) {
    console.log(req.body.data)
    if (!req.body.data) {
        return next({
            status: 404,
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

async function create (req, res) {
    const {keg_name, keg_size, keg_status, date_shipped, employee_email} = req.body.data;
    const newKeg = {
        keg_name,
        keg_size,
        keg_status,
        date_shipped,
        "shipped_to": res.locals.distributor.distributor_name
    }
    const newHistory = {
        date_shipped,
        keg_name,
        employee_email,
        distributor_name: res.locals.distributor.distributor_name
    }
    if (keg_status === "shipped") {
        await shippingService.create(newHistory)
    }
    
    const createdKeg = await service.create(newKeg)
    res.json({data: createdKeg})
}

async function update (req, res) {
    const {data = {}} = req.body;
    const updatedKeg = {
        keg_id: req.params.kegId,
        keg_name: data.keg_name,
        keg_size: data.keg_size,
        keg_status: data.keg_status
    }

    await service.update(updatedKeg)
    res.status(200).json({data: updatedKeg})
}

async function destroy(req, res) {
    await service.destroy(req.params.kegId)
    res.sendStatus(200)
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(kegExists), read],
    create: [asyncErrorBoundary(hasValidFields), asyncErrorBoundary(userExists), asyncErrorBoundary(distributorExists), create],
    update: [asyncErrorBoundary(kegExists), asyncErrorBoundary(hasValidFields), update],
    destroy: [asyncErrorBoundary(kegExists), destroy]
}