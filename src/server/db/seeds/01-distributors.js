distributors = require("./01-distributors.json")

exports.seed = function(knex) {
  return knex.raw("TRUNCATE TABLE distributors RESTART IDENTITY CASCADE")
    .then(function () {
      return knex("distributors").insert(distributors)
    });
};
