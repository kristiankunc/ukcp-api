import { describe, it, expect, beforeEach } from "vitest";
import {
    Airfield,
    ControllerPosition,
    Hold,
    Navaid,
    Metar,
    Sid,
    Handoff,
    Prenote,
    Stand,
    StandAssignment,
    ProximityHold,
    WakeCategoryScheme,
    RegionalPressure,
    FlightRule,
    AltimeterSettingRegion,
    EnrouteReleaseType,
    WakeCategory,
    VersionDetail,
    SrdRoute,
} from "../src/models";
import type { UkcpData } from "../src/data";
import * as fixtures from "./fixtures";

function createMockData(): UkcpData {
    const mock: Record<string, unknown> = {};
    const ctx = () => mock as unknown as UkcpData;

    Object.assign(mock, {
        getAirfieldByCode: (code: string) => {
            const raw = fixtures.AIRFIELDS_RAW.find((a) => a.code === code.toUpperCase());
            return raw ? new Airfield(raw, ctx()) : undefined;
        },
        getAirfieldById: (id: number) => {
            const raw = fixtures.AIRFIELDS_RAW.find((a) => a.id === id);
            return raw ? new Airfield(raw, ctx()) : undefined;
        },
        getControllerById: (id: number) => {
            const raw = fixtures.CONTROLLERS_V2_RAW.find((c) => c.id === id);
            return raw ? new ControllerPosition(raw, ctx()) : undefined;
        },
        getHoldById: (id: number) => {
            const raw = fixtures.HOLDS_RAW.find((h) => h.id === id);
            return raw ? new Hold(raw, ctx()) : undefined;
        },
        getNavaidById: (id: number) => {
            const raw = fixtures.NAVAIDS_RAW.find((n) => n.id === id);
            return raw ? new Navaid(raw, ctx()) : undefined;
        },
        getHandoffById: (id: number) => {
            const raw = fixtures.HANDOFFS_RAW.find((h) => h.id === id);
            return raw ? new Handoff(raw, ctx()) : undefined;
        },
        getPrenoteById: (id: number) => {
            const raw = fixtures.PRENOTES_RAW.find((p) => p.id === id);
            return raw ? new Prenote(raw, ctx()) : undefined;
        },
        getWakeSchemeById: (id: number) => {
            const raw = fixtures.WAKE_SCHEMES_RAW.find((w) => w.id === id);
            return raw ? new WakeCategoryScheme(raw, ctx()) : undefined;
        },
        getStandsForAirfield: (code: string) => {
            const rawStands = (fixtures.STAND_DEP_RAW as Record<string, { id: number; identifier: string }[]>)[
                code.toUpperCase()
            ];
            if (!rawStands) return [];
            return rawStands.map((r) => new Stand(r, code.toUpperCase(), ctx()));
        },
        getStandById: (id: number) => {
            for (const [code, stands] of Object.entries(fixtures.STAND_DEP_RAW)) {
                const found = stands.find((s) => s.id === id);
                if (found) return new Stand(found, code, ctx());
            }
            return undefined;
        },
        get allAirfields() {
            return fixtures.AIRFIELDS_RAW.map((a) => new Airfield(a, ctx()));
        },
        get allHolds() {
            return fixtures.HOLDS_RAW.map((h) => new Hold(h, ctx()));
        },
        get allHandoffs() {
            return fixtures.HANDOFFS_RAW.map((h) => new Handoff(h, ctx()));
        },
        get allPrenotes() {
            return fixtures.PRENOTES_RAW.map((p) => new Prenote(p, ctx()));
        },
        get allSids() {
            return fixtures.SIDS_RAW.map((s) => new Sid(s, ctx()));
        },
        get allMetars() {
            return fixtures.METARS_RAW.map((m) => new Metar(m, ctx()));
        },
        get allProximityHolds() {
            return fixtures.PROXIMITY_HOLDS_RAW.map((p) => new ProximityHold(p, ctx()));
        },
        get allStandAssignments() {
            return fixtures.STAND_ASSIGN_RAW.map((s) => new StandAssignment(s, ctx()));
        },
        get allControllers() {
            return fixtures.CONTROLLERS_V2_RAW.map((c) => new ControllerPosition(c, ctx()));
        },
        get allNavaids() {
            return fixtures.NAVAIDS_RAW.map((n) => new Navaid(n, ctx()));
        },
        get allWakeSchemes() {
            return fixtures.WAKE_SCHEMES_RAW.map((w) => new WakeCategoryScheme(w, ctx()));
        },
        getMslForAirfield: (code: string) =>
            fixtures.MSL_RAW.airfield[code.toUpperCase() as keyof typeof fixtures.MSL_RAW.airfield],
        get flightRules() {
            return fixtures.FLIGHT_RULES_RAW.map((r) => new FlightRule(r));
        },
        get regionalPressure() {
            return new RegionalPressure(fixtures.REGIONAL_PRESSURE_RAW);
        },
        get altimeterSettingRegions() {
            return fixtures.ALTIMETER_REGIONS_RAW.map((r) => new AltimeterSettingRegion(r));
        },
        get enrouteReleaseTypes() {
            return fixtures.RELEASE_TYPES_RAW.map((r) => new EnrouteReleaseType(r));
        },
        get wakeCategories() {
            return fixtures.WAKE_CATEGORIES_RAW.map((c) => new WakeCategory(c));
        },
    });

    return mock as unknown as UkcpData;
}

