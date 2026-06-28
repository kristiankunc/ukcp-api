export interface WelcomeMessage {
    message: string;
}

export interface AircraftRaw {
    id: number;
    code: string;
    aerodrome_reference_code: string;
    wingspan: number;
    length: number;
    allocate_stands: number;
    is_business_aviation: number;
}

export interface WakeInterval {
    id: number;
    interval: number;
    interval_unit?: string;
    intermediate?: boolean;
}

export interface WakeCategoryRaw {
    id: number;
    code: string;
    description: string;
    relative_weighting: number;
    subsequent_departure_intervals: WakeInterval[];
    subsequent_arrival_intervals: WakeInterval[];
}

export interface ControllerPositionRaw {
    id: number;
    callsign: string;
    description: string | null;
    frequency: string;
    requests_departure_releases: boolean;
    receives_departure_releases: boolean;
    sends_prenotes: boolean;
    receives_prenotes: boolean;
}

export interface ControllerPositionV2Raw {
    id: number;
    callsign: string;
    frequency: number;
    top_down: string[];
    requests_departure_releases: boolean;
    receives_departure_releases: boolean;
    sends_prenotes: boolean;
    receives_prenotes: boolean;
}

export interface AirfieldRaw {
    id: number;
    code: string;
    elevation: number;
    transition_altitude: number;
    standard_high: number;
    wake_category_scheme_id: number;
    handoff_id: number;
    controllers: number[];
    "pairing-prenotes": Record<string, number[]>;
}

export interface SidDepartureIntervalGroupRaw {
    id: number;
}

export interface FlightRuleRaw {
    id: number;
    euroscope_key: string;
    description: string;
}

export interface HoldRestriction {
    type: string;
    level: string;
    target: string;
    override?: number;
}

export interface DeemedSeparatedHold {
    hold_id: number;
    vsl_insert_distance: number;
}

export interface HoldRaw {
    id: number;
    navaid_id: number;
    inbound_heading: number;
    minimum_altitude: number;
    maximum_altitude: number;
    turn_direction: "left" | "right";
    outbound_leg_value: number | null;
    outbound_leg_unit: string | null;
    description: string;
    restrictions: HoldRestriction[];
    deemed_separated_holds: DeemedSeparatedHold[];
    fix: string;
}

export interface ProximityHoldRaw {
    callsign: string;
    navaid_id: number;
    entered_at: string;
}

export interface HandoffRaw {
    id: number;
    controller_positions: number[];
}

export interface PrenoteRaw {
    id: number;
    description: string;
    controller_positions: number[];
}

export interface RegionalPressureRaw {
    ASR_LONDON: number;
    ASR_MANCHESTER: number;
    ASR_SCOTTISH: number;
    ASR_SKERRY: number;
    ASR_PORTREE: number;
    ASR_RATTRAY: number;
    ASR_TYNE: number;
    ASR_BELFAST: number;
    ASR_HOLYHEAD: number;
    ASR_BARNSLEY: number;
    ASR_HUMBER: number;
    ASR_SCILLIES: number;
    ASR_WESSEX: number;
    ASR_CHATHAM: number;
    ASR_PORTLAND: number;
    ASR_YARMOUTH: number;
    ASR_COTSWOLD: number;
    ASR_SHETLAND: number;
    ASR_ORKNEY: number;
    ASR_MARLIN: number;
    ASR_PETREL: number;
    ASR_SKUA: number;
    ASR_PUFFIN: number;
    [key: string]: number;
}

export interface AltimeterSettingRegionRaw {
    id: number;
    key: string;
    name: string;
    adjustment: number;
}

export interface MetarParsed {
    qfe?: number;
    qnh?: number;
    qfe_inhg?: number;
    qnh_inhg?: number;
    wind_gust: string | null;
    visibility?: number;
    wind_speed: string;
    wind_direction: string;
    wind_variation?: string;
    pressure_format?: string;
    observation_time: string;
}

export interface MetarRaw {
    airfield_id: number;
    raw: string;
    parsed: MetarParsed;
}

export interface MslAllRaw {
    airfield: Record<string, number>;
    tma: Record<string, number>;
}

export interface SrdRouteSearchParams {
    origin?: string;
    destination?: string;
    [key: string]: string | undefined;
}

export interface SrdRouteRaw {
    minimum_level: number;
    maximum_level: number;
    route_string: string;
    notes: string[];
}

export interface NavaidRaw {
    id: number;
    identifier: string;
    latitude: string;
    longitude: string;
}

export interface EnrouteReleaseTypeRaw {
    id: number;
    tag_string: string;
    description: string;
}

export interface SidRaw {
    id: number;
    airfield: string;
    runway_id: number;
    identifier: string;
    departure_interval_group: number | null;
    initial_altitude: number;
    initial_heading: number | null;
    handoff: number | null;
    prenotes: number[];
}

export interface StandBasicInfoRaw {
    id: number;
    identifier: string;
}

export type StandDependencyRaw = Record<string, StandBasicInfoRaw[]>;

export interface StandAssignmentRaw {
    callsign: string;
    stand_id: number;
    assignment_source: string;
}

export interface StandAssignmentDetailRaw {
    callsign: string;
    id: number;
    airfield: string;
    identifier: string;
    assignment_source: string;
}

export interface WakeCategorySchemeRaw {
    id: number;
    key: string;
    name: string;
    categories: WakeCategoryRaw[];
}

export interface VersionDetailRaw {
    id: number;
    version: string;
    updater_download_url: string;
    core_download_url: string;
    loader_download_url: string;
}

export type SmrAreasRaw = string;
