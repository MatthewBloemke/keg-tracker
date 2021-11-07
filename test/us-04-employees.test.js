const request = require("supertest");

const app = require("../src/server/app");
const knex = require("../src/server/db/connections");
const {generateAuthToken} = require("./helper");

import "regenerator-runtime/runtime";

describe("employees Route", () => {
    beforeAll(() => {
        return knex.migrate
            .forceFreeMigrationsLock()
            .then(() => knex.migrate.rollback(null, true))
            .then(() => knex.migrate.latest());
    });

    beforeEach(() => {
        return knex.seed.run();
    })

    afterAll(async () => {
        return await knex.migrate.rollback(null, true).then(() => knex.destroy());
    })

    describe("Employee Login", () => {
        describe("POST /api/login", () => {
            test("Should return working for succesful login", async () => {
                const response = await request(app)
                    .post("/api/login")
                    .set("Accept", "application/json")
                    .send({data: {
                        employee_email: "admin",
                        password: "admin"
                    }})

                expect(response.body.data).toContain("working")
            })
        })
    })
})