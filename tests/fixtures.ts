import type { AirfieldRaw } from "../src/types";

export const EGKK_RAW: AirfieldRaw = {
    id: 1,
    code: "EGKK",
    elevation: 203,
    transition_altitude: 6000,
    standard_high: 1,
    wake_category_scheme_id: 1,
    handoff_id: 65,
    controllers: [74, 76, 77, 75, 73, 237, 238, 227, 332, 354, 224, 223, 218],
    "pairing-prenotes": {
        "2": [1, 8],
        "3": [6, 7],
        "4": [6, 7],
        "5": [8],
        "6": [8],
        "8": [6, 7],
        "18": [9],
        "19": [9],
        "29": [8],
        "31": [9],
    },
};

export const EGLL_RAW: AirfieldRaw = {
    id: 2,
    code: "EGLL",
    elevation: 83,
    transition_altitude: 6000,
    standard_high: 1,
    wake_category_scheme_id: 2,
    handoff_id: 66,
    controllers: [89, 87, 86, 92, 95, 91, 94, 90, 236, 238, 227, 328, 220, 224, 223, 218],
    "pairing-prenotes": {
        "1": [10],
        "3": [12],
        "4": [12],
        "5": [11],
        "6": [11],
        "7": [10],
        "8": [12],
        "18": [10],
        "19": [11],
    },
};

export const AIRFIELDS_RAW: AirfieldRaw[] = [EGKK_RAW, EGLL_RAW];

export const CONTROLLERS_V2_RAW = [
    {
        id: 73,
        callsign: "EGKK_S_TWR",
        frequency: 124.23,
        top_down: ["EGKK"],
        requests_departure_releases: true,
        receives_departure_releases: false,
        sends_prenotes: true,
        receives_prenotes: false,
    },
    {
        id: 74,
        callsign: "EGKK_DEL",
        frequency: 121.955,
        top_down: ["EGKK"],
        requests_departure_releases: false,
        receives_departure_releases: false,
        sends_prenotes: true,
        receives_prenotes: false,
    },
    {
        id: 75,
        callsign: "EGKK_F_APP",
        frequency: 118.95,
        top_down: ["EGKK", "EGKR"],
        requests_departure_releases: true,
        receives_departure_releases: true,
        sends_prenotes: true,
        receives_prenotes: true,
    },
    {
        id: 224,
        callsign: "LON_S_CTR",
        frequency: 129.43,
        top_down: ["EGKK", "EGLL"],
        requests_departure_releases: true,
        receives_departure_releases: true,
        sends_prenotes: true,
        receives_prenotes: true,
    },
    {
        id: 236,
        callsign: "LTC_SE_CTR",
        frequency: 120.53,
        top_down: ["EGKK"],
        requests_departure_releases: true,
        receives_departure_releases: true,
        sends_prenotes: true,
        receives_prenotes: true,
    },
];

export const HOLDS_RAW = [
    {
        id: 1,
        navaid_id: 1,
        inbound_heading: 283,
        minimum_altitude: 7000,
        maximum_altitude: 15000,
        turn_direction: "left" as const,
        outbound_leg_value: 5.1,
        outbound_leg_unit: "nm",
        description: "WILLO",
        restrictions: [{ type: "minimum-level", level: "MSL", target: "EGKK" }],
        deemed_separated_holds: [
            { hold_id: 2, vsl_insert_distance: 6 },
            { hold_id: 6, vsl_insert_distance: 6 },
        ],
        fix: "WILLO",
    },
    {
        id: 2,
        navaid_id: 2,
        inbound_heading: 308,
        minimum_altitude: 7000,
        maximum_altitude: 15000,
        turn_direction: "right" as const,
        outbound_leg_value: 1,
        outbound_leg_unit: "min",
        description: "TIMBA",
        restrictions: [{ type: "minimum-level", level: "MSL", target: "EGKK" }],
        deemed_separated_holds: [{ hold_id: 1, vsl_insert_distance: 6 }],
        fix: "TIMBA",
    },
    {
        id: 3,
        navaid_id: 3,
        inbound_heading: 120,
        minimum_altitude: 8000,
        maximum_altitude: 16000,
        turn_direction: "left" as const,
        outbound_leg_value: 1,
        outbound_leg_unit: "min",
        description: "DAYNE",
        restrictions: [{ type: "minimum-level", level: "MSL", target: "EGLL" }],
        deemed_separated_holds: [{ hold_id: 4, vsl_insert_distance: 6 }],
        fix: "DAYNE",
    },
];

