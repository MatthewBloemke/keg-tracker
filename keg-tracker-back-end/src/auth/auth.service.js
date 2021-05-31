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

const readByEmail = (employee_email) => {
    return knex("employees")
        .select("*")
        .where({employee_email})
}

module.exports = {
    create,
    list,
    readByEmail
}