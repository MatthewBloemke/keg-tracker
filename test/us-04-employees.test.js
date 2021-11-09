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

    describe("Employee Router", () => {
        describe("POST /api/login", () => {
            test("Should return working for successful login", async () => {
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
        describe("POST /api/employees", () => {
            test("Should return 201 for created employee", async () => {
                const response = await request(app)
                    .post("/api/employees")
                    .set("Cookie", `token=${generateAuthToken()}`)
                    .set("Accept", "application/json")
                    .send({data: {
                        employee_name: "test",
                        employee_email: "test",
                        password: "test"
                    }})
            })
        })
    })
})