const service = require("./distributors.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function distributorExists (req, res, next) {
    const distributor = await service.read(req.params.distributorId)
    
    if (distributor) {
        res.locals.distributor = distributor;
        return next()
    }
    next({status: 404, message: `Distributor ${req.params.distributorId}`})
}

const hasValidDaysOut = (req, res, next) => {
    if (!req.body.data.days_out_arr) {
        return next({
            status: 400,
            message: "days_out_arr is missing"
        })
    } else if (!res.locals.distributor.days_out_arr && req.body.data.days_out_arr.length != 1) {
        return next({
            status: 400,
            message: "days_out_arr is not valid"
        })
    } else if (res.locals.distributor.days_out_arr) {
        if (res.locals.distributor.days_out_arr.length != (req.body.data.days_out_arr.length - 1)) {
            
            return next({status: 400, message: "days_out_arr not valid"})            
        }
    }
    next()
}

function hasValidFields (req, res, next) {
    if (!req.body.data) {
        next({
            status: 400,
            message: "data is missing"
        })
    }
    let {data = {}} = req.body;
    if (!data.distributor_name) {
        return next({
            status: 400,
            message: "distributor_name invalid"
        })
    }
    next()
}

async function read (req, res) {
    res.json({data: res.locals.distributor});
}

async function list (req, res) {
    let distributors = await service.list();
    res.json({data: distributors});
}

async function create(req, res) {
    const {distributor_name} = req.body.data
    const createdDistributor = await service.create(distributor_name)
    res.status(201).json({data: createdDistributor[0]});
}

async function update(req, res) {
    const {data = {}} = req.body;
    const updatedDistributor = {
        distributor_id: req.params.distributorId,
        distributor_name: data.distributor_name,
    }
    if (req.body.data.days_out_arr) {
        updatedDistributor["days_out_arr"] = req.body.data.days_out_arr
    }
    await service.update(updatedDistributor)
    res.status(200).json({data: updatedDistributor})
}

async function destroy(req, res) {
    await service.destroy(req.params.distributorId)
    res.sendStatus(200)
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(distributorExists), read],
    create: [asyncErrorBoundary(hasValidFields), create],
    update: [asyncErrorBoundary(hasValidFields), asyncErrorBoundary(distributorExists), update],
    updateDaysOut: [hasValidFields, asyncErrorBoundary(distributorExists), hasValidDaysOut, update],
    destroy: [asyncErrorBoundary(distributorExists), destroy],
    distributorExists,
}