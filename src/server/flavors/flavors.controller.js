const service = require("./flavors.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function flavorExists (req, res, next) {
    const flavor = await service.read(req.params.flavorId)
    
    if (flavor) {
        res.locals.flavor = flavor;
        return next()
    }
    next({status: 404, message: `Flavor ${req.params.flavorId} not found`})
}

const isUniqueFlavor = async (req, res, next) => {
    let flavor = await service.readByName(req.body.data.flavor_name)
    if (flavor) {
        if (flavor.flavor_id != req.params.flavorId) {
            return next({status: 400, message: `Flavor ${req.body.data.flavor_name} already exists`})
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
    if (!data.flavor_name) {
        return next({
            status: 400,
            message: "flavor_name invalid"
        })
    }
    if (!(Number(req.body.data.kegs_filled) + 1)) {
        return next({
            status: 400,
            message: "kegs_filled invalid"  
        })
    }
    next()
}

function read (req, res) {
    res.json({data: res.locals.flavor});
}

async function list (req, res) {
    let flavors = await service.list();
    res.json({data: flavors});
}

async function create(req, res) {
    const {data} = req.body
    const newFlavor = {
        flavor_name: data.flavor_name,
        kegs_filled: 0
    }
    const createdFlavor = await service.create(newFlavor)
    res.status(201).json({data: createdFlavor[0]});
}

async function update(req, res) {
    const {data = {}} = req.body;
    const updatedFlavor = {
        flavor_id: req.params.flavorId,
        flavor_name: data.flavor_name,
        kegs_filled: (data.flavor_name === res.locals.flavor.flavor_name ? res.locals.flavor.kegs_filled + 1 : res.locals.flavor.kegs_filled)
    }
    await service.update(updatedFlavor)
    res.status(200).json({data: updatedFlavor})
}

async function destroy(req, res) {
    await service.destroy(req.params.flavorId)
    res.sendStatus(200)
}

function isAdmin(req, res, next) {
    if (req.cookies.admin != "admin") {
        return next({status: 401, message: "Administrator privileges are required"})
    }
    next()
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(flavorExists), read],
    create: [isAdmin, asyncErrorBoundary(hasValidFields), asyncErrorBoundary(isUniqueFlavor), create],
    update: [isAdmin, asyncErrorBoundary(flavorExists), asyncErrorBoundary(hasValidFields), asyncErrorBoundary(isUniqueFlavor), update],
    destroy: [isAdmin, asyncErrorBoundary(flavorExists), destroy],
    flavorExists,
}