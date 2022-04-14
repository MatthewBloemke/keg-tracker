const knex = require("../db/connections")

const list = () => {
    return knex("fillinghistory")
        .select("*")
        .orderBy("date_filled")
}

const read = (filling_id) => {
    return knex("fillinghistory")
        .select("*")
        .where({filling_id})
        .first()
}

const create = (history_entry) => {
    return knex("fillinghistory")
        .insert(history_entry)
        .returning("*")    
}

const update = (updatedHistory) => {
    return knex('fillinghistory')
        .select("*")
        .where({filling_id: updatedHistory.filling_id})
        .update(updatedHistory, "*")
        .returning("*")
}

const destroy = (filling_id) => {
    return knex("fillinghistory")
        .where({filling_id})
        .del()
}


module.exports = {
    list,
    read,
    create,
    update,
    destroy
}