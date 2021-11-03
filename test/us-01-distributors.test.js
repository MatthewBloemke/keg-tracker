const request = require("supertest");

const app = require("../src/server/app");
const knex = require("../src/server/db/connections");

require('dotenv').config()

import "regenerator-runtime/runtime";

describe("Distributors Route", () => {
    beforeAll(() => {
        return knex.migrate
            .forceFreeMigrationsLock()
            .then(() => knex.migrate.rollback(null, true))
            .then(() => knex.migrate.latest());
    });

    beforeEach(() => {
        return knex.seed.run();
    });

    afterAll(async () => {
        return await knex.migrate.rollback(null, true).then(() => knex.destroy());
    })
    
    describe("App", () => {
        describe("not found handler", () => {
            test("returns 404 for non-existent route", async () => {
                const response = await request(app)
                    .get("/api/wrongPath")
                    .set("Cookie", `token=${process.env.TOKEN}`)
                    .set("Accept", "application/json");

                expect(response.status).toBe(404);
                expect(response.body.error).toBe("Path not found: /api/wrongPath")
            })
        })
    })
    describe("GET /api/distributors", () => {
        test("returns a list of distributors", async () => {
            const response = await request(app)
                .get("/api/distributors")
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json");

            expect(response.status).toBe(200);
        })
    })
    describe("POST /api/distributors", () => {
        test("successfully creates new Distributor", async () => {
            const response = await request(app)
                .post("/api/distributors")
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({data: {distributor_name: "Company Z"}})

            expect(response.status).toBe(201)
        })
        test("returns 400 if data is missing", async () => {
            const response = await request(app)
                .post("/api/distributors")
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({datas : {}})
            
            expect(response.status).toBe(400)
            expect(response.body.error).toContain("data")
        })
        test("returns 400 if distributor_name is missing", async () => {
            const response = await request(app)
                .post("/api/distributors")
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({data: {}})
            
            expect(response.status).toBe(400)
            expect(response.body.error).toContain("distributor_name")
        })
    })
    describe("PUT /api/distributors/:distributorId", () => {
        let distributorOne;
        let distributorTwo;

        beforeEach(async () => {
            [distributorOne, distributorTwo] = await knex("distributors").orderBy("distributor_id")
        });

        test("returns 404 for non-existent distributor_id", async () => {
            const response = await request(app)
                .put("/api/distributors/5000")
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({data: {distributor_name: "Company ABC"}})
            
            expect(response.body.error).toContain("5000")
            expect(response.status).toBe(404);
        })
        
        test("returns 400 for empty distributor_name", async () => {
            expect(distributorOne).not.toBeUndefined()
            const response = await request(app)
                .put(`/api/distributors/${distributorOne.distributor_id}`)
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({data: {distributor_name: ""}})
        
            expect(response.status).toBe(400)
            expect(response.body.error).toContain("distributor_name")
        })
        test("returns 200 for successful edit", async () => {
            expect(distributorOne).not.toBeUndefined()

            const response = await request(app)
                .put(`/api/distributors/${distributorOne.distributor_id}`)
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({data: {distributor_name: "Company XYZ"}})

            expect(response.body.error).toBeUndefined();
            expect(response.status).toBe(200);
        })
    })
    describe("DELETE /api/distributors/:distributorId", () => {
        let distributorOne;

        beforeEach(async () => {
            distributorOne = await knex("distributors")
                .orderBy("distributor_id")
                .first()
        })
        test("returns 404 on non-existent id", async () => {

            const response = await request(app)
                .delete(`/api/distributors/9900`)
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
        
            expect(response.body.error).toContain("9900");
            expect(response.status).toBe(404);
        })
        test("returns 200 on successful delete", async () => {
            expect(distributorOne).not.toBeUndefined()

            const response = await request(app)
                .delete(`/api/distributors/${distributorOne.distributor_id}`)
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
        
            expect(response.body.data).toBeUndefined();
            expect(response.status).toBe(200);
        })
    })
    describe("GET /api/distributors/:distributorId", () => {
        let distributorOne;

        beforeEach(async () => {
            distributorOne = await knex("distributors")
                .orderBy("distributor_id")
                .first()
        })
        test('returns 404 on non-existent id', async () => {
            const response = await request(app)
                .get("/api/distributors/15000")
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set('Accept', "application/json")

            expect(response.body.error).toContain('15000')
            expect(response.status).toBe(404)
        })
        test("returns 200 on successful GET", async () => {
            expect(distributorOne).not.toBeUndefined()
            
            const response = await request(app)
                .get(`/api/distributors/${distributorOne.distributor_id}`)
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set('Accept', "application/json")

            expect(response.status).toBe(200)
        })
    })
})