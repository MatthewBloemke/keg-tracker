
exports.up = function(knex) {
  return knex.schema.createTable("shippinghistory", (table) => {
      table.increments("shipping_id").primary();
      table.date("shipped_date");
      table.integer("keg_id")
      table
        .foreign("keg_id")
        .references("keg_id")
        .inTable("kegs")
      table.integer("distributor_id")
      table
        .foreign("distributor_id")
        .references("distributor_id")
        .inTable("distributors")
        .onDelete("SET NULL")
      table.timestamps("true, true")
      table.string("employee_id")
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("shippinghistory")
};
