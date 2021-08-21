const service = require('./shippingHistory.service');
const kegService = require('../kegs/kegs.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const {distributorExists} = require('../distributors/distributors.controller');

const list = async (req, res) => {
    const shippingHistory = await service.list();
    res.json({data: shippingHistory});
};

const createHistory = (req, res) => {
    const {date_shipped, employee_email, keg_name} = req.body.data;
    keg_name.forEach(async (keg) => {
        const newHistory = {
            date_shipped,
            keg_name: keg,
            employee_email,
            distributor_name: res.locals.distributor.distributor_name            
        };
        const updatedKeg = {
            keg_name: keg,
            date_shipped,
            keg_status: "shipped",
            shipped_to: res.locals.distributor.distributor_name
        };
        await kegService.update(updatedKeg);
        await service.create(newHistory);
    });
    res.json({data: keg_name})
};

module.exports = {
    list,
    create: [asyncErrorBoundary(distributorExists), createHistory]
};