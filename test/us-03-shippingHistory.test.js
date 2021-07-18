const request = require("supertest");

const app = require("../src/server/app");
const knex = require("../src/server/db/connections");


describe("shippinghistory Route", () => {
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
    describe("GET /shippinghistory", () => {
        test("returns a shippinghistory list", async () => {
            const response = await request(app)
                .get("/shippinghistory")
                .set("Accept", "application/json");

            expect(response.status).toBe(200);
        })
    })
    describe("POST /shippinghistory", () => {
        test("successfully creates new shippinghistory entry", async () => {
            const response = await request(app)
                .post("/shippinghistory")
                .set("Accept", "application/json")
                .send({data: {
                    shipped_date: "2021-05-15",
                    keg_id: "1234",
                    distributor_id: "2",
                    employee_id: "10001" 
                }})

            expect(response.status).toBe(201)
        })
        test("returns 400 if data is missing", async () => {
            const response = await request(app)
                .post("/shippinghistory")
                .set("Accept", "application/json")
                .send({datas : {}})
            
            expect(response.status).toBe(400)
            expect(response.body.error).toContain("data")
        })
        test("returns 400 if shipped_date is missing", async () => {
            const response = await request(app)
                .post("/shippinghistory")
                .set("Accept", "application/json")
                .send({data: {
                    keg_id: "1234",
                    distributor_id: "2",
                    employee_id: "10001" 
                }})
            
            expect(response.status).toBe(400)
            expect(response.body.error).toContain("shippinghistory_name")
        })
        test("returns 400 if shipped_date is not a date", async () => {
            const response = await request(app)
                .post("/shippinghistory")
                .set("Accept", "application/json")
                .send({data: {
                    shipped_date: "21-05-15",
                    keg_id: "124",
                    distributor_id: "2",
                    employee_id: "10001" 
                }})
            
            expect(response.status).toBe(400)
            expect(response.body.error).toContain("shipped_date")
        })
        test("returns 400 if keg_id is missing", async () => {
            const response = await request(app)
                .post("/shippinghistory")
                .set("Accept", "application/json")
                .send({
                    shipped_date: "2021-05-15",
                    distributor_id: "2",
                    employee_id: "10001" 
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toContain("shippinghistory_size")
        })
        test("returns 400 if distributor_id is missing", async () => {
            const response = await request(app)
                .post("/shippinghistory")
                .set("Accept", "application/json")
                .send({
                    shipped_date: "2021-05-15",
                    keg_id: "124",
                    employee_id: "10001" 
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toContain("distributor_id")                
        })
        test("returns 400 if employee_id is missing", async () => {
            const response = await request(app)
                .post("/shippinghistory")
                .set("Accept", "application/json")
                .send({
                    shipped_date: "2021-05-15",
                    keg_id: "124",
                    distributor_id: "2"
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toContain("employee_id")                
        })
    })
    describe("PUT /shippinghistory/:shippinghistoryId", () => {
        let shippinghistoryOne;
        let shippinghistoryTwo;

        beforeEach(async () => {
            [shippinghistoryOne, shippinghistoryTwo] = await knex("shippinghistory").orderBy("shipping_id")
        });

        test("returns 404 for non-existent shipping_id", async () => {
            const response = await request(app)
                .put("/shippinghistory/5000")
                .set("Accept", "application/json")
                .send({data: {
                    shipped_date: "2021-05-15",
                    keg_id: "1234",
                    distributor_id: "2",
                    employee_id: "10001" 
                }})
            
            expect(response.body.error).toContain("5000")
            expect(response.status).toBe(404);
        })
        
        test("returns 400 for empty shipped_date", async () => {
            expect(shippinghistoryOne).not.toBeUndefined()
            const response = await request(app)
                .put(`/shippinghistory/${shippinghistoryOne.shipping_id}`)
                .set("Accept", "application/json")
                .send({data: {
                    shipped_date: "",
                    keg_id: "1234",
                    distributor_id: "2",
                    employee_id: "10001" 
                }})
        
            expect(response.status).toBe(400)
            expect(response.body.error).toContain("shipped_date")
        })
        test("returns 400 if keg_id is missing", async () => {
            const response = await request(app)
                .put(`/shippinghistory/${shippinghistoryOne.shipping_id}`)
                .set("Accept", "application/json")
                .send({
                    shipped_date: "2021-05-15",
                    keg_id: "1234",
                    distributor_id: "2",
                    employee_id: "10001" 
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toContain("keg_id")                
        })
        test("returns 400 if distributor_id is missing", async () => {
            const response = await request(app)
                .put(`/shippinghistory/${shippinghistoryOne.shipping_id}`)
                .set("Accept", "application/json")
                .send({
                    shipped_date: "2021-05-15",
                    keg_id: "1234",
                    employee_id: "10001" 
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toContain("distributor_id")                
        })
        test("returns 400 if employee_id is missing", async () => {
            const response = await request(app)
                .put(`/shippinghistory/${shippinghistoryOne.shipping_id}`)
                .set("Accept", "application/json")
                .send({
                    shipped_date: "2021-05-15",
                    keg_id: "1234",
                    distributor_id: "2",
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toContain("employee_id")                
        })
        test("returns 404 if keg_id does not exist", async () => {
            const response = await request(app)
            .put(`/shippinghistory/${shippinghistoryOne.shipping_id}`)
                .set("Accept", "application/json")
                .send({
                    shipped_date: "2021-05-15",
                    keg_id: "ten",
                    distributor_id: "2",
                    employee_id: "10001" 
                })

            expect(response.status).toBe(404)
            expect(response.body.error).toContain("keg_id")                
        })
        test("returns 404 if distributor_id does not exist", async () => {
            const response = await request(app)
                .put(`/shippinghistory/${shippinghistoryOne.shipping_id}`)
                .set("Accept", "application/json")
                .send({
                    shipped_date: "2021-05-15",
                    keg_id: "1234",
                    distributor_id: "fourty",
                    employee_id: "10001" 
                })

            expect(response.status).toBe(400)
            expect(response.body.error).toContain("distributor_id")                
        })

        test("returns 200 for successful edit", async () => {
            expect(shippinghistoryOne).not.toBeUndefined()

            const response = await request(app)
                .put(`/shippinghistory/${shippinghistoryOne.shipping_id}`)
                .set("Accept", "application/json")
                .send({data: {
                    shipped_date: "2021-05-15",
                    keg_id: "1234",
                    distributor_id: "2",
                    employee_id: "10001" 
                }})

            expect(response.body.data).toHaveProperty("shipped_date", "2021-05-15")
            expect(response.status).toBe(200);
        })
    })
    describe("DELETE /shippinghistory/:shippinghistoryId", () => {
        let shippinghistoryOne;

        beforeEach(async () => {
            shippinghistoryOne = await knex("shippinghistory")
                .orderBy("shipping_id")
                .first()
        })
        test("returns 404 on non-existent id", async () => {
            expect(shippinghistoryOne).not.toBeUndefined();

            const response = await request(app)
                .delete(`/shippinghistory/99`)
                .set("Accept", "application/json")
        
            expect(response.body.data).toContain("99");
            expect(response.status).toBe(404);
        })
        test("returns 200 on successful delete", async () => {
            expect(shippinghistoryOne).not.toBeUndefined()

            const response = await request(app)
                .delete(`/shippinghistory/${shippinghistoryOne.shipping_id}`)
                .set("Accept", "application/json")
        
            expect(response.body.data).toBeUndefined();
            expect(response.status).toBe(200);
        })
    })
})