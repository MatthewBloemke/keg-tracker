const knex = require("../db/connections")

const list = () => {
    return knex("kegs")
        .select("*")
}

const read = (keg_id) => {
    return knex("kegs")
        .select("*")
        .where({keg_id})
}

const create = (newKeg) => {
    return knex("kegs")
        .insert(newKeg)
        .returning("*")
}

const update = (updatedKeg) => {
    return knex("kegs")
        .select("*")
        .where({keg_name: updatedKeg.keg_name})
        .update(updatedKeg, "*")
        .returning("*")
}

const destroy = (keg_id) => {
    return knex("kegs")
        .where({keg_id})
        .del()
}

module.exports = {
    list,
    read,
    update,
    destroy,
    create
}