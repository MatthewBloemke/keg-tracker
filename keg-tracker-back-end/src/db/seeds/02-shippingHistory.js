shippingHistory = require("./02-shippingHistory.json")

exports.seed = function(knex) {
  return knex.raw("TRUNCATE TABLE shippinghistory RESTART IDENTITY CASCADE")
    .then(function () {
      return knex("shippinghistory").insert(shippingHistory);
    });
};
