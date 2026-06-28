import type {
    WelcomeMessage,
    AircraftRaw,
    WakeCategoryRaw,
    ControllerPositionRaw,
    ControllerPositionV2Raw,
    AirfieldRaw,
    SidDepartureIntervalGroupRaw,
    FlightRuleRaw,
    HoldRaw,
    ProximityHoldRaw,
    HandoffRaw,
    PrenoteRaw,
    RegionalPressureRaw,
    AltimeterSettingRegionRaw,
    MetarRaw,
    MslAllRaw,
    SrdRouteRaw,
    SrdRouteSearchParams,
    NavaidRaw,
    EnrouteReleaseTypeRaw,
    SmrAreasRaw,
    SidRaw,
    StandDependencyRaw,
    StandAssignmentRaw,
    StandAssignmentDetailRaw,
    WakeCategorySchemeRaw,
    VersionDetailRaw,
} from "./types";
import { UkcpApiError } from "./errors";

/**
 * Options for configuring the UkcpApi HTTP client.
 */
export interface UkcpApiOptions {
    /** Base URL for the UKCP API (default: https://ukcp.vatsim.uk/api) */
    baseUrl?: string;
    /** Additional fetch options applied to every request */
    fetchInit?: RequestInit;
}

/**
 * Low-level HTTP client for the VATSIM UK Controller Plugin API.
 *
 * All methods return raw JSON response types. For a higher-level interface
 * with domain objects and relationship navigation, use `UkcpData`.
 *
 * @see UkcpData
 */
export class UkcpApi {
    private readonly baseUrl: string;
    private readonly fetchInit: RequestInit;

    constructor(options: UkcpApiOptions = {}) {
        this.baseUrl = (options.baseUrl ?? "https://ukcp.vatsim.uk/api").replace(/\/+$/, "");
        this.fetchInit = options.fetchInit ?? {};
    }

    private async request<T>(path: string, init?: RequestInit): Promise<T> {
        const url = `${this.baseUrl}${path}`;
        const response = await fetch(url, {
            ...this.fetchInit,
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...this.fetchInit.headers,
                ...init?.headers,
            },
        });

        if (!response.ok) {
            throw new UkcpApiError(
                `API request failed: ${response.status} ${response.statusText}`,
                response.status,
                response.statusText,
                url,
            );
        }

