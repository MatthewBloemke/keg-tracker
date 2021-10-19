
exports.up = function(knex) {
    return knex.schema.table("kegs", (table) => {
        table.string("date_shipped").defaultTo(null)
    })
};

exports.down = function(knex) {
    return knex.schema.table("kegs", (table) => {
        table.dropColumn("date_shipped")
    })    
};
