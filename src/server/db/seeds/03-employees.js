let employees = require("./03-employees.json")

exports.seed = function(knex) {
  return knex.raw("TRUNCATE TABLE employees RESTART IDENTITY CASCADE")
    .then(function () {
      return knex("employees").insert(employees)
    })
};
