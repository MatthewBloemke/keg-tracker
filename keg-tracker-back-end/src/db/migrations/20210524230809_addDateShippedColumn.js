
exports.up = function(knex) {
    return knex.schema.table("kegs", (table) => {
        table.string("date_shipped").defaultTo("N/A")
    })
};

exports.down = function(knex) {
    return knex.schema.table("kegs", (table) => {
        table.dropColumn("date_shipped")
    })    
};