// ══════════════════════════════════════════
//  Airfield
// ══════════════════════════════════════════

describe("Airfield", () => {
    let gk: Airfield;
    let data: UkcpData;

    beforeEach(() => {
        data = createMockData();
        gk = new Airfield(fixtures.EGKK_RAW, data);
    });

    it("exposes raw data through getters", () => {
        expect(gk.id).toBe(1);
        expect(gk.code).toBe("EGKK");
        expect(gk.elevation).toBe(203);
        expect(gk.transitionAltitude).toBe(6000);
        expect(gk.standardHigh).toBe(1);
        expect(gk.wakeCategorySchemeId).toBe(1);
        expect(gk.handoffId).toBe(65);
    });

    it("get controllers returns ControllerPosition[]", () => {
        const ctrls = gk.controllers;
        // Only 4 of the 13 controller IDs in the fixture have matching mock controllers
        expect(ctrls.length).toBeGreaterThanOrEqual(4);
        expect(ctrls[0]).toBeInstanceOf(ControllerPosition);
        expect(ctrls[0].callsign).toBe("EGKK_DEL");
    });

    it("get handoff returns the correct Handoff", () => {
        const h = gk.handoff;
        expect(h).toBeInstanceOf(Handoff);
        expect(h?.id).toBe(65);
    });

    it("get wakeScheme returns the correct WakeCategoryScheme", () => {
        const ws = gk.wakeScheme;
        expect(ws).toBeInstanceOf(WakeCategoryScheme);
        expect(ws?.key).toBe("UK");
    });

    it("get metar returns the matching METAR for this airfield", () => {
        const metar = gk.metar;
        expect(metar).toBeInstanceOf(Metar);
        expect(metar?.raw).toContain("EGKK");
        expect(metar?.parsed.qnh).toBe(1019);
    });

    it("get metar returns undefined for airfield without METAR", () => {
        const isolatedAf = new Airfield({ ...fixtures.EGKK_RAW, id: 999, code: "XXXX" }, data);
        expect(isolatedAf.metar).toBeUndefined();
    });

    it("get stands returns Stand[] for this airfield", () => {
        const stands = gk.stands;
        expect(stands).toHaveLength(3);
        expect(stands[0]).toBeInstanceOf(Stand);
        expect(stands[0].identifier).toBe("1");
        expect(stands[0].airfieldCode).toBe("EGKK");
    });

    it("get sids returns Sid[] matching this airfield code", () => {
        const sids = gk.sids;
        expect(sids.length).toBeGreaterThanOrEqual(2);
        expect(sids[0]).toBeInstanceOf(Sid);
        expect(sids[0].airfieldCode).toBe("EGKK");
    });

    it("get holds returns holds with restrictions targeting this airfield", () => {
        const holds = gk.holds;
        expect(holds).toHaveLength(2);
        expect(holds[0].fix).toBe("WILLO");
        expect(holds[1].fix).toBe("TIMBA");
    });

    it("get msl returns the minimum stack level", () => {
        expect(gk.msl).toBe(7000);
    });

    it("get msl returns undefined for unknown airfield", () => {
        const unknownAf = new Airfield({ ...fixtures.EGKK_RAW, code: "XXXX" }, data);
        expect(unknownAf.msl).toBeUndefined();
    });

    it("get pairingPrenotes returns a copy of the pairing-prenotes map", () => {
        const pp = gk.pairingPrenotes;
        expect(pp["2"]).toEqual([1, 8]);
        expect(pp["3"]).toEqual([6, 7]);
        expect(pp).not.toBe(fixtures.EGKK_RAW["pairing-prenotes"]);
    });

    it("handoff returns undefined for non-existent handoff", () => {
        const orphanAf = new Airfield({ ...fixtures.EGKK_RAW, handoff_id: 9999 }, data);
        expect(orphanAf.handoff).toBeUndefined();
    });

    it("wakeScheme returns undefined for non-existent scheme", () => {
        const orphanAf = new Airfield({ ...fixtures.EGKK_RAW, wake_category_scheme_id: 9999 }, data);
        expect(orphanAf.wakeScheme).toBeUndefined();
    });
});

