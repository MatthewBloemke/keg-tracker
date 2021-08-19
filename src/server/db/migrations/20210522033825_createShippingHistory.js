
exports.up = function(knex) {
  return knex.schema.createTable("shippinghistory", (table) => {
      table.increments("shipping_id").primary();
      table.date("date_shipped");
      table.string("keg_name")
      table.string("distributor_name")
      table.timestamps("true, true")
      table.string("employee_email")
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("shippinghistory")
};
