
exports.up = function(knex) {
  return knex.schema.createTable("employees", table => {
    table.increments("employee_id")
    table.string("employee_name")
    table.string("employee_email")
    table.string("password")
    table.boolean("admin").defaultTo(false)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("employees")
};
