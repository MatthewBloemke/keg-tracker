const service = require('./shippingHistory.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const {distributorExists} = require('../distributors/distributors.controller')
const {kegExists} = require("../kegs/kegs.controller")

const list = async (req, res) => {
    const shippingHistory = await service.list()
    res.json({data: shippingHistory})
}

const createHistory = async (req, res) => {
    const {date_shipped, employee_email, keg_name} = req.body.data
    const newHistory = {
        date_shipped,
        keg_name,
        employee_email,
        distributor_name: res.locals.distributor.distributor_name
    }
    await service.create(newHistory)
    res.json({data: newHistory})
}

module.exports = {
    list,
    create: [asyncErrorBoundary(kegExists), asyncErrorBoundary(distributorExists), createHistory]
}