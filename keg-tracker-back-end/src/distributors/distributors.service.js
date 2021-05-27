const knex = require("../db/connections")

function list() {
    return knex("distributors")
        .select("*")
}
function create(newDistributor) {
    return knex("distributors")
        .insert(newDistributor)
        .returning("*")
}
function read(distributor_id) {
    return knex("distributors")
        .select("*")
        .where({distributor_id})
        .first()
}
function update(updatedDistributor) {
    return knex("distributors")
        .select("*")
        .where({distributor_id: updatedDistributor.distributor_id})
        .update(updatedDistributor, "*")
        .returning("*")
}

function destroy(distributor_id) {
    return knex("distributors")
        .where({distributor_id})
        .del()
}

module.exports = {
    list,
    read,
    update,
    destroy,
    create
}