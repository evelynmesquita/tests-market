import supertest from "supertest";
import app from "../src/app";

const api = supertest(app);

describe("/POST fruits", () => {
    it("Should return 201 when inserting a fruit", async () => {
        const body = { name: "Banana", price: 500 };
        const { status } = await api.post("/fruits").send(body);
        await api.post("/fruits").send({ name: "Maçã", price: 600 });
        expect(status).toBe(201);
    });
    it("Should return 422 when inserting a fruit with data missing", async () => {
        const { status } = await api.post("/fruits");
        expect(status).toBe(422);
    });
    it("Should return 409 when inserting a fruit that is already registered", async () => {
        const body = { name: "Banana", price: 500 };
        const { status } = await api.post("/fruits").send(body);
        expect(status).toBe(409);
    });
});

describe("/GET fruits", () => {
    it("Should return all fruits", async () => {
        const { status, body } = await api.get("/fruits");
        expect(status).toBe(200);
        expect(body).toHaveLength(2);
        expect(body).toEqual([
            { id: 1, name: "Banana", price: 500 },
            { id: 2, name: "Maçã", price: 600 },
        ]);
    });

    it("Should return a fruit given an id", async () => {
        const { status, body } = await api.get("/fruits/1");
        expect(status).toBe(200);
        expect(body).toEqual({ id: 1, name: "Banana", price: 500 });
    });

    it("Should return 404 when trying to get a fruit that doesn't exists", async () => {
        const { status } = await api.get("/fruits/9999999");
        expect(status).toBe(404);
    });

    it("Should return 400 when id param is not valid", async () => {
        const { status } = await api.get("/fruits/banana");
        expect(status).toBe(400);
    });
});