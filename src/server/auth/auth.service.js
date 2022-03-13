const knex = require("../db/connections")

const read = (employeeId) => {
    return knex("employees")
        .select("*")
        .where({employee_id: employeeId})
        .first()
}

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

const update = (updatedAccount) => {
    return knex("employees")
        .select("*")
        .where({employee_id: updatedAccount.employee_id})
        .update(updatedAccount, "*")
        .returning("*")
}

const destroy = (employee_id) => {
    return knex("employees")
        .where({employee_id})
        .del()
}

module.exports = {
    create,
    list,
    readByEmail,
    update,
    destroy,
    read
}