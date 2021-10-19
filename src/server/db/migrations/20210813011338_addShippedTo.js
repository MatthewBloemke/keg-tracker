
exports.up = function(knex) {
    return knex.schema.table("kegs", (table) => {
        table.string("shipped_to").defaultTo(null)
    })
};

exports.down = function(knex) {
    return knex.schema.table("kegs", (table) => {
        table.dropColumn("shipped_to")
    })    
};
