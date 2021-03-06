const service = require("./kegs.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const distributorService = require("../distributors/distributors.service");

async function kegExists (req, res, next) {
    let keg = await service.read(req.params.kegId)
    if (keg) {
        res.locals.keg = keg;
        return next()
        
    }

    next({status: 404, message: `Keg ${req.params.kegId} not found`})
}

async function kegExistsByName (req, res, next) {
    let keg = await service.readByName(req.body.data.keg_name)
    if (keg) {
        res.locals.keg = keg;
        return next()
    }

    next({status: 404, message: `Keg ${req.body.data.keg_name} not found`})
}

function verifyKeg (req, res, next) {
    res.json({data: res.locals.keg})
}

const isUniqueKeg = async (req, res, next) => {
    let keg = await service.readByName(req.body.data.keg_name);
    if (keg) {
        if (keg.keg_id != req.params.kegId) {
            return next({status: 400, message: `Keg ${req.body.data.keg_name} already exists`})
        };
    };
    next();
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
    res.status(201).json({data: createdKeg[0]})
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

async function hasValidTrackingFields (req, res, next) {
    if (!req.body.data) {
        return next({
            status: 400,
            message: "data is missing"
        })
    }
    const invalidFields = []
    const {data ={}} = req.body;
    if (data.keg_status === 'returned') {
        data.distributor_id = null
    }
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

async function track (req, res) {
    const {data = {}} = req.body;
    const trackedKeg = {
        keg_id: req.params.kegId,
        keg_status: data.keg_status,
        date_shipped: data.date_shipped,
        shipped_to: data.distributor_id,
    }
    await service.update(trackedKeg)
    res.status(200).json({data: trackedKeg})
}

async function destroy(req, res) {
    await service.destroy(res.locals.keg.keg_id)
    res.status(200).json("deleted")
}

function isAdmin(req, res, next) {
    if (req.cookies.admin != "admin") {
        return next({status: 401, message: "Administrator privileges are required"})
    }
    next()
}


module.exports = {
    list: [isAdmin, asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(kegExists), read],
    create: [asyncErrorBoundary(hasValidFields), asyncErrorBoundary(isUniqueKeg), createKeg],
    update: [isAdmin, asyncErrorBoundary(kegExists), asyncErrorBoundary(hasValidFields), asyncErrorBoundary(isUniqueKeg), update],
    destroy: [isAdmin, asyncErrorBoundary(kegExists), destroy],
    verifyKeg: [asyncErrorBoundary(kegExistsByName), verifyKeg],
    track: [asyncErrorBoundary(hasValidTrackingFields), track]
}