export const NAVAIDS_RAW = [
    { id: 1, identifier: "WILLO", latitude: "N050.59.06.000", longitude: "W000.11.30.000" },
    { id: 2, identifier: "TIMBA", latitude: "N050.56.44.000", longitude: "E000.15.42.000" },
    { id: 3, identifier: "DAYNE", latitude: "N053.14.19.000", longitude: "W002.01.45.000" },
];

export const HANDOFFS_RAW = [
    { id: 65, controller_positions: [236, 238, 227, 328, 220, 224, 223, 218, 73] },
    { id: 66, controller_positions: [236, 238, 227, 328, 220, 224, 223, 218, 94, 91] },
    { id: 1, controller_positions: [75, 73, 237, 238, 227, 332, 354, 224, 223, 218] },
    { id: 2, controller_positions: [75, 73, 237, 238, 227, 332, 354, 224, 223, 218] },
];

export const PRENOTES_RAW = [
    {
        id: 1,
        description: "Gatwick Biggin Departures: Director",
        controller_positions: [75, 73, 237, 238, 227, 332, 224, 223, 218],
    },
    {
        id: 8,
        description: "London Gatwick, LTMA Pair: TC South East",
        controller_positions: [236, 238, 227, 328, 220, 224, 223, 218, 73],
    },
];

export const METARS_RAW = [
    {
        airfield_id: 1,
        raw: "EGKK 281320Z 23014KT 200V260 9999 SCT049 23/11 Q1019",
        parsed: {
            qfe: 1012,
            qnh: 1019,
            qfe_inhg: 29.88,
            qnh_inhg: 30.09,
            wind_gust: null,
            visibility: 9999,
            wind_speed: "14",
            wind_direction: "230",
            wind_variation: "200V260",
            pressure_format: "hpa",
            observation_time: "2026-06-28T13:20:00.000000Z",
        },
    },
    {
        airfield_id: 2,
        raw: "EGLL 281320Z AUTO 24017KT 210V270 9999 NCD 24/11 Q1018",
        parsed: {
            qfe: 1015,
            qnh: 1018,
            qfe_inhg: 29.97,
            qnh_inhg: 30.06,
            wind_gust: null,
            visibility: 9999,
            wind_speed: "17",
            wind_direction: "240",
            wind_variation: "210V270",
            pressure_format: "hpa",
            observation_time: "2026-06-28T13:20:00.000000Z",
        },
    },
];

export const SIDS_RAW = [
    {
        id: 351,
        airfield: "EGKK",
        runway_id: 130,
        identifier: "FRANE1M",
        departure_interval_group: null,
        initial_altitude: 4000,
        initial_heading: null,
        handoff: 1,
        prenotes: [],
    },
    {
        id: 395,
        airfield: "EGKK",
        runway_id: 127,
        identifier: "BIG",
        departure_interval_group: null,
        initial_altitude: 6000,
        initial_heading: 90,
        handoff: 2,
        prenotes: [1, 8],
    },
    {
        id: 2,
        airfield: "EGBB",
        runway_id: 18,
        identifier: "ADMEX1M",
        departure_interval_group: 1,
        initial_altitude: 6000,
        initial_heading: null,
        handoff: 34,
        prenotes: [],
    },
];

export const STAND_DEP_RAW = {
    EGKK: [
        { id: 461, identifier: "1" },
        { id: 462, identifier: "2" },
        { id: 463, identifier: "3" },
    ],
    EGLL: [
        { id: 464, identifier: "10" },
        { id: 465, identifier: "11" },
    ],
};

export const STAND_ASSIGN_RAW = [
    { callsign: "BAW2067", stand_id: 461, assignment_source: "system_auto" },
    { callsign: "EZY52AB", stand_id: 465, assignment_source: "system_auto" },
];

export const WAKE_SCHEMES_RAW = [
    {
        id: 1,
        key: "UK",
        name: "UK",
        categories: [
            {
                id: 1,
                code: "L",
                description: "Light",
                relative_weighting: 0,
                subsequent_departure_intervals: [],
                subsequent_arrival_intervals: [],
            },
            {
                id: 2,
                code: "S",
                description: "Small",
                relative_weighting: 5,
                subsequent_departure_intervals: [],
                subsequent_arrival_intervals: [],
            },
        ],
    },
    {
        id: 2,
        key: "RECAT_EU",
        name: "RECAT-EU",
        categories: [
            {
                id: 7,
                code: "J",
                description: "Super Heavy",
                relative_weighting: 1,
                subsequent_departure_intervals: [],
                subsequent_arrival_intervals: [],
            },
        ],
    },
];

export const MSL_RAW = {
    airfield: { EGKK: 7000, EGLL: 7000, EGGW: 7000 },
    tma: { LTMA: 7000, MTMA: 6000, STMA: 8000 },
};

export const PROXIMITY_HOLDS_RAW = [
    { callsign: "BCS2212", navaid_id: 1, entered_at: "2026-06-28T13:37:08.000000Z" },
    { callsign: "CCA847", navaid_id: 2, entered_at: "2026-06-28T13:33:06.000000Z" },
];

export const FLIGHT_RULES_RAW = [
    { id: 1, euroscope_key: "V", description: "VFR" },
    { id: 2, euroscope_key: "I", description: "IFR" },
];

export const REGIONAL_PRESSURE_RAW = {
    ASR_LONDON: 1018,
    ASR_MANCHESTER: 1017,
    ASR_SCOTTISH: 1012,
};

export const ALTIMETER_REGIONS_RAW = [
    { id: 1, key: "ASR_LONDON", name: "London", adjustment: 0 },
    { id: 2, key: "ASR_MANCHESTER", name: "Manchester", adjustment: 0 },
];

export const RELEASE_TYPES_RAW = [
    { id: 1, tag_string: "C", description: "Climb" },
    { id: 2, tag_string: "D", description: "Descent" },
];

export const WAKE_CATEGORIES_RAW = [
    {
        id: 1,
        code: "L",
        description: "Light",
        relative_weighting: 0,
        subsequent_departure_intervals: [],
        subsequent_arrival_intervals: [],
    },
];

export const AIRCRAFT_RAW = [
    {
        id: 1,
        code: "B703",
        aerodrome_reference_code: "D",
        wingspan: 44.42,
        length: 46.61,
        allocate_stands: 1,
        is_business_aviation: 0,
    },
];

export const WELCOME_MESSAGE = { message: "Welcome to the UK Controller Plugin API" };

export const SRD_ROUTES_RAW = [
    { minimum_level: 6500, maximum_level: 7500, route_string: "DCT ACORN DCT BIG", notes: [] },
];

export const LATEST_VERSION_RAW = {
    id: 147,
    version: "5.19.1",
    updater_download_url:
        "https://github.com/VATSIM-UK/uk-controller-plugin/releases/download/5.19.1/UKControllerPluginUpdater.dll",
    core_download_url:
        "https://github.com/VATSIM-UK/uk-controller-plugin/releases/download/5.19.1/UKControllerPluginCore.dll",
    loader_download_url:
        "https://github.com/VATSIM-UK/uk-controller-plugin/releases/download/5.19.1/UKControllerPlugin.dll",
};

export const VERSION_5191_RAW = { ...LATEST_VERSION_RAW };
