
exports.up = function(knex) {
  return knex.schema.createTable("shippinghistory", (table) => {
      table.increments("shipping_id").primary();
      table.date("date_shipped");
      table.integer("keg_id")
      table
        .foreign("keg_id")
        .references("keg_id")
        .inTable("kegs")
        .onUpdate("CASCADE")
        .onDelete("SET NULL")
      table.integer("distributor_id")
      table
        .foreign("distributor_id")
        .references("distributor_id")
        .inTable("distributors")
        .onUpdate("CASCADE")
        .onDelete("SET NULL")
      table.timestamps("true, true")
      table.string("employee_email")
      table.string("keg_status")
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("shippinghistory")
};
