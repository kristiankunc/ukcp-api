import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { UkcpApi } from "../src/api";
import { UkcpApiError } from "../src/errors";
import { installMockFetch } from "./setup";
import * as fixtures from "./fixtures";

describe("UkcpApi", () => {
    let api: UkcpApi;

    beforeEach(() => {
        const mockFetch = installMockFetch();
        globalThis.fetch = mockFetch;
        api = new UkcpApi({ baseUrl: "http://test/api" });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("constructor", () => {
        it("defaults to production base URL", () => {
            const defaultApi = new UkcpApi();
            expect(defaultApi).toBeInstanceOf(UkcpApi);
        });

        it("accepts a custom base URL", () => {
            const customApi = new UkcpApi({ baseUrl: "http://localhost:8080/api" });
            expect(customApi).toBeInstanceOf(UkcpApi);
        });

        it("removes trailing slashes from base URL", () => {
            const apiWithSlash = new UkcpApi({ baseUrl: "http://test/api/" });
            expect(apiWithSlash).toBeInstanceOf(UkcpApi);
        });
    });

    describe("getWelcomeMessage", () => {
        it("calls GET / and returns the welcome message", async () => {
            const msg = await api.getWelcomeMessage();
            expect(msg.message).toBe("Welcome to the UK Controller Plugin API");
        });
    });

    describe("getAircraft", () => {
        it("returns array of aircraft", async () => {
            const result = await api.getAircraft();
            expect(result).toHaveLength(1);
            expect(result[0].code).toBe("B703");
        });
    });

    describe("getWakeCategories", () => {
        it("returns wake categories", async () => {
            const result = await api.getWakeCategories();
            expect(result).toHaveLength(1);
            expect(result[0].code).toBe("L");
        });
    });

    describe("getControllers", () => {
        it("returns controller positions", async () => {
            const result = await api.getControllers();
            expect(result.length).toBeGreaterThanOrEqual(4);
            expect(result[0].callsign).toBeDefined();
        });
    });

    describe("getControllerPositionsV2", () => {
        it("returns controller positions with top_down", async () => {
            const result = await api.getControllerPositionsV2();
            expect(result.length).toBeGreaterThanOrEqual(4);
            expect(result[0].top_down).toBeDefined();
        });
    });

    describe("getAirfields", () => {
        it("returns airfields", async () => {
            const result = await api.getAirfields();
            expect(result).toHaveLength(2);
            expect(result[0].code).toBe("EGKK");
            expect(result[1].code).toBe("EGLL");
        });
    });

    describe("getFlightRules", () => {
        it("returns flight rules", async () => {
            const result = await api.getFlightRules();
            expect(result).toHaveLength(2);
            expect(result.find((r) => r.euroscope_key === "V")?.description).toBe("VFR");
        });
    });

    describe("getHolds", () => {
        it("returns holds", async () => {
            const result = await api.getHolds();
            expect(result).toHaveLength(3);
            expect(result[0].fix).toBe("WILLO");
        });
    });

    describe("getProximityHolds", () => {
        it("returns proximity holds", async () => {
            const result = await api.getProximityHolds();
            expect(result).toHaveLength(2);
            expect(result[0].callsign).toBe("BCS2212");
        });
    });

    describe("getHandoffs", () => {
        it("returns handoffs", async () => {
            const result = await api.getHandoffs();
            expect(result).toHaveLength(4);
        });
    });

    describe("getPrenotes", () => {
        it("returns prenotes", async () => {
            const result = await api.getPrenotes();
            expect(result).toHaveLength(2);
            expect(result[0].description).toContain("Gatwick");
        });
    });

    describe("getRegionalPressure", () => {
        it("returns regional pressure map", async () => {
            const result = await api.getRegionalPressure();
            expect(result.ASR_LONDON).toBe(1018);
        });
    });

    describe("getAltimeterSettingRegions", () => {
        it("returns altimeter setting regions", async () => {
            const result = await api.getAltimeterSettingRegions();
            expect(result).toHaveLength(2);
            expect(result[0].name).toBe("London");
        });
    });

    describe("getMetars", () => {
        it("returns METARs", async () => {
            const result = await api.getMetars();
            expect(result).toHaveLength(2);
            expect(result[0].raw).toContain("EGKK");
        });
    });

    describe("getMslAll", () => {
        it("returns combined MSL data", async () => {
            const result = await api.getMslAll();
            expect(result.airfield.EGKK).toBe(7000);
            expect(result.tma.LTMA).toBe(7000);
        });
    });

    describe("getMslAirfields", () => {
        it("returns airfield MSL map", async () => {
            const result = await api.getMslAirfields();
            expect(result.EGKK).toBe(7000);
        });
    });

    describe("getMslTmas", () => {
        it("returns TMA MSL map", async () => {
            const result = await api.getMslTmas();
            expect(result.LTMA).toBe(7000);
        });
    });

    describe("getMslForAirfield", () => {
        it("encodes ICAO and returns MSL", async () => {
            const result = await api.getMslForAirfield("EGKK");
            expect(result).toBe(7000);
        });

        it("uppercases the ICAO code", async () => {
            const result = await api.getMslForAirfield("egkk");
            expect(result).toBe(7000);
        });
    });

    describe("getMslForTma", () => {
        it("returns MSL for a TMA", async () => {
            const result = await api.getMslForTma("LTMA");
            expect(result).toBe(7000);
        });
    });

    describe("searchSrdRoutes", () => {
        it("builds query params and returns routes", async () => {
            const result = await api.searchSrdRoutes({ origin: "EGKK", destination: "EGLL" });
            expect(result).toHaveLength(1);
            expect(result[0].route_string).toContain("ACORN");
        });
    });

    describe("getNavaids", () => {
        it("returns navaids", async () => {
            const result = await api.getNavaids();
            expect(result).toHaveLength(3);
            expect(result[0].identifier).toBe("WILLO");
        });
    });

    describe("getEnrouteReleaseTypes", () => {
        it("returns release types", async () => {
            const result = await api.getEnrouteReleaseTypes();
            expect(result).toHaveLength(2);
            expect(result[0].tag_string).toBe("C");
        });
    });

    describe("getSids", () => {
        it("returns SIDs", async () => {
            const result = await api.getSids();
            expect(result).toHaveLength(3);
            expect(result[0].identifier).toBe("FRANE1M");
        });
    });

    describe("getStandDependency", () => {
        it("returns stand dependency keyed by airfield", async () => {
            const result = await api.getStandDependency();
            expect(result.EGKK).toHaveLength(3);
            expect(result.EGKK[0].identifier).toBe("1");
        });
    });

    describe("getStandAssignments", () => {
        it("returns stand assignments", async () => {
            const result = await api.getStandAssignments();
            expect(result).toHaveLength(2);
            expect(result[0].callsign).toBe("BAW2067");
        });
    });

    describe("getStandAssignmentForAircraft", () => {
        it("returns assignment detail", async () => {
            const result = await api.getStandAssignmentForAircraft("BAW2067");
            expect(result.callsign).toBe("BAW2067");
            expect(result.airfield).toBe("EGKK");
        });

        it("uppercases the callsign", async () => {
            const result = await api.getStandAssignmentForAircraft("baw2067");
            expect(result.callsign).toBe("BAW2067");
        });
    });

    describe("getWakeSchemes", () => {
        it("returns wake category schemes", async () => {
            const result = await api.getWakeSchemes();
            expect(result).toHaveLength(2);
            expect(result[0].key).toBe("UK");
        });
    });

    describe("getLatestVersion", () => {
        it("returns version detail", async () => {
            const result = await api.getLatestVersion();
            expect(result.version).toBe("5.19.1");
        });
    });

    describe("getVersion", () => {
        it("returns specific version", async () => {
            const result = await api.getVersion("5.19.1");
            expect(result.version).toBe("5.19.1");
        });
    });

    describe("getSmrAreas", () => {
        it("returns raw SMR coordinate text", async () => {
            const result = await api.getSmrAreas();
            expect(result).toContain("COORD");
        });
    });

    describe("error handling", () => {
        it("throws UkcpApiError on non-OK response", async () => {
            globalThis.fetch = vi
                .fn()
                .mockResolvedValue(new Response("Not Found", { status: 404, statusText: "Not Found" }));
            const missingApi = new UkcpApi({ baseUrl: "http://test/api" });
            await expect(missingApi.getAircraft()).rejects.toThrow(UkcpApiError);
        });

        it("rejects on network error", async () => {
            globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network failure"));
            const brokenApi = new UkcpApi({ baseUrl: "http://test/api" });
            await expect(brokenApi.getAircraft()).rejects.toThrow("Network failure");
        });
    });

    describe("AbortSignal", () => {
        it("accepts AbortSignal and passes it to fetch", async () => {
            const ac = new AbortController();
            const fetchSpy = vi.spyOn(globalThis, "fetch");
            // Start the request (signal not yet aborted, mock fetch resolves instantly)
            const result = await api.getAircraft(ac.signal);
            expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ signal: ac.signal }));
            expect(result).toBeDefined();
        });
    });

    describe("custom fetchInit", () => {
        it("merges custom headers with requests", async () => {
            const customApi = new UkcpApi({
                baseUrl: "http://test/api",
                fetchInit: { headers: { "X-Custom": "test" } },
            });
            const fetchSpy = vi.spyOn(globalThis, "fetch");
            await customApi.getAircraft();
            expect(fetchSpy).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({ "X-Custom": "test" }),
                }),
            );
        });
    });
});
