const knex = require("../db/connections")

const list = () => {
    return knex("shippinghistory")
        .select("*")
        .orderBy("date_shipped")
}

const readByDate = (date_shipped) => {
    return knex("shippinghistory")
        .select("*")
        .where({date_shipped})
}

const readByDistributor = (distibutor_id) => {
    return knex("shippinghistory")
        .select("*")
        .where({distibutor_id})
}

const create = (history_entry) => {
    return knex("shippinghistory")
        .insert(history_entry)
        .returning("*")    
}


module.exports = {
    list,
    readByDate,
    readByDistributor,
    create
}