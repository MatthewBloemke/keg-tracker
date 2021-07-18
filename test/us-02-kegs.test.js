const request = require("supertest");

const app = require("../src/server/app");
const knex = require("../src/server/db/connections");


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

    describe("App", () => {
        describe("not found handler", () => {
            test("returns 404 for non-existent route", async () => {
                const response = await request(app)
                    .get("/wrongPath")
                    .set("Accept", "application/json");

                expect(response.status).toBe(404);
                expect(response.body.error).toBe("Path not found: /wrongPath")
            })
        })
    })
    describe("GET /kegs", () => {
        test("returns a list of kegs", async () => {
            const response = await request(app)
                .get("/kegs")
                .set("Accept", "application/json");

            expect(response.status).toBe(200);
        })
    })
    describe("POST /kegs", () => {
        test("successfully creates new Keg", async () => {
            const response = await request(app)
                .post("/kegs")
                .set("Accept", "application/json")
                .send({data: {
                    keg_name: "1234",
                    keg_size: "small",
                    keg_status: "shipped",
                    date_shipped: "2021-05-15"
                }})

            expect(response.status).toBe(201)
        })
        test("returns 400 if data is missing", async () => {
            const response = await request(app)
                .post("/kegs")
                .set("Accept", "application/json")
                .send({datas : {}})
            
            expect(response.status).toBe(400)
            expect(response.body.error).toContain("data")
        })
        test("returns 400 if keg_name is missing", async () => {
            const response = await request(app)
                .post("/kegs")
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
                .post("/kegs")
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
                .post("/kegs")
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
                .post("/kegs")
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
    describe("PUT /kegs/:kegId", () => {
        let kegOne;
        let kegTwo;

        beforeEach(async () => {
            [kegOne, kegTwo] = await knex("kegs").orderBy("keg_id")
        });

        test("returns 404 for non-existent keg_id", async () => {
            const response = await request(app)
                .put("/kegs/5000")
                .set("Accept", "application/json")
                .send({data: {keg_name: "1234"}})
            
            expect(response.body.error).toContain("5000")
            expect(response.status).toBe(404);
        })
        
        test("returns 400 for empty keg_name", async () => {
            expect(kegOne).not.toBeUndefined()
            const response = await request(app)
                .put(`/keg/${kegOne.keg_id}`)
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

            const response = await request(app)
                .put(`/kegs/${kegOne.keg_id}`)
                .set("Accept", "application/json")
                .send({data: {keg_name: "Company XYZ"}})

            expect(response.body.data).toHaveProperty("keg_name", "1234")
            expect(response.status).toBe(200);
        })
    })
    describe("DELETE /kegs/:kegId", () => {
        let kegOne;

        beforeEach(async () => {
            kegOne = await knex("kegs")
                .orderBy("keg_id")
                .first()
        })
        test("returns 404 on non-existent id", async () => {
            expect(kegOne).not.toBeUndefined()

            const response = await request(app)
                .delete(`/kegs/99`)
                .set("Accept", "application/json")
        
            expect(response.body.data).toContain("99");
            expect(response.status).toBe(404);
        })
        test("returns 200 on successful delete", async () => {
            expect(kegOne).not.toBeUndefined()

            const response = await request(app)
                .delete(`/kegs/${kegOne.keg_id}`)
                .set("Accept", "application/json")
        
            expect(response.body.data).toBeUndefined();
            expect(response.status).toBe(200);
        })
    })
})