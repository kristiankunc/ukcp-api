import { UkcpApi } from "./api";
import type {
    AirfieldRaw,
    ControllerPositionV2Raw,
    HoldRaw,
    ProximityHoldRaw,
    HandoffRaw,
    PrenoteRaw,
    MetarRaw,
    NavaidRaw,
    SidRaw,
    StandBasicInfoRaw,
    StandAssignmentRaw,
    WakeCategorySchemeRaw,
    MslAllRaw,
} from "./types";
import {
    Airfield,
    ControllerPosition,
    Hold,
    ProximityHold,
    Handoff,
    Prenote,
    Metar,
    Navaid,
    Sid,
    Stand,
    StandAssignment,
    WakeCategoryScheme,
    FlightRule,
    RegionalPressure,
    AltimeterSettingRegion,
    EnrouteReleaseType,
    WakeCategory,
    VersionDetail,
    SrdRoute,
} from "./models";
import type { SrdRouteSearchParams } from "./types";

/**
 * Central registry that holds all UKCP data and provides
 * rich object navigation between domain objects.
 *
 * Created via `UkcpData.create()`, which fetches all collections
 * in parallel, indexes them, and enables synchronous relationship
 * traversal through domain class getters.
 *
 * @example
 * const api = new UkcpApi();
 * const data = await UkcpData.create(api);
 *
 * const gatwick = data.getAirfieldByCode("EGKK");
 * console.log(gatwick.controllers.map(c => c.callsign));
 * console.log(gatwick.metar?.parsed.qnh);
 * console.log(gatwick.stands.length, "stands");
 */
export class UkcpData {
    private _airfieldsByCode = new Map<string, AirfieldRaw>();
    private _airfieldsById = new Map<number, AirfieldRaw>();
    private _controllersById = new Map<number, ControllerPositionV2Raw>();
    private _holdsById = new Map<number, HoldRaw>();
    private _proximityHolds: ProximityHoldRaw[] = [];
    private _handoffsById = new Map<number, HandoffRaw>();
    private _prenotesById = new Map<number, PrenoteRaw>();
    private _metars: MetarRaw[] = [];
    private _navaidsById = new Map<number, NavaidRaw>();
    private _sids: SidRaw[] = [];
    private _standDependency: Record<string, StandBasicInfoRaw[]> = {};
    private _standAssignments: StandAssignmentRaw[] = [];
    private _wakeSchemesById = new Map<number, WakeCategorySchemeRaw>();
    private _airfieldMsl: Record<string, number> = {};
    private _tmaMsl: Record<string, number> = {};

    private _airfieldCache = new Map<string, Airfield>();
    private _airfieldByIdCache = new Map<number, Airfield>();
    private _controllerCache = new Map<number, ControllerPosition>();
    private _holdCache = new Map<number, Hold>();
    private _handoffCache = new Map<number, Handoff>();
    private _prenoteCache = new Map<number, Prenote>();
    private _navaidCache = new Map<number, Navaid>();
    private _standCache = new Map<number, Stand>();
    private _wakeSchemeCache = new Map<number, WakeCategoryScheme>();

    private _flightRules: FlightRule[] | null = null;
    private _regionalPressure: RegionalPressure | null = null;
    private _altimeterRegions: AltimeterSettingRegion[] | null = null;
    private _releaseTypes: EnrouteReleaseType[] | null = null;
    private _wakeCategories: WakeCategory[] | null = null;
    private _aircraft: unknown = null;

    private _allAirfields: Airfield[] | null = null;
    private _allHolds: Hold[] | null = null;
    private _allProximityHolds: ProximityHold[] | null = null;
    private _allHandoffs: Handoff[] | null = null;
    private _allPrenotes: Prenote[] | null = null;
    private _allMetars: Metar[] | null = null;
    private _allSids: Sid[] | null = null;
    private _allNavaids: Navaid[] | null = null;
    private _allStandAssignments: StandAssignment[] | null = null;

    private constructor(private readonly _api: UkcpApi) {}