// ══════════════════════════════════════════
//  ControllerPosition
// ══════════════════════════════════════════

describe("ControllerPosition", () => {
    let ctrl: ControllerPosition;
    let data: UkcpData;

    beforeEach(() => {
        data = createMockData();
        ctrl = new ControllerPosition(fixtures.CONTROLLERS_V2_RAW[2], data);
    });

    it("exposes raw data through getters", () => {
        expect(ctrl.id).toBe(75);
        expect(ctrl.callsign).toBe("EGKK_F_APP");
        expect(ctrl.frequency).toBe(118.95);
        expect(ctrl.topDownCodes).toEqual(["EGKK", "EGKR"]);
        expect(ctrl.requestsDepartureReleases).toBe(true);
        expect(ctrl.receivesPrenotes).toBe(true);
    });

    it("get topDownAirfields returns Airfield[]", () => {
        const airfields = ctrl.topDownAirfields;
        expect(airfields.length).toBeGreaterThanOrEqual(1);
        expect(airfields[0]).toBeInstanceOf(Airfield);
        expect(airfields[0].code).toBe("EGKK");
    });

    it("get handoffs returns Handoff[] that include this controller", () => {
        const hfs = ctrl.handoffs;
        expect(hfs.length).toBeGreaterThanOrEqual(1);
        expect(hfs[0]).toBeInstanceOf(Handoff);
        expect(hfs[0].controllerIds).toContain(75);
    });

    it("get prenotes returns Prenote[] that include this controller", () => {
        const pns = ctrl.prenotes;
        expect(pns.length).toBeGreaterThanOrEqual(1);
        expect(pns[0]).toBeInstanceOf(Prenote);
        expect(pns[0].controllerIds).toContain(75);
    });

    it("get assignedAirfields returns airfields listing this controller ID", () => {
        const afs = ctrl.assignedAirfields;
        expect(afs.length).toBeGreaterThanOrEqual(1);
        expect(afs[0].controllerIds).toContain(75);
    });
});

// ══════════════════════════════════════════
//  Hold
// ══════════════════════════════════════════

describe("Hold", () => {
    let hold: Hold;
    let data: UkcpData;

    beforeEach(() => {
        data = createMockData();
        hold = new Hold(fixtures.HOLDS_RAW[0], data);
    });

    it("exposes raw data through getters", () => {
        expect(hold.id).toBe(1);
        expect(hold.navaidId).toBe(1);
        expect(hold.inboundHeading).toBe(283);
        expect(hold.minimumAltitude).toBe(7000);
        expect(hold.maximumAltitude).toBe(15000);
        expect(hold.turnDirection).toBe("left");
        expect(hold.outboundLegValue).toBe(5.1);
        expect(hold.outboundLegUnit).toBe("nm");
        expect(hold.description).toBe("WILLO");
        expect(hold.fix).toBe("WILLO");
    });

    it("get navaid returns the associated Navaid", () => {
        const n = hold.navaid;
        expect(n).toBeInstanceOf(Navaid);
        expect(n?.identifier).toBe("WILLO");
    });

    it("get navaid returns undefined for missing navaid", () => {
        const orphanHold = new Hold({ ...fixtures.HOLDS_RAW[0], navaid_id: 9999 }, data);
        expect(orphanHold.navaid).toBeUndefined();
    });

    it("get deemedSeparatedHolds returns Hold[]", () => {
        const sep = hold.deemedSeparatedHolds;
        expect(sep).toHaveLength(1);
        expect(sep[0]).toBeInstanceOf(Hold);
        expect(sep[0].fix).toBe("TIMBA");
    });

    it("get restrictionAirfields returns Airfield[]", () => {
        const afs = hold.restrictionAirfields;
        expect(afs).toHaveLength(1);
        expect(afs[0]).toBeInstanceOf(Airfield);
        expect(afs[0].code).toBe("EGKK");
    });
});

// ══════════════════════════════════════════
//  Navaid
// ══════════════════════════════════════════

describe("Navaid", () => {
    let navaid: Navaid;
    let data: UkcpData;

    beforeEach(() => {
        data = createMockData();
        navaid = new Navaid(fixtures.NAVAIDS_RAW[0], data);
    });

    it("exposes raw data through getters", () => {
        expect(navaid.id).toBe(1);
        expect(navaid.identifier).toBe("WILLO");
        expect(navaid.latitude).toBe("N050.59.06.000");
        expect(navaid.longitude).toBe("W000.11.30.000");
    });

    it("get holds returns holds referencing this navaid", () => {
        const holds = navaid.holds;
        expect(holds).toHaveLength(1);
        expect(holds[0].fix).toBe("WILLO");
    });

    it("get proximityHolds returns proximity holds at this navaid", () => {
        const phs = navaid.proximityHolds;
        expect(phs).toHaveLength(1);
        expect(phs[0].callsign).toBe("BCS2212");
    });
});

// ══════════════════════════════════════════
//  Metar
// ══════════════════════════════════════════

describe("Metar", () => {
    let metar: Metar;
    let data: UkcpData;

    beforeEach(() => {
        data = createMockData();
        metar = new Metar(fixtures.METARS_RAW[0], data);
    });

    it("exposes raw data through getters", () => {
        expect(metar.airfieldId).toBe(1);
        expect(metar.raw).toContain("EGKK");
    });

    it("get parsed returns the parsed METAR data", () => {
        expect(metar.parsed.qnh).toBe(1019);
        expect(metar.parsed.wind_speed).toBe("14");
        expect(metar.parsed.wind_direction).toBe("230");
    });

    it("get airfield returns the associated Airfield", () => {
        const af = metar.airfield;
        expect(af).toBeInstanceOf(Airfield);
        expect(af?.code).toBe("EGKK");
    });

    it("get airfield returns undefined for unknown airfield_id", () => {
        const orphanMetar = new Metar({ ...fixtures.METARS_RAW[0], airfield_id: 9999 }, data);
        expect(orphanMetar.airfield).toBeUndefined();
    });
});

// ══════════════════════════════════════════
//  Sid
// ══════════════════════════════════════════

describe("Sid", () => {
    let sid: Sid;
    let data: UkcpData;

    beforeEach(() => {
        data = createMockData();
        sid = new Sid(fixtures.SIDS_RAW[1], data);
    });

    it("exposes raw data through getters", () => {
        expect(sid.id).toBe(395);
        expect(sid.airfieldCode).toBe("EGKK");
        expect(sid.runwayId).toBe(127);
        expect(sid.identifier).toBe("BIG");
        expect(sid.initialAltitude).toBe(6000);
        expect(sid.initialHeading).toBe(90);
    });

    it("get handoff returns the associated Handoff", () => {
        const h = sid.handoff;
        expect(h).toBeInstanceOf(Handoff);
        expect(h?.id).toBe(2);
    });

    it("get handoff returns undefined when handoff is null", () => {
        const sidNoHandoff = new Sid({ ...fixtures.SIDS_RAW[1], handoff: null }, data);
        expect(sidNoHandoff.handoff).toBeUndefined();
    });

    it("get airfield returns the Airfield", () => {
        const af = sid.airfield;
        expect(af).toBeInstanceOf(Airfield);
        expect(af?.code).toBe("EGKK");
    });

    it("get prenotes returns associated Prenote[]", () => {
        const pns = sid.prenotes;
        expect(pns).toHaveLength(2);
        expect(pns[0]).toBeInstanceOf(Prenote);
        expect(pns[0].id).toBe(1);
        expect(pns[1].id).toBe(8);
    });

    it("get prenotes returns [] when no prenotes", () => {
        const sidNoPrenotes = new Sid(fixtures.SIDS_RAW[0], data);
        expect(sidNoPrenotes.prenotes).toHaveLength(0);
    });
});

// ══════════════════════════════════════════
//  Handoff
// ══════════════════════════════════════════

describe("Handoff", () => {
    let handoff: Handoff;
    let data: UkcpData;

    beforeEach(() => {
        data = createMockData();
        handoff = new Handoff({ id: 65, controller_positions: [236, 238, 227, 328, 220, 224, 223, 218, 73] }, data);
    });

    it("exposes raw data through getters", () => {
        expect(handoff.id).toBe(65);
        expect(handoff.controllerIds).toEqual([236, 238, 227, 328, 220, 224, 223, 218, 73]);
    });

    it("get controllers returns ControllerPosition[]", () => {
        const ctrls = handoff.controllers;
        expect(ctrls.length).toBeGreaterThanOrEqual(1);
        expect(ctrls[0]).toBeInstanceOf(ControllerPosition);
    });

    it("get airfields returns Airfield[] using this handoff", () => {
        const afs = handoff.airfields;
        expect(afs).toHaveLength(1);
        expect(afs[0].code).toBe("EGKK");
    });

    it("get sids returns Sid[] referencing this handoff", () => {
        const sids = handoff.sids;
        expect(sids).toHaveLength(0);
    });
});

// ══════════════════════════════════════════
//  Prenote
// ══════════════════════════════════════════

describe("Prenote", () => {
    let prenote: Prenote;
    let data: UkcpData;

    beforeEach(() => {
        data = createMockData();
        prenote = new Prenote(fixtures.PRENOTES_RAW[0], data);
    });

    it("exposes raw data through getters", () => {
        expect(prenote.id).toBe(1);
        expect(prenote.description).toContain("Gatwick");
    });

    it("get controllers returns ControllerPosition[]", () => {
        const ctrls = prenote.controllers;
        expect(ctrls.length).toBeGreaterThanOrEqual(1);
        expect(ctrls[0]).toBeInstanceOf(ControllerPosition);
    });

    it("get sids returns Sid[] referencing this prenote", () => {
        const sids = prenote.sids;
        expect(sids).toHaveLength(1);
        expect(sids[0].identifier).toBe("BIG");
    });
});

// ══════════════════════════════════════════
//  Stand
// ══════════════════════════════════════════

describe("Stand", () => {
    let stand: Stand;
    let data: UkcpData;

    beforeEach(() => {
        data = createMockData();
        stand = new Stand(fixtures.STAND_DEP_RAW.EGKK[0], "EGKK", data);
    });

    it("exposes raw data through getters", () => {
        expect(stand.id).toBe(461);
        expect(stand.identifier).toBe("1");
        expect(stand.airfieldCode).toBe("EGKK");
    });

    it("get airfield returns the Airfield", () => {
        expect(stand.airfield?.code).toBe("EGKK");
    });

    it("get assignment returns the matching StandAssignment", () => {
        const a = stand.assignment;
        expect(a).toBeInstanceOf(StandAssignment);
        expect(a?.callsign).toBe("BAW2067");
    });

    it("get assignment returns undefined for unoccupied stand", () => {
        const emptyStand = new Stand(fixtures.STAND_DEP_RAW.EGKK[1], "EGKK", data);
        expect(emptyStand.assignment).toBeUndefined();
    });
});

// ══════════════════════════════════════════
//  StandAssignment
// ══════════════════════════════════════════

describe("StandAssignment", () => {
    let assignment: StandAssignment;
    let data: UkcpData;

    beforeEach(() => {
        data = createMockData();
        assignment = new StandAssignment(fixtures.STAND_ASSIGN_RAW[0], data);
    });

    it("exposes raw data through getters", () => {
        expect(assignment.callsign).toBe("BAW2067");
        expect(assignment.standId).toBe(461);
        expect(assignment.source).toBe("system_auto");
    });

    it("get stand returns the Stand", () => {
        const s = assignment.stand;
        expect(s).toBeInstanceOf(Stand);
        expect(s?.identifier).toBe("1");
    });
});

// ══════════════════════════════════════════
//  ProximityHold
// ══════════════════════════════════════════

describe("ProximityHold", () => {
    let ph: ProximityHold;
    let data: UkcpData;

    beforeEach(() => {
        data = createMockData();
        ph = new ProximityHold(fixtures.PROXIMITY_HOLDS_RAW[0], data);
    });

    it("exposes raw data through getters", () => {
        expect(ph.callsign).toBe("BCS2212");
        expect(ph.navaidId).toBe(1);
    });

    it("get navaid returns the Navaid", () => {
        expect(ph.navaid?.identifier).toBe("WILLO");
    });
});

