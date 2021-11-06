const knex = require("../db/connections")

const list = () => {
    return knex("shippinghistory")
        .select("*")
        .orderBy("date_shipped")
}

const read = (shipping_id) => {
    return knex("shippinghistory")
        .select("*")
        .where({shipping_id})
        .first()
}

const create = (history_entry) => {
    return knex("shippinghistory")
        .insert(history_entry)
        .returning("*")    
}

const update = (updatedHistory) => {
    return knex('shippinghistory')
        .select("*")
        .where({shipping_id: updatedHistory.shipping_id})
        .update(updatedHistory, "*")
        .returning("*")
}

const destroy = (shipping_id) => {
    return knex("shippinghistory")
        .where({shipping_id})
        .del()
}


module.exports = {
    list,
    read,
    create,
    update,
    destroy
}