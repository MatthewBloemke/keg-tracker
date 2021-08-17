const service = require('./shippingHistory.service')

const list = async (req, res) => {
    const shippingHistory = await service.list()
    res.json({data: shippingHistory})
}

module.exports = {
    list,
}