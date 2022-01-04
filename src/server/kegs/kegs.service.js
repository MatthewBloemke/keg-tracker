const knex = require("../db/connections")

const list = () => {
    return knex("kegs")
        .select("*")
}

const read = (keg_id) => {
    return knex("kegs")
        .select("*")
        .where({keg_id})
        .first()
}

const create = (newKeg) => {
    return knex("kegs")
        .insert(newKeg)
        .returning("*")
}

const update = (updatedKeg) => {
    return knex("kegs")
        .select("*")
        .where({keg_id: updatedKeg.keg_id})
        .update(updatedKeg, "*")
        .returning("*")
}

const destroy = (keg_id) => {
    return knex("kegs")
        .where({keg_id})
        .del()
}
const readByName = (keg_name) => {
    return knex('kegs')
        .select("*")
        .where({keg_name})
        .first()
}

module.exports = {
    list,
    read,
    update,
    destroy,
    create,
    readByName
}