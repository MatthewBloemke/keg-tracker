const knex = require("../db/connections")

function list() {
    return knex("flavors")
        .select("*")
}
function create(newFlavor) {
    return knex("flavors")
        .insert(newFlavor)
        .returning("*")
}
function read(flavor_id) {
    return knex("flavors")
        .select("*")
        .where({flavor_id})
        .first()
}
function readByName(flavor_name) {
    return knex("flavors")
        .select("*")
        .where({flavor_name})
        .first();
}
function update(updatedFlavor) {
    return knex("flavors")
        .select("*")
        .where({flavor_id: updatedFlavor.flavor_id})
        .update(updatedFlavor, "*")
        .returning("*")
}

function destroy(flavor_id) {
    return knex("flavors")
        .where({flavor_id})
        .del()
}

module.exports = {
    list,
    read,
    update,
    destroy,
    create,
    readByName
}