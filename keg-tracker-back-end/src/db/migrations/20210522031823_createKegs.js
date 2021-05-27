
exports.up = function(knex) {
  return knex.schema.createTable("kegs", (table) => {
      table.increments("keg_id").primary(); //unique identifier for each keg
      table.string("keg_name"); // 4 digit number that is printed on each keg
      table.string("keg_size"); // big or small
      table.string("keg_status"); //shipped, returned?
      table.timestamps(true, true)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('kegs');
};