    /**
     * Fetch ALL public UKCP data in parallel and build the
     * fully-populated registry with domain objects.
     *
     * Subsequent navigation between objects (e.g. `airfield.controllers`)
     * is synchronous — all data is cached in memory.
     */
    static async create(api: UkcpApi): Promise<UkcpData> {
        const data = new UkcpData(api);

        const [
            airfieldsRaw,
            controllersV2Raw,
            holdsRaw,
            navaidsRaw,
            handoffsRaw,
            prenotesRaw,
            metarsRaw,
            sidsRaw,
            standDepRaw,
            standAssignRaw,
            wakeSchemesRaw,
            mslRaw,
        ] = await Promise.all([
            api.getAirfields(),
            api.getControllerPositionsV2(),
            api.getHolds(),
            api.getNavaids(),
            api.getHandoffs(),
            api.getPrenotes(),
            api.getMetars(),
            api.getSids(),
            api.getStandDependency(),
            api.getStandAssignments(),
            api.getWakeSchemes(),
            api.getMslAll(),
        ]);

        for (const af of airfieldsRaw) {
            data._airfieldsByCode.set(af.code, af);
            data._airfieldsById.set(af.id, af);
        }
        for (const c of controllersV2Raw) {
            data._controllersById.set(c.id, c);
        }
        for (const h of holdsRaw) {
            data._holdsById.set(h.id, h);
        }
        for (const n of navaidsRaw) {
            data._navaidsById.set(n.id, n);
        }
        for (const h of handoffsRaw) {
            data._handoffsById.set(h.id, h);
        }
        for (const p of prenotesRaw) {
            data._prenotesById.set(p.id, p);
        }

        data._metars = metarsRaw;
        data._sids = sidsRaw;
        data._standDependency = standDepRaw;
        data._standAssignments = standAssignRaw;

        for (const ws of wakeSchemesRaw) {
            data._wakeSchemesById.set(ws.id, ws);
        }

        data._airfieldMsl = mslRaw.airfield;
        data._tmaMsl = mslRaw.tma;

        try {
            data._flightRules = (await api.getFlightRules()).map((r) => new FlightRule(r));
        } catch {}
        try {
            data._regionalPressure = new RegionalPressure(await api.getRegionalPressure());
        } catch {}
        try {
            data._altimeterRegions = (await api.getAltimeterSettingRegions()).map((r) => new AltimeterSettingRegion(r));
        } catch {}
        try {
            data._releaseTypes = (await api.getEnrouteReleaseTypes()).map((r) => new EnrouteReleaseType(r));
        } catch {}
        try {
            data._wakeCategories = (await api.getWakeCategories()).map((c) => new WakeCategory(c));
        } catch {}
        try {
            data._aircraft = await api.getAircraft();
        } catch {}
        try {
            data._proximityHolds = await api.getProximityHolds();
        } catch {}

        return data;
    }

    /** Look up Airfield domain object by ICAO code (e.g. "EGKK") */
    getAirfieldByCode(code: string): Airfield | undefined {
        let cached = this._airfieldCache.get(code);
        if (cached) return cached;
        const raw = this._airfieldsByCode.get(code.toUpperCase());
        if (!raw) return undefined;
        cached = new Airfield(raw, this);
        this._airfieldCache.set(code, cached);
        return cached;
    }

    /** Look up Airfield domain object by numeric ID */
    getAirfieldById(id: number): Airfield | undefined {
        let cached = this._airfieldByIdCache.get(id);
        if (cached) return cached;
        const raw = this._airfieldsById.get(id);
        if (!raw) return undefined;
        cached = new Airfield(raw, this);
        this._airfieldByIdCache.set(id, cached);
        return cached;
    }

    /** All airfields as domain objects */
    get allAirfields(): Airfield[] {
        if (this._allAirfields) return this._allAirfields;
        this._allAirfields = [...this._airfieldsByCode.values()].map((raw) => this.getAirfieldByCode(raw.code)!);
        return this._allAirfields;
    }

    /** Look up ControllerPosition by numeric ID */
    getControllerById(id: number): ControllerPosition | undefined {
        let cached = this._controllerCache.get(id);
        if (cached) return cached;
        const raw = this._controllersById.get(id);
        if (!raw) return undefined;
        cached = new ControllerPosition(raw, this);
        this._controllerCache.set(id, cached);
        return cached;
    }

    /** All controllers as domain objects */
    get allControllers(): ControllerPosition[] {
        return [...this._controllersById.values()].map((raw) => this.getControllerById(raw.id)!);
    }

    /** Look up Hold by numeric ID */
    getHoldById(id: number): Hold | undefined {
        let cached = this._holdCache.get(id);
        if (cached) return cached;
        const raw = this._holdsById.get(id);
        if (!raw) return undefined;
        cached = new Hold(raw, this);
        this._holdCache.set(id, cached);
        return cached;
    }

    /** All holds as domain objects */
    get allHolds(): Hold[] {
        if (this._allHolds) return this._allHolds;
        this._allHolds = [...this._holdsById.values()].map((raw) => this.getHoldById(raw.id)!);
        return this._allHolds;
    }

    /** All proximity holds */
    get allProximityHolds(): ProximityHold[] {
        if (this._allProximityHolds) return this._allProximityHolds;
        this._allProximityHolds = this._proximityHolds.map((raw) => new ProximityHold(raw, this));
        return this._allProximityHolds;
    }

    /** Look up Handoff by numeric ID */
    getHandoffById(id: number): Handoff | undefined {
        let cached = this._handoffCache.get(id);
        if (cached) return cached;
        const raw = this._handoffsById.get(id);
        if (!raw) return undefined;
        cached = new Handoff(raw, this);
        this._handoffCache.set(id, cached);
        return cached;
    }

    /** All handoffs as domain objects */
    get allHandoffs(): Handoff[] {
        if (this._allHandoffs) return this._allHandoffs;
        this._allHandoffs = [...this._handoffsById.values()].map((raw) => this.getHandoffById(raw.id)!);
        return this._allHandoffs;
    }

    /** Look up Prenote by numeric ID */
    getPrenoteById(id: number): Prenote | undefined {
        let cached = this._prenoteCache.get(id);
        if (cached) return cached;
        const raw = this._prenotesById.get(id);
        if (!raw) return undefined;
        cached = new Prenote(raw, this);
        this._prenoteCache.set(id, cached);
        return cached;
    }

    /** All prenotes as domain objects */
    get allPrenotes(): Prenote[] {
        if (this._allPrenotes) return this._allPrenotes;
        this._allPrenotes = [...this._prenotesById.values()].map((raw) => this.getPrenoteById(raw.id)!);
        return this._allPrenotes;
    }

    /** All METARs as domain objects */
    get allMetars(): Metar[] {
        if (this._allMetars) return this._allMetars;
        this._allMetars = this._metars.map((raw) => new Metar(raw, this));
        return this._allMetars;
    }

    /** Look up Navaid by numeric ID */
    getNavaidById(id: number): Navaid | undefined {
        let cached = this._navaidCache.get(id);
        if (cached) return cached;
        const raw = this._navaidsById.get(id);
        if (!raw) return undefined;
        cached = new Navaid(raw, this);
        this._navaidCache.set(id, cached);
        return cached;
    }

    /** All navaids as domain objects */
    get allNavaids(): Navaid[] {
        if (this._allNavaids) return this._allNavaids;
        this._allNavaids = [...this._navaidsById.values()].map((raw) => this.getNavaidById(raw.id)!);
        return this._allNavaids;
    }

    /** All SIDs as domain objects */
    get allSids(): Sid[] {
        if (this._allSids) return this._allSids;
        this._allSids = this._sids.map((raw) => new Sid(raw, this));
        return this._allSids;
    }

    /** Get all stands for a given airfield code */
    getStandsForAirfield(airfieldCode: string): Stand[] {
        const rawStands = this._standDependency[airfieldCode.toUpperCase()];
        if (!rawStands) return [];
        return rawStands.map((raw) => this._getOrCreateStand(raw, airfieldCode.toUpperCase()));
    }

    /** Look up Stand by numeric ID (searches across all airfields) */
    getStandById(id: number): Stand | undefined {
        let cached = this._standCache.get(id);
        if (cached) return cached;

        for (const [code, stands] of Object.entries(this._standDependency)) {
            const found = stands.find((s) => s.id === id);
            if (found) {
                cached = new Stand(found, code, this);
                this._standCache.set(id, cached);
                return cached;
            }
        }
        return undefined;
    }

    private _getOrCreateStand(raw: StandBasicInfoRaw, airfieldCode: string): Stand {
        let cached = this._standCache.get(raw.id);
        if (cached) return cached;
        const stand = new Stand(raw, airfieldCode, this);
        this._standCache.set(raw.id, stand);
        return stand;
    }

    /** All stand assignments as domain objects */
    get allStandAssignments(): StandAssignment[] {
        if (this._allStandAssignments) return this._allStandAssignments;
        this._allStandAssignments = this._standAssignments.map((raw) => new StandAssignment(raw, this));
        return this._allStandAssignments;
    }

    /** Look up WakeCategoryScheme by numeric ID */
    getWakeSchemeById(id: number): WakeCategoryScheme | undefined {
        let cached = this._wakeSchemeCache.get(id);
        if (cached) return cached;
        const raw = this._wakeSchemesById.get(id);
        if (!raw) return undefined;
        cached = new WakeCategoryScheme(raw, this);
        this._wakeSchemeCache.set(id, cached);
        return cached;
    }

    /** All wake category schemes */
    get allWakeSchemes(): WakeCategoryScheme[] {
        return [...this._wakeSchemesById.values()].map((raw) => this.getWakeSchemeById(raw.id)!);
    }

    /** Get MSL for an airfield by ICAO code */
    getMslForAirfield(icao: string): number | undefined {
        return this._airfieldMsl[icao.toUpperCase()];
    }

    /** Get MSL for a TMA by code */
    getMslForTma(tma: string): number | undefined {
        return this._tmaMsl[tma.toUpperCase()];
    }

    /** Raw airfield MSL map */
    get airfieldMslMap(): Readonly<Record<string, number>> {
        return this._airfieldMsl;
    }

    /** Raw TMA MSL map */
    get tmaMslMap(): Readonly<Record<string, number>> {
        return this._tmaMsl;
    }

    /** Flight rules (VFR / IFR) */
    get flightRules(): FlightRule[] {
        return this._flightRules ?? [];
    }

    /** Regional pressure data */
    get regionalPressure(): RegionalPressure | null {
        return this._regionalPressure;
    }

    /** Altimeter setting regions */
    get altimeterSettingRegions(): AltimeterSettingRegion[] {
        return this._altimeterRegions ?? [];
    }

    /** Enroute release types */
    get enrouteReleaseTypes(): EnrouteReleaseType[] {
        return this._releaseTypes ?? [];
    }

    /** Flat list of all wake categories (from /wake-category) */
    get wakeCategories(): WakeCategory[] {
        return this._wakeCategories ?? [];
    }

    /** Raw aircraft data */
    get aircraft(): unknown {
        return this._aircraft;
    }

    /**
     * Search SRD routes. Returns value objects (no further navigation).
     */
    async searchSrdRoutes(params: SrdRouteSearchParams, signal?: AbortSignal): Promise<SrdRoute[]> {
        const raw = await this._api.searchSrdRoutes(params, signal);
        return raw.map((r) => new SrdRoute(r));
    }

    /**
     * Fetch the latest plugin version.
     */
    async getLatestVersion(signal?: AbortSignal): Promise<VersionDetail> {
        const raw = await this._api.getLatestVersion(signal);
        return new VersionDetail(raw);
    }

    /**
     * Fetch a specific plugin version.
     */
    async getVersion(version: string, signal?: AbortSignal): Promise<VersionDetail> {
        const raw = await this._api.getVersion(version, signal);
        return new VersionDetail(raw);
    }

    /** Access the underlying HTTP client */
    get api(): UkcpApi {
        return this._api;
    }
}
