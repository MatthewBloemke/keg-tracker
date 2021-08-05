const knex = require("../db/connections")

const list = () => {
    return knex("shippinghistory")
        .select("*")
        .orderBy("shipped_date")
}

const readByDate = (shipped_date) => {
    return knex("shippinghistory")
        .select("*")
        .where({shipped_date})
}

const readByDistributor = (distibutor_id) => {
    return knex("shippinghistory")
        .select("*")
        .where({distibutor_id})
        
}