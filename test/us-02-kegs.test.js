const request = require("supertest");

const app = require("../src/server/app");
const knex = require("../src/server/db/connections");

require("dotenv").config();
import "regenerator-runtime/runtime";


describe("Kegs Route", () => {
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

    describe("Login", () => {
        test("returns working for login", async () => {
            const response = await request(app)
                .post("/api/login")
                .set("Accept", "application/json")
                .send({data: {employee_email: "admin", password: "admin"}})
            expect(response.body.data).toContain("working")            
        })
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
    describe("GET /api/kegs", () => {
        test("returns a list of kegs", async () => {
            const response = await request(app)
                .get("/api/kegs")
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json");

            expect(response.status).toBe(200);
        })
    })
    describe("POST /api/kegs", () => {
        test("successfully creates new returned Keg", async () => {
            const response = await request(app)
                .post("/api/kegs")
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({data: {
                    keg_name: "1234",
                    keg_size: "small",
                    keg_status: "returned",
                }})

            expect(response.status).toBe(201)
        })
        test("returns 400 if data is missing", async () => {
            const response = await request(app)
                .post("/api/kegs")
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({datas : {}})
            
            expect(response.status).toBe(400)
            expect(response.body.error).toContain("data")
        })
        test("returns 400 if keg_name is missing", async () => {
            const response = await request(app)
                .post("/api/kegs")
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({data: {
                    keg_size: "small",
                    keg_status: "shipped",
                    date_shipped: "2021-05-15"
                }})
            
            expect(response.status).toBe(400)
            expect(response.body.error).toContain("keg_name")
        })
        test("returns 400 if keg_name is not 4 digits", async () => {
            const response = await request(app)
                .post("/api/kegs")
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({
                    keg_name: "123",
                    keg_size: "small",
                    keg_status: "shipped",
                    date_shipped: "2021-05-15"
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toContain("keg_name")
        })
        test("returns 400 if keg_size is missing", async () => {
            const response = await request(app)
                .post("/api/kegs")
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({
                    keg_name: "123",
                    keg_status: "shipped",
                    date_shipped: "2021-05-15"
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toContain("keg_size")
        })
        test("returns 400 if keg_status is missing", async () => {
            const response = await request(app)
                .post("/api/kegs")
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({
                    keg_name: "123",
                    keg_size: "small",
                    date_shipped: "2021-05-15"
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toContain("keg_status")                
        })
    })
    describe("PUT /api/kegs/:kegId", () => {
        let kegOne;
        let kegTwo;

        beforeEach(async () => {
            [kegOne, kegTwo] = await knex("kegs").orderBy("keg_id")
        });

        test("returns 404 for non-existent keg_id", async () => {
            const response = await request(app)
                .put("/api/kegs/5000")
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({data: {keg_name: "1234"}})
            
            expect(response.body.error).toContain("5000")
            expect(response.status).toBe(404);
        })
        
        test("returns 400 for empty keg_name", async () => {
            expect(kegOne).not.toBeUndefined()
            const response = await request(app)
                .put(`/keg/${kegOne.keg_id}`)
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({data: {
                    keg_name: "",
                    keg_size: "small",
                    keg_status: "shipped",
                    date_shipped: "2021-05-22"
                }})
        
            expect(response.status).toBe(400)
            expect(response.body.error).toContain("keg_name")
        })
        test("returns 400 if keg_status is missing", async () => {
            const response = await request(app)
                .put(`/keg/${kegOne.keg_id}`)
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({
                    keg_name: "1234",
                    keg_size: "small",
                    date_shipped: "2021-05-15"
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toContain("keg_status")                
        })
        test("returns 400 if keg_size is missing", async () => {
            const response = await request(app)
                .put(`/keg/${kegOne.keg_id}`)
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({
                    keg_name: "1234",
                    keg_status: "shipped",
                    date_shipped: "2021-05-15"
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toContain("keg_size")                
        })
        test("returns 400 if date_shipped is missing", async () => {
            const response = await request(app)
                .put(`/keg/${kegOne.keg_id}`)
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({
                    keg_name: "1234",
                    keg_status: "shipped",
                    keg_size: "small",
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toContain("keg_status")                
        })
        test("returns 200 for successful edit", async () => {
            expect(kegOne).not.toBeUndefined()
            console.log(kegOne.keg_name)
            const response = await request(app)
                .put(`/api/kegs/${kegOne.keg_name}`)
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
                .send({data: {keg_name: "1234"}})

            expect(response.body.data).toHaveProperty("keg_name", "1234")
            expect(response.status).toBe(200);
        })
    })
    describe("DELETE /api/kegs/:kegId", () => {
        let kegOne;

        beforeEach(async () => {
            kegOne = await knex("kegs")
                .orderBy("keg_id")
                .first()
        })
        test("returns 404 on non-existent id", async () => {
            expect(kegOne).not.toBeUndefined()

            const response = await request(app)
                .delete(`/api/kegs/99`)
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
        
            expect(response.body.error).toContain("99");
            expect(response.status).toBe(404);
        })
        test("returns 200 on successful delete", async () => {
            expect(kegOne).not.toBeUndefined()
            const response = await request(app)
                .delete(`/api/kegs/${kegOne.keg_name}`)
                .set("Cookie", `token=${process.env.TOKEN}`)
                .set("Accept", "application/json")
        
            expect(response.body.data).toBeUndefined();
            expect(response.status).toBe(200);
        })
    })
})