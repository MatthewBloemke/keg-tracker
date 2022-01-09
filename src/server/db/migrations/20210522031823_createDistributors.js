
exports.up = function(knex) {
  return knex.schema.createTable("distributors", (table) => {
      table.increments("distributor_id").primary();
      table.string("distributor_name");
      table.timestamps(true, true)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("distributors");
};
