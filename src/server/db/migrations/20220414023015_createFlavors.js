exports.up = function(knex) {
    return knex.schema.createTable("flavors", table => {
      table.increments("flavor_id")
      table.string("flavor_name")
      table.integer("kegs_filled")
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("flavors")
  };
  