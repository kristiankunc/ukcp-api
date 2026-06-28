import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { installMockFetch, createPopulatedData } from "./setup";
import {
    Airfield,
    ControllerPosition,
    Hold,
    Navaid,
    Handoff,
    Prenote,
    Metar,
    Sid,
    Stand,
    StandAssignment,
    ProximityHold,
    WakeCategoryScheme,
} from "../src/models";

describe("UkcpData", () => {
    beforeEach(() => {
        globalThis.fetch = installMockFetch();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("create()", () => {
        it("fetches all collections and returns a populated UkcpData", async () => {
            const data = await createPopulatedData();
            expect(data).toBeDefined();
            expect(data.allAirfields.length).toBeGreaterThanOrEqual(2);
            expect(data.allControllers.length).toBeGreaterThanOrEqual(4);
            expect(data.allHolds.length).toBeGreaterThanOrEqual(3);
            expect(data.allNavaids.length).toBeGreaterThanOrEqual(3);
            expect(data.allHandoffs.length).toBeGreaterThanOrEqual(3);
            expect(data.allPrenotes.length).toBeGreaterThanOrEqual(2);
            expect(data.allSids.length).toBeGreaterThanOrEqual(3);
            expect(data.allMetars.length).toBeGreaterThanOrEqual(2);
        });

        it("registers value objects", async () => {
            const data = await createPopulatedData();
            expect(data.flightRules.length).toBe(2);
            expect(data.regionalPressure).not.toBeNull();
            expect(data.altimeterSettingRegions.length).toBe(2);
            expect(data.enrouteReleaseTypes.length).toBe(2);
            expect(data.wakeCategories.length).toBe(1);
        });
    });

    describe("getAirfieldByCode", () => {
        it("returns Airfield domain object", async () => {
            const data = await createPopulatedData();
            const af = data.getAirfieldByCode("EGKK");
            expect(af).toBeInstanceOf(Airfield);
            expect(af?.code).toBe("EGKK");
        });

        it("is case-insensitive", async () => {
            const data = await createPopulatedData();
            expect(data.getAirfieldByCode("egkk")).toBeInstanceOf(Airfield);
        });

        it("returns undefined for unknown code", async () => {
            const data = await createPopulatedData();
            expect(data.getAirfieldByCode("XXXX")).toBeUndefined();
        });
    });

    describe("getAirfieldById", () => {
        it("returns Airfield by numeric ID", async () => {
            const data = await createPopulatedData();
            expect(data.getAirfieldById(1)?.code).toBe("EGKK");
        });

        it("returns undefined for unknown ID", async () => {
            const data = await createPopulatedData();
            expect(data.getAirfieldById(999)).toBeUndefined();
        });
    });

    describe("getControllerById", () => {
        it("returns ControllerPosition", async () => {
            const data = await createPopulatedData();
            const c = data.getControllerById(75);
            expect(c).toBeInstanceOf(ControllerPosition);
            expect(c?.callsign).toBe("EGKK_F_APP");
        });

        it("returns undefined for unknown ID", async () => {
            const data = await createPopulatedData();
            expect(data.getControllerById(999)).toBeUndefined();
        });
    });

    describe("getHoldById", () => {
        it("returns Hold", async () => {
            const data = await createPopulatedData();
            expect(data.getHoldById(1)?.fix).toBe("WILLO");
        });

        it("returns undefined for unknown ID", async () => {
            const data = await createPopulatedData();
            expect(data.getHoldById(999)).toBeUndefined();
        });
    });

    describe("getNavaidById", () => {
        it("returns Navaid", async () => {
            const data = await createPopulatedData();
            expect(data.getNavaidById(1)?.identifier).toBe("WILLO");
        });
    });

    describe("getHandoffById", () => {
        it("returns Handoff", async () => {
            const data = await createPopulatedData();
            expect(data.getHandoffById(65)?.id).toBe(65);
        });
    });

    describe("getPrenoteById", () => {
        it("returns Prenote", async () => {
            const data = await createPopulatedData();
            expect(data.getPrenoteById(1)?.description).toContain("Gatwick");
        });
    });

    describe("getWakeSchemeById", () => {
        it("returns WakeCategoryScheme", async () => {
            const data = await createPopulatedData();
            expect(data.getWakeSchemeById(1)?.key).toBe("UK");
        });
    });

    describe("getStandById", () => {
        it("returns Stand across all airfields", async () => {
            const data = await createPopulatedData();
            const stand = data.getStandById(461);
            expect(stand).toBeInstanceOf(Stand);
            expect(stand?.identifier).toBe("1");
            expect(stand?.airfieldCode).toBe("EGKK");
        });

        it("returns undefined for unknown ID", async () => {
            const data = await createPopulatedData();
            expect(data.getStandById(9999)).toBeUndefined();
        });
    });

    describe("getStandsForAirfield", () => {
        it("returns Stand[] for valid airfield", async () => {
            const data = await createPopulatedData();
            const stands = data.getStandsForAirfield("EGKK");
            expect(stands).toHaveLength(3);
            expect(stands[0]).toBeInstanceOf(Stand);
        });

        it("is case-insensitive", async () => {
            const data = await createPopulatedData();
            expect(data.getStandsForAirfield("egkk")).toHaveLength(3);
        });

        it("returns [] for unknown airfield", async () => {
            const data = await createPopulatedData();
            expect(data.getStandsForAirfield("XXXX")).toEqual([]);
        });
    });

    describe("caching", () => {
        it("returns the same Airfield instance on repeated lookups", async () => {
            const data = await createPopulatedData();
            const a = data.getAirfieldByCode("EGKK");
            const b = data.getAirfieldByCode("EGKK");
            expect(a).toBe(b); // Same reference
        });

        it("returns the same ControllerPosition instance on repeated lookups", async () => {
            const data = await createPopulatedData();
            const a = data.getControllerById(75);
            const b = data.getControllerById(75);
            expect(a).toBe(b);
        });

        it("returns the same Hold instance on repeated lookups", async () => {
            const data = await createPopulatedData();
            const a = data.getHoldById(1);
            const b = data.getHoldById(1);
            expect(a).toBe(b);
        });

        it("allAirfields returns cached array on second access", async () => {
            const data = await createPopulatedData();
            const a = data.allAirfields;
            const b = data.allAirfields;
            expect(a).toBe(b);
        });
    });

    describe("getMslForAirfield", () => {
        it("returns MSL value", async () => {
            const data = await createPopulatedData();
            expect(data.getMslForAirfield("EGKK")).toBe(7000);
        });

        it("returns undefined for unknown airfield", async () => {
            const data = await createPopulatedData();
            expect(data.getMslForAirfield("XXXX")).toBeUndefined();
        });
    });

    describe("getMslForTma", () => {
        it("returns TMA MSL value", async () => {
            const data = await createPopulatedData();
            expect(data.getMslForTma("LTMA")).toBe(7000);
        });
    });

    describe("searchSrdRoutes", () => {
        it("delegates to api and returns SrdRoute[]", async () => {
            const data = await createPopulatedData();
            const routes = await data.searchSrdRoutes({ origin: "EGKK" });
            expect(routes).toHaveLength(1);
            expect(routes[0].routeString).toContain("ACORN");
        });
    });

    describe("getLatestVersion", () => {
        it("delegates to api and returns VersionDetail", async () => {
            const data = await createPopulatedData();
            const v = await data.getLatestVersion();
            expect(v.version).toBe("5.19.1");
        });
    });

    describe("getVersion", () => {
        it("delegates to api and returns VersionDetail", async () => {
            const data = await createPopulatedData();
            const v = await data.getVersion("5.19.1");
            expect(v.version).toBe("5.19.1");
        });
    });

    describe("api", () => {
        it("exposes the underlying UkcpApi", async () => {
            const data = await createPopulatedData();
            expect(data.api).toBeDefined();
        });
    });
});
