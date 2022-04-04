
exports.up = function(knex) {
  return knex.schema.createTable("distributors", (table) => {
      table.increments("distributor_id").primary();
      table.string("distributor_name");
      table.specificType("days_out_arr", "integer ARRAY").defaultTo(null)
      table.timestamps(true, true)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("distributors");
};
