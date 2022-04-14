
exports.up = function(knex) {
    return knex.schema.createTable("fillinghistory", (table) => {
        table.increments("filling_id").primary();
        table.date("date_filled");
        table.integer("keg_id")
        table
          .foreign("keg_id")
          .references("keg_id")
          .inTable("kegs")
          .onUpdate("CASCADE")
          .onDelete("SET NULL")
        table.integer("flavor_id")
        table
          .foreign("flavor_id")
          .references("flavor_id")
          .inTable("flavors")
          .onUpdate("CASCADE")
          .onDelete("SET NULL")
        table.timestamps("true, true")
        table.string("employee_email")
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("fillinghistory")
  };
  