const service = require("./kegs.service");
const shippingService = require("../shippingHistory/shippingHistory.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const distributorService = require("../distributors/distributors.service");

function kegIsReturned (req, res, next) {
    if (res.locals.keg.keg_status==="returned") {
        return next()
    }
    next({status: 400, message: `Keg ${req.body.data.keg_name} is already shipped`})
}

async function kegExists (req, res, next) {
    let keg = await service.read(req.params.kegId)
    if (keg.length) {
        res.locals.keg = keg[0];
        return next()
        
    }

    next({status: 404, message: `Keg ${req.params.kegId} not found`})   
    
}

function verifyKeg (req, res, next) {
    res.json({data: res.locals.keg})
}

async function hasValidFields (req, res, next) {
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
        data.distributor_id = null
    }
    if (!data.keg_name) {
        invalidFields.push("keg_name")
    } else {
        if (!parseInt(data.keg_name) || data.keg_name.length != 4) invalidFields.push("keg_name")
    };
    
    if (data.keg_size != "1/6 BBL" && data.keg_size != "1/2 BBL") invalidFields.push("keg_size")
    if (data.keg_status != 'returned' && data.keg_status != "shipped") invalidFields.push("keg_status")
    if (data.keg_status === "shipped") {
        let distributor = await distributorService.read(req.body.data.distributor_id)
        if (!distributor) invalidFields.push("distributor_id")
        if (!data.date_shipped) invalidFields.push("date_shipped")
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

async function createKeg (req, res) {
    const {keg_name, keg_size, keg_status, date_shipped, distributor_id} = req.body.data;
    const newKeg = {
        keg_name,
        keg_size,
        keg_status,
        date_shipped,
        shipped_to: distributor_id
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
    create: [asyncErrorBoundary(hasValidFields), createKeg],
    update: [asyncErrorBoundary(kegExists), asyncErrorBoundary(hasValidFields), update],
    destroy: [asyncErrorBoundary(kegExists), destroy],
    verifyKeg: [asyncErrorBoundary(kegExists), verifyKeg],
}