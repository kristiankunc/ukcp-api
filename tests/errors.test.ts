import { describe, it, expect } from "vitest";
import { UkcpApiError, UkcpNotFoundError } from "../src/errors";

describe("UkcpApiError", () => {
    it("stores status, statusText, and url", () => {
        const err = new UkcpApiError("Boom", 500, "Internal Server Error", "/api/test");
        expect(err.message).toBe("Boom");
        expect(err.status).toBe(500);
        expect(err.statusText).toBe("Internal Server Error");
        expect(err.url).toBe("/api/test");
        expect(err.name).toBe("UkcpApiError");
    });

    it("is an instance of Error", () => {
        const err = new UkcpApiError("X", 400, "Bad Request", "/api/x");
        expect(err).toBeInstanceOf(Error);
    });
});

describe("UkcpNotFoundError", () => {
    it("sets 404 status", () => {
        const err = new UkcpNotFoundError("/api/missing");
        expect(err.status).toBe(404);
        expect(err.statusText).toBe("Not Found");
        expect(err.message).toBe("Resource not found");
        expect(err.name).toBe("UkcpNotFoundError");
    });

    it("is an instance of UkcpApiError", () => {
        const err = new UkcpNotFoundError("/api/x");
        expect(err).toBeInstanceOf(UkcpApiError);
        expect(err).toBeInstanceOf(Error);
    });
});