// ══════════════════════════════════════════
//  WakeCategoryScheme
// ══════════════════════════════════════════

describe("WakeCategoryScheme", () => {
    let scheme: WakeCategoryScheme;
    let data: UkcpData;

    beforeEach(() => {
        data = createMockData();
        scheme = new WakeCategoryScheme(fixtures.WAKE_SCHEMES_RAW[0], data);
    });

    it("exposes raw data through getters", () => {
        expect(scheme.id).toBe(1);
        expect(scheme.key).toBe("UK");
        expect(scheme.name).toBe("UK");
    });

    it("get categories returns WakeCategory[]", () => {
        const cats = scheme.categories;
        expect(cats).toHaveLength(2);
        expect(cats[0]).toBeInstanceOf(WakeCategory);
        expect(cats[0].code).toBe("L");
        expect(cats[1].code).toBe("S");
    });

    it("get airfields returns airfields using this scheme", () => {
        const afs = scheme.airfields;
        expect(afs).toHaveLength(1);
        expect(afs[0].code).toBe("EGKK");
    });
});

// ══════════════════════════════════════════
//  Value Objects
// ══════════════════════════════════════════

describe("WakeCategory (value object)", () => {
    it("exposes raw data through getters", () => {
        const cat = new WakeCategory(fixtures.WAKE_CATEGORIES_RAW[0]);
        expect(cat.id).toBe(1);
        expect(cat.code).toBe("L");
        expect(cat.description).toBe("Light");
        expect(cat.relativeWeighting).toBe(0);
        expect(cat.subsequentDepartureIntervals).toEqual([]);
        expect(cat.subsequentArrivalIntervals).toEqual([]);
    });
});

describe("FlightRule (value object)", () => {
    it("exposes raw data through getters", () => {
        const rule = new FlightRule(fixtures.FLIGHT_RULES_RAW[0]);
        expect(rule.id).toBe(1);
        expect(rule.euroscopeKey).toBe("V");
        expect(rule.description).toBe("VFR");
    });
});

describe("RegionalPressure (value object)", () => {
    it("exposes typed convenience getters", () => {
        const rp = new RegionalPressure(fixtures.REGIONAL_PRESSURE_RAW);
        expect(rp.london).toBe(1018);
        expect(rp.manchester).toBe(1017);
        expect(rp.scottish).toBe(1012);
    });

    it("get(key) returns value by key", () => {
        const rp = new RegionalPressure(fixtures.REGIONAL_PRESSURE_RAW);
        expect(rp.get("ASR_LONDON")).toBe(1018);
        expect(rp.get("NONEXISTENT")).toBeUndefined();
    });

    it("entries() returns all key-value pairs", () => {
        const rp = new RegionalPressure(fixtures.REGIONAL_PRESSURE_RAW);
        expect(rp.entries()).toHaveLength(3);
    });
});

describe("AltimeterSettingRegion (value object)", () => {
    it("exposes raw data through getters", () => {
        const asr = new AltimeterSettingRegion(fixtures.ALTIMETER_REGIONS_RAW[0]);
        expect(asr.id).toBe(1);
        expect(asr.key).toBe("ASR_LONDON");
        expect(asr.name).toBe("London");
        expect(asr.adjustment).toBe(0);
    });
});

describe("EnrouteReleaseType (value object)", () => {
    it("exposes raw data through getters", () => {
        const rt = new EnrouteReleaseType(fixtures.RELEASE_TYPES_RAW[0]);
        expect(rt.id).toBe(1);
        expect(rt.tagString).toBe("C");
        expect(rt.description).toBe("Climb");
    });
});

describe("VersionDetail (value object)", () => {
    it("exposes raw data through getters", () => {
        const v = new VersionDetail(fixtures.LATEST_VERSION_RAW);
        expect(v.version).toBe("5.19.1");
        expect(v.updaterDownloadUrl).toContain("Updater");
    });
});

describe("SrdRoute (value object)", () => {
    it("exposes raw data through getters", () => {
        const route = new SrdRoute(fixtures.SRD_ROUTES_RAW[0]);
        expect(route.minimumLevel).toBe(6500);
        expect(route.maximumLevel).toBe(7500);
        expect(route.routeString).toContain("ACORN");
        expect(route.notes).toEqual([]);
    });
});
