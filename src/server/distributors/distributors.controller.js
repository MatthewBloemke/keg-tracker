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
    const newDistributor = {
        distributor_id: req.params.distributorId,
        distributor_name: data.distributor_name,
    }
    await service.update(newDistributor)
    res.status(200).json({data: newDistributor})
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
    destroy: [asyncErrorBoundary(distributorExists), destroy],
    distributorExists,
}