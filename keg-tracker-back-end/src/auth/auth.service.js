const knex = require("../db/connections")

const create = (newAccount) => {
    return knex("employees")
        .insert(newAccount)
        .returning("*")
}

const list = () => {
    return knex("employees")
        .select("*")
}

module.exports = {
    create,
    list
}