import type {
    AirfieldRaw,
    WakeCategoryRaw,
    ControllerPositionV2Raw,
    HoldRaw,
    ProximityHoldRaw,
    HandoffRaw,
    PrenoteRaw,
    MetarRaw,
    MetarParsed,
    NavaidRaw,
    SidRaw,
    StandBasicInfoRaw,
    StandAssignmentRaw,
    StandAssignmentDetailRaw,
    WakeCategorySchemeRaw,
    HoldRestriction,
    DeemedSeparatedHold,
    FlightRuleRaw,
    AltimeterSettingRegionRaw,
    RegionalPressureRaw,
    EnrouteReleaseTypeRaw,
    VersionDetailRaw,
    SrdRouteRaw,
    WakeInterval,
} from "./types";

import type { UkcpData } from "./data";

/** A flight rule category (VFR / IFR). */
export class FlightRule {
    constructor(private readonly _raw: FlightRuleRaw) {}

    get id(): number {
        return this._raw.id;
    }
    get euroscopeKey(): string {
        return this._raw.euroscope_key;
    }
    get description(): string {
        return this._raw.description;
    }
}

/** An altimeter setting region with its pressure adjustment. */
export class AltimeterSettingRegion {
    constructor(private readonly _raw: AltimeterSettingRegionRaw) {}

    get id(): number {
        return this._raw.id;
    }
    get key(): string {
        return this._raw.key;
    }
    get name(): string {
        return this._raw.name;
    }
    get adjustment(): number {
        return this._raw.adjustment;
    }
}

/** Regional pressure values keyed by ASR code (e.g. ASR_LONDON). */
export class RegionalPressure {
    constructor(private readonly _raw: RegionalPressureRaw) {}

    get raw(): RegionalPressureRaw {
        return this._raw;
    }

    get(key: string): number | undefined {
        return this._raw[key];
    }

    get london(): number {
        return this._raw.ASR_LONDON;
    }
    get manchester(): number {
        return this._raw.ASR_MANCHESTER;
    }
    get scottish(): number {
        return this._raw.ASR_SCOTTISH;
    }
    get skerry(): number {
        return this._raw.ASR_SKERRY;
    }
    get portree(): number {
        return this._raw.ASR_PORTREE;
    }
    get rattray(): number {
        return this._raw.ASR_RATTRAY;
    }
    get tyne(): number {
        return this._raw.ASR_TYNE;
    }
    get belfast(): number {
        return this._raw.ASR_BELFAST;
    }
    get holyhead(): number {
        return this._raw.ASR_HOLYHEAD;
    }
    get barnsley(): number {
        return this._raw.ASR_BARNSLEY;
    }
    get humber(): number {
        return this._raw.ASR_HUMBER;
    }
    get scillies(): number {
        return this._raw.ASR_SCILLIES;
    }
    get wessex(): number {
        return this._raw.ASR_WESSEX;
    }
    get chatham(): number {
        return this._raw.ASR_CHATHAM;
    }
    get portland(): number {
        return this._raw.ASR_PORTLAND;
    }
    get yarmouth(): number {
        return this._raw.ASR_YARMOUTH;
    }
    get cotswold(): number {
        return this._raw.ASR_COTSWOLD;
    }
    get shetland(): number {
        return this._raw.ASR_SHETLAND;
    }
    get orkney(): number {
        return this._raw.ASR_ORKNEY;
    }
    get marlin(): number {
        return this._raw.ASR_MARLIN;
    }
    get petrel(): number {
        return this._raw.ASR_PETREL;
    }
    get skua(): number {
        return this._raw.ASR_SKUA;
    }
    get puffin(): number {
        return this._raw.ASR_PUFFIN;
    }

    /** All region entries as key-value pairs */
    entries(): [string, number][] {
        return Object.entries(this._raw);
    }
}

/** A type of enroute release (climb, descent, turns, etc.). */
export class EnrouteReleaseType {
    constructor(private readonly _raw: EnrouteReleaseTypeRaw) {}

    get id(): number {
        return this._raw.id;
    }
    get tagString(): string {
        return this._raw.tag_string;
    }
    get description(): string {
        return this._raw.description;
    }
}

/** A specific plugin version with download URLs. */
export class VersionDetail {
    constructor(private readonly _raw: VersionDetailRaw) {}

    get id(): number {
        return this._raw.id;
    }
    get version(): string {
        return this._raw.version;
    }
    get updaterDownloadUrl(): string {
        return this._raw.updater_download_url;
    }
    get coreDownloadUrl(): string {
        return this._raw.core_download_url;
    }
    get loaderDownloadUrl(): string {
        return this._raw.loader_download_url;
    }
}

/** A Standard Route Document (SRD) search result. */
export class SrdRoute {
    constructor(private readonly _raw: SrdRouteRaw) {}

    get minimumLevel(): number {
        return this._raw.minimum_level;
    }
    get maximumLevel(): number {
        return this._raw.maximum_level;
    }
    get routeString(): string {
        return this._raw.route_string;
    }
    get notes(): string[] {
        return this._raw.notes;
    }
}

/** A wake turbulence category with separation intervals. */
export class WakeCategory {
    constructor(private readonly _raw: WakeCategoryRaw) {}

    get id(): number {
        return this._raw.id;
    }
    get code(): string {
        return this._raw.code;
    }
    get description(): string {
        return this._raw.description;
    }
    get relativeWeighting(): number {
        return this._raw.relative_weighting;
    }
    get subsequentDepartureIntervals(): WakeInterval[] {
        return this._raw.subsequent_departure_intervals;
    }
    get subsequentArrivalIntervals(): WakeInterval[] {
        return this._raw.subsequent_arrival_intervals;
    }
}

/** A navigational aid (navaid) with coordinates. */
export class Navaid {
    constructor(
        private readonly _raw: NavaidRaw,
        private readonly _data: UkcpData,
    ) {}

    get id(): number {
        return this._raw.id;
    }
    get identifier(): string {
        return this._raw.identifier;
    }
    get latitude(): string {
        return this._raw.latitude;
    }
    get longitude(): string {
        return this._raw.longitude;
    }

    /** All holds that use this navaid as their reference fix */
    get holds(): Hold[] {
        return this._data.allHolds.filter((h) => h.navaidId === this.id);
    }

    /** Proximity holds currently tracking this navaid */
    get proximityHolds(): ProximityHold[] {
        return this._data.allProximityHolds.filter((ph) => ph.navaidId === this.id);
    }
}

/** An ATC controller position with frequency and top-down airfields. */
export class ControllerPosition {
    constructor(
        private readonly _raw: ControllerPositionV2Raw,
        private readonly _data: UkcpData,
    ) {}

    get id(): number {
        return this._raw.id;
    }
    get callsign(): string {
        return this._raw.callsign;
    }
    get frequency(): number {
        return this._raw.frequency;
    }
    get topDownCodes(): readonly string[] {
        return this._raw.top_down;
    }
    get requestsDepartureReleases(): boolean {
        return this._raw.requests_departure_releases;
    }
    get receivesDepartureReleases(): boolean {
        return this._raw.receives_departure_releases;
    }
    get sendsPrenotes(): boolean {
        return this._raw.sends_prenotes;
    }
    get receivesPrenotes(): boolean {
        return this._raw.receives_prenotes;
    }

    /** Airfields this controller has top-down coverage of */
    get topDownAirfields(): Airfield[] {
        return this._raw.top_down
            .map((code) => this._data.getAirfieldByCode(code))
            .filter((a): a is Airfield => a !== undefined);
    }

    /** Handoff groups that include this controller position */
    get handoffs(): Handoff[] {
        return this._data.allHandoffs.filter((h) => h.controllerIds.includes(this.id));
    }

    /** Prenote groups that include this controller position */
    get prenotes(): Prenote[] {
        return this._data.allPrenotes.filter((p) => p.controllerIds.includes(this.id));
    }

    /** Airfields that list this controller in their controller roster */
    get assignedAirfields(): Airfield[] {
        return this._data.allAirfields.filter((af) => af.controllerIds.includes(this.id));
    }
}

/** An airfield with its controllers, handoffs, stands, and operational data. */
export class Airfield {
    constructor(
        private readonly _raw: AirfieldRaw,
        private readonly _data: UkcpData,
    ) {}

    get id(): number {
        return this._raw.id;
    }
    get code(): string {
        return this._raw.code;
    }
    get elevation(): number {
        return this._raw.elevation;
    }
    get transitionAltitude(): number {
        return this._raw.transition_altitude;
    }
    get standardHigh(): number {
        return this._raw.standard_high;
    }
    get wakeCategorySchemeId(): number {
        return this._raw.wake_category_scheme_id;
    }
    get handoffId(): number {
        return this._raw.handoff_id;
    }
    get controllerIds(): readonly number[] {
        return this._raw.controllers;
    }

    /** Controller positions assigned to this airfield */
    get controllers(): ControllerPosition[] {
        return this._raw.controllers
            .map((id) => this._data.getControllerById(id))
            .filter((c): c is ControllerPosition => c !== undefined);
    }

    /** Handoff group used by this airfield */
    get handoff(): Handoff | undefined {
        return this._data.getHandoffById(this._raw.handoff_id);
    }

    /** Wake category scheme used by this airfield */
    get wakeScheme(): WakeCategoryScheme | undefined {
        return this._data.getWakeSchemeById(this._raw.wake_category_scheme_id);
    }

    /** Current METAR for this airfield, if available */
    get metar(): Metar | undefined {
        return this._data.allMetars.find((m) => m.airfieldId === this.id);
    }

    /** Stands at this airfield */
    get stands(): Stand[] {
        return this._data.getStandsForAirfield(this._raw.code);
    }

    /** SIDs (Standard Instrument Departures) for this airfield */
    get sids(): Sid[] {
        return this._data.allSids.filter((s) => s.airfieldCode === this._raw.code);
    }

    /** Holds that affect this airfield (via restrictions targeting this code) */
    get holds(): Hold[] {
        return this._data.allHolds.filter((h) => h.restrictions.some((r) => r.target === this._raw.code));
    }

    /** Minimum Stack Level for this airfield, if defined */
    get msl(): number | undefined {
        return this._data.getMslForAirfield(this._raw.code);
    }

    /** Prenote pairing configuration for this airfield */
    get pairingPrenotes(): Record<string, number[]> {
        return { ...this._raw["pairing-prenotes"] };
    }
}

/** A holding pattern with restrictions and deemed separations. */
export class Hold {
    constructor(
        private readonly _raw: HoldRaw,
        private readonly _data: UkcpData,
    ) {}

    get id(): number {
        return this._raw.id;
    }
    get navaidId(): number {
        return this._raw.navaid_id;
    }
    get inboundHeading(): number {
        return this._raw.inbound_heading;
    }
    get minimumAltitude(): number {
        return this._raw.minimum_altitude;
    }
    get maximumAltitude(): number {
        return this._raw.maximum_altitude;
    }
    get turnDirection(): "left" | "right" {
        return this._raw.turn_direction;
    }
    get outboundLegValue(): number | null {
        return this._raw.outbound_leg_value;
    }
    get outboundLegUnit(): string | null {
        return this._raw.outbound_leg_unit;
    }
    get description(): string {
        return this._raw.description;
    }
    get restrictions(): readonly HoldRestriction[] {
        return this._raw.restrictions;
    }
    get fix(): string {
        return this._raw.fix;
    }

    /** Navaid that defines this hold's fix */
    get navaid(): Navaid | undefined {
        return this._data.getNavaidById(this._raw.navaid_id);
    }

    /** Holds that are deemed separated from this one */
    get deemedSeparatedHolds(): Hold[] {
        return this._raw.deemed_separated_holds
            .map((dsh) => this._data.getHoldById(dsh.hold_id))
            .filter((h): h is Hold => h !== undefined);
    }

    /** Airfields that this hold's restrictions apply to */
    get restrictionAirfields(): Airfield[] {
        const codes = new Set(this._raw.restrictions.map((r) => r.target));
        return [...codes]
            .map((code) => this._data.getAirfieldByCode(code))
            .filter((a): a is Airfield => a !== undefined);
    }
}

/** An aircraft currently in proximity to a navaid. */
export class ProximityHold {
    constructor(
        private readonly _raw: ProximityHoldRaw,
        private readonly _data: UkcpData,
    ) {}

    get callsign(): string {
        return this._raw.callsign;
    }
    get navaidId(): number {
        return this._raw.navaid_id;
    }
    get enteredAt(): string {
        return this._raw.entered_at;
    }

    /** Navaid associated with this proximity hold */
    get navaid(): Navaid | undefined {
        return this._data.getNavaidById(this._raw.navaid_id);
    }
}

/** A handoff group defining controller position sequences. */
export class Handoff {
    constructor(
        private readonly _raw: HandoffRaw,
        private readonly _data: UkcpData,
    ) {}

    get id(): number {
        return this._raw.id;
    }
    get controllerIds(): readonly number[] {
        return this._raw.controller_positions;
    }

    /** Controller positions in this handoff group */
    get controllers(): ControllerPosition[] {
        return this._raw.controller_positions
            .map((id) => this._data.getControllerById(id))
            .filter((c): c is ControllerPosition => c !== undefined);
    }

    /** Airfields that use this handoff group */
    get airfields(): Airfield[] {
        return this._data.allAirfields.filter((af) => af.handoffId === this.id);
    }

    /** SIDs that reference this handoff group */
    get sids(): Sid[] {
        return this._data.allSids.filter((s) => s.handoffId === this.id);
    }
}

/** A prenote group for departure coordination between controllers. */
export class Prenote {
    constructor(
        private readonly _raw: PrenoteRaw,
        private readonly _data: UkcpData,
    ) {}

    get id(): number {
        return this._raw.id;
    }
    get description(): string {
        return this._raw.description;
    }
    get controllerIds(): readonly number[] {
        return this._raw.controller_positions;
    }

    /** Controller positions in this prenote group */
    get controllers(): ControllerPosition[] {
        return this._raw.controller_positions
            .map((id) => this._data.getControllerById(id))
            .filter((c): c is ControllerPosition => c !== undefined);
    }

    /** SIDs that include this prenote */
    get sids(): Sid[] {
        return this._data.allSids.filter((s) => s.prenoteIds.includes(this.id));
    }
}

/** A Standard Instrument Departure (SID) with associated handoffs and prenotes. */
export class Sid {
    constructor(
        private readonly _raw: SidRaw,
        private readonly _data: UkcpData,
    ) {}

    get id(): number {
        return this._raw.id;
    }
    get airfieldCode(): string {
        return this._raw.airfield;
    }
    get runwayId(): number {
        return this._raw.runway_id;
    }
    get identifier(): string {
        return this._raw.identifier;
    }
    get departureIntervalGroup(): number | null {
        return this._raw.departure_interval_group;
    }
    get initialAltitude(): number {
        return this._raw.initial_altitude;
    }
    get initialHeading(): number | null {
        return this._raw.initial_heading;
    }
    get handoffId(): number | null {
        return this._raw.handoff;
    }
    get prenoteIds(): readonly number[] {
        return this._raw.prenotes;
    }

    /** Airfield this SID belongs to */
    get airfield(): Airfield | undefined {
        return this._data.getAirfieldByCode(this._raw.airfield);
    }

    /** Handoff group for this SID */
    get handoff(): Handoff | undefined {
        return this._raw.handoff !== null ? this._data.getHandoffById(this._raw.handoff) : undefined;
    }

    /** Prenotes associated with this SID */
    get prenotes(): Prenote[] {
        return this._raw.prenotes
            .map((id) => this._data.getPrenoteById(id))
            .filter((p): p is Prenote => p !== undefined);
    }
}

/** A METAR weather observation for an airfield. */
export class Metar {
    constructor(
        private readonly _raw: MetarRaw,
        private readonly _data: UkcpData,
    ) {}

    get airfieldId(): number {
        return this._raw.airfield_id;
    }
    get raw(): string {
        return this._raw.raw;
    }
    get parsed(): MetarParsed {
        return this._raw.parsed;
    }

    /** Airfield this METAR belongs to */
    get airfield(): Airfield | undefined {
        return this._data.getAirfieldById(this._raw.airfield_id);
    }
}

/** A physical aircraft stand at an airfield, optionally with an assignment. */
export class Stand {
    constructor(
        private readonly _raw: StandBasicInfoRaw,
        private readonly _airfieldCode: string,
        private readonly _data: UkcpData,
    ) {}

    get id(): number {
        return this._raw.id;
    }
    get identifier(): string {
        return this._raw.identifier;
    }
    get airfieldCode(): string {
        return this._airfieldCode;
    }

    /** Airfield this stand belongs to */
    get airfield(): Airfield | undefined {
        return this._data.getAirfieldByCode(this._airfieldCode);
    }

    /** Current aircraft assignment on this stand, if any */
    get assignment(): StandAssignment | undefined {
        return this._data.allStandAssignments.find((sa) => sa.standId === this.id);
    }
}

/** An aircraft assigned to a stand. */
export class StandAssignment {
    constructor(
        private readonly _raw: StandAssignmentRaw,
        private readonly _data: UkcpData,
    ) {}

    get callsign(): string {
        return this._raw.callsign;
    }
    get standId(): number {
        return this._raw.stand_id;
    }
    get source(): string {
        return this._raw.assignment_source;
    }

    /** Stand that is assigned */
    get stand(): Stand | undefined {
        return this._data.getStandById(this._raw.stand_id);
    }
}

/** A wake category scheme (e.g. UK or RECAT-EU) with its category definitions. */
export class WakeCategoryScheme {
    constructor(
        private readonly _raw: WakeCategorySchemeRaw,
        private readonly _data: UkcpData,
    ) {}

    get id(): number {
        return this._raw.id;
    }
    get key(): string {
        return this._raw.key;
    }
    get name(): string {
        return this._raw.name;
    }
    get categories(): WakeCategory[] {
        return this._raw.categories.map((c) => new WakeCategory(c));
    }

    /** Airfields that use this wake category scheme */
    get airfields(): Airfield[] {
        return this._data.allAirfields.filter((af) => af.wakeCategorySchemeId === this.id);
    }
}
