import { vi } from "vitest";
import * as fixtures from "./fixtures";

/**
 * Mock `fetch` to return fixture data.
 * Call this in `beforeEach` to install the mock.
 * URLs are matched by the path portion (e.g. "/api/airfield").
 */
export function installMockFetch() {
    const routeMap = new Map<string, unknown>([
        ["/api/", fixtures.WELCOME_MESSAGE],
        ["/api/aircraft", fixtures.AIRCRAFT_RAW],
        ["/api/wake-category", fixtures.WAKE_CATEGORIES_RAW],
        ["/api/controller", fixtures.CONTROLLERS_V2_RAW],
        ["/api/controller-positions-v2", fixtures.CONTROLLERS_V2_RAW],
        ["/api/airfield", fixtures.AIRFIELDS_RAW],
        ["/api/departure/sid-groups", []],
        ["/api/departure/dependency", {}],
        ["/api/flight-rules/dependency", fixtures.FLIGHT_RULES_RAW],
        ["/api/hold", fixtures.HOLDS_RAW],
        ["/api/hold/assigned", []],
        ["/api/hold/proximity", fixtures.PROXIMITY_HOLDS_RAW],
        ["/api/handoffs/dependency", fixtures.HANDOFFS_RAW],
        ["/api/prenotes/dependency", fixtures.PRENOTES_RAW],
        ["/api/regional-pressure", fixtures.REGIONAL_PRESSURE_RAW],
        ["/api/altimeter-setting-region", fixtures.ALTIMETER_REGIONS_RAW],
        ["/api/metar", fixtures.METARS_RAW],
        ["/api/msl", fixtures.MSL_RAW],
        ["/api/msl/airfield", fixtures.MSL_RAW.airfield],
        ["/api/msl/tma", fixtures.MSL_RAW.tma],
        ["/api/srd/route/search", fixtures.SRD_ROUTES_RAW],
        ["/api/navaid/dependency", fixtures.NAVAIDS_RAW],
        ["/api/release/enroute/types", fixtures.RELEASE_TYPES_RAW],
        ["/api/smr-areas", "COORD:N051.33.00.756:W000.25.19.478"],
        ["/api/sid/dependency", fixtures.SIDS_RAW],
        ["/api/stand/dependency", fixtures.STAND_DEP_RAW],
        ["/api/stand/assignment", fixtures.STAND_ASSIGN_RAW],
        ["/api/wake-schemes/dependency", fixtures.WAKE_SCHEMES_RAW],
        ["/api/version/latest", fixtures.LATEST_VERSION_RAW],
    ]);

    return vi.fn((url: string | URL | Request): Promise<Response> => {
        const urlStr = typeof url === "string" ? url : url instanceof URL ? url.href : url.url;
        const parsed = new URL(urlStr);

        let jsonData = routeMap.get(parsed.pathname);

        if (jsonData === undefined) {
            if (parsed.pathname.startsWith("/api/msl/airfield/")) {
                const icao = parsed.pathname.split("/").pop()?.toUpperCase();
                jsonData = fixtures.MSL_RAW.airfield[icao as keyof typeof fixtures.MSL_RAW.airfield] ?? 0;
            } else if (parsed.pathname.startsWith("/api/msl/tma/")) {
                const tma = parsed.pathname.split("/").pop()?.toUpperCase();
                jsonData = fixtures.MSL_RAW.tma[tma as keyof typeof fixtures.MSL_RAW.tma] ?? 0;
            } else if (parsed.pathname.startsWith("/api/stand/assignment/")) {
                jsonData = {
                    callsign: "BAW2067",
                    id: 461,
                    airfield: "EGKK",
                    identifier: "1",
                    assignment_source: "system_auto",
                };
            } else if (parsed.pathname.startsWith("/api/version/")) {
                jsonData = fixtures.LATEST_VERSION_RAW;
            }
        }

        if (jsonData !== undefined) {
            return Promise.resolve(
                new Response(JSON.stringify(jsonData), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }),
            );
        }

        return Promise.resolve(new Response("Not Found", { status: 404 }));
    });
}

/**
 * Create a fully-populated UkcpData by:
 * 1. Installing the mock fetch
 * 2. Creating an UkcpApi
 * 3. Calling UkcpData.create()
 */
export async function createPopulatedData() {
    // Lazy imports to avoid circular issues during test setup
    const { UkcpApi } = await import("../src/api");
    const { UkcpData } = await import("../src/data");

    const api = new UkcpApi({ baseUrl: "http://test/api" });
    return UkcpData.create(api);
}