        return response.json() as Promise<T>;
    }

    async getWelcomeMessage(signal?: AbortSignal): Promise<WelcomeMessage> {
        return this.request<WelcomeMessage>("/", { signal });
    }

    async getAircraft(signal?: AbortSignal): Promise<AircraftRaw[]> {
        return this.request<AircraftRaw[]>("/aircraft", { signal });
    }

    async getWakeCategories(signal?: AbortSignal): Promise<WakeCategoryRaw[]> {
        return this.request<WakeCategoryRaw[]>("/wake-category", { signal });
    }

    async getControllers(signal?: AbortSignal): Promise<ControllerPositionRaw[]> {
        return this.request<ControllerPositionRaw[]>("/controller", { signal });
    }

    async getControllerPositionsV2(signal?: AbortSignal): Promise<ControllerPositionV2Raw[]> {
        return this.request<ControllerPositionV2Raw[]>("/controller-positions-v2", { signal });
    }

    async getAirfields(signal?: AbortSignal): Promise<AirfieldRaw[]> {
        return this.request<AirfieldRaw[]>("/airfield", { signal });
    }

    async getDepartureSidGroups(signal?: AbortSignal): Promise<SidDepartureIntervalGroupRaw[]> {
        return this.request<SidDepartureIntervalGroupRaw[]>("/departure/sid-groups", { signal });
    }

    async getDepartureDependency(signal?: AbortSignal): Promise<unknown> {
        return this.request<unknown>("/departure/dependency", { signal });
    }

    async getFlightRules(signal?: AbortSignal): Promise<FlightRuleRaw[]> {
        return this.request<FlightRuleRaw[]>("/flight-rules/dependency", {
            signal,
        });
    }

    async getHolds(signal?: AbortSignal): Promise<HoldRaw[]> {
        return this.request<HoldRaw[]>("/hold", { signal });
    }

    async getAssignedHolds(signal?: AbortSignal): Promise<unknown[]> {
        return this.request<unknown[]>("/hold/assigned", { signal });
    }

    async getProximityHolds(signal?: AbortSignal): Promise<ProximityHoldRaw[]> {
        return this.request<ProximityHoldRaw[]>("/hold/proximity", { signal });
    }

    async getHandoffs(signal?: AbortSignal): Promise<HandoffRaw[]> {
        return this.request<HandoffRaw[]>("/handoffs/dependency", { signal });
    }

    async getPrenotes(signal?: AbortSignal): Promise<PrenoteRaw[]> {
        return this.request<PrenoteRaw[]>("/prenotes/dependency", { signal });
    }

    async getRegionalPressure(signal?: AbortSignal): Promise<RegionalPressureRaw> {
        return this.request<RegionalPressureRaw>("/regional-pressure", { signal });
    }

    async getAltimeterSettingRegions(signal?: AbortSignal): Promise<AltimeterSettingRegionRaw[]> {
        return this.request<AltimeterSettingRegionRaw[]>("/altimeter-setting-region", { signal });
    }

    async getMetars(signal?: AbortSignal): Promise<MetarRaw[]> {
        return this.request<MetarRaw[]>("/metar", { signal });
    }

    async getMslAll(signal?: AbortSignal): Promise<MslAllRaw> {
        return this.request<MslAllRaw>("/msl", { signal });
    }

    async getMslAirfields(signal?: AbortSignal): Promise<Record<string, number>> {
        return this.request<Record<string, number>>("/msl/airfield", { signal });
    }

    async getMslTmas(signal?: AbortSignal): Promise<Record<string, number>> {
        return this.request<Record<string, number>>("/msl/tma", { signal });
    }

    async getMslForAirfield(icao: string, signal?: AbortSignal): Promise<number> {
        return this.request<number>(`/msl/airfield/${encodeURIComponent(icao.toUpperCase())}`, { signal });
    }

    async getMslForTma(tma: string, signal?: AbortSignal): Promise<number> {
        return this.request<number>(`/msl/tma/${encodeURIComponent(tma.toUpperCase())}`, { signal });
    }

    async searchSrdRoutes(params: SrdRouteSearchParams, signal?: AbortSignal): Promise<SrdRouteRaw[]> {
        const query = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined) {
                query.append(key, value);
            }
        }
        const qs = query.toString();
        return this.request<SrdRouteRaw[]>(`/srd/route/search${qs ? `?${qs}` : ""}`, { signal });
    }

    async getNavaids(signal?: AbortSignal): Promise<NavaidRaw[]> {
        return this.request<NavaidRaw[]>("/navaid/dependency", { signal });
    }

    async getEnrouteReleaseTypes(signal?: AbortSignal): Promise<EnrouteReleaseTypeRaw[]> {
        return this.request<EnrouteReleaseTypeRaw[]>("/release/enroute/types", { signal });
    }

    async getSmrAreas(signal?: AbortSignal): Promise<SmrAreasRaw> {
        return this.request<SmrAreasRaw>("/smr-areas", { signal });
    }

    async getSids(signal?: AbortSignal): Promise<SidRaw[]> {
        return this.request<SidRaw[]>("/sid/dependency", { signal });
    }

    async getStandDependency(signal?: AbortSignal): Promise<StandDependencyRaw> {
        return this.request<StandDependencyRaw>("/stand/dependency", { signal });
    }

    async getStandAssignments(signal?: AbortSignal): Promise<StandAssignmentRaw[]> {
        return this.request<StandAssignmentRaw[]>("/stand/assignment", { signal });
    }

    async getStandAssignmentForAircraft(callsign: string, signal?: AbortSignal): Promise<StandAssignmentDetailRaw> {
        return this.request<StandAssignmentDetailRaw>(
            `/stand/assignment/${encodeURIComponent(callsign.toUpperCase())}`,
            { signal },
        );
    }

    async getWakeSchemes(signal?: AbortSignal): Promise<WakeCategorySchemeRaw[]> {
        return this.request<WakeCategorySchemeRaw[]>("/wake-schemes/dependency", { signal });
    }

    async getLatestVersion(signal?: AbortSignal): Promise<VersionDetailRaw> {
        return this.request<VersionDetailRaw>("/version/latest", { signal });
    }

    async getVersion(version: string, signal?: AbortSignal): Promise<VersionDetailRaw> {
        return this.request<VersionDetailRaw>(`/version/${encodeURIComponent(version)}`, { signal });
    }
}
