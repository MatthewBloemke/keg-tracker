let kegs = require("./01-kegs.json")

exports.seed = function(knex) {
  return knex.raw("TRUNCATE TABLE kegs RESTART IDENTITY CASCADE")
    .then(function () {
      return knex("kegs").insert(kegs)
    });
};
