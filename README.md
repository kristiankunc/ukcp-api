# UKCP API

TypeScript wrapper for the [VATSIM UK Controller Plugin](https://ukcp.vatsim.uk/api/documentation) public API.

## Install

```bash
npm install ukcp-api
```

Requires Node 18+ (native `fetch`).

## Usage

```typescript
import { UkcpApi, UkcpData } from "ukcp-api";

// 1. Create the client
const api = new UkcpApi();

// 2. Fetch everything and navigate objects
const data = await UkcpData.create(api);

// Look up an airfield
const gatwick = data.getAirfieldByCode("EGKK");

// Navigate to controllers
for (const c of gatwick.controllers) {
    console.log(c.callsign, c.frequency);
}

// Get current weather
console.log(gatwick.metar?.parsed.qnh);

// Check stands
for (const stand of gatwick.stands) {
    const a = stand.assignment;
    if (a) console.log(`${stand.identifier} - ${a.callsign}`);
}

// Bi-directional: find what a controller covers
const ctrl = data.getControllerById(75);
console.log(ctrl?.topDownAirfields.map((a) => a.code));

// Search routes
const routes = await data.searchSrdRoutes({ origin: "EGKK", destination: "EGLL" });
console.log(routes[0].routeString);
```

Or use the low-level client directly:

```typescript
import { UkcpApi } from "ukcp-api";

const api = new UkcpApi();
const controllers = await api.getControllerPositionsV2();
const metars = await api.getMetars();
const latest = await api.getLatestVersion();
```

## API

### `UkcpApi` - low-level HTTP client

Each public endpoint has a dedicated method. All return raw JSON types.

| Method                       | Endpoint                                                          |
| ---------------------------- | ----------------------------------------------------------------- |
| `getAirfields()`             | `GET /airfield`                                                   |
| `getControllers()`           | `GET /controller`                                                 |
| `getControllerPositionsV2()` | `GET /controller-positions-v2`                                    |
| `getHolds()`                 | `GET /hold`                                                       |
| `getMetars()`                | `GET /metar`                                                      |
| `getSids()`                  | `GET /sid/dependency`                                             |
| … and 25+ more               | See [api documentation](https://ukcp.vatsim.uk/api/documentation) |

### `UkcpData` - object registry

`UkcpData.create(api)` fetches all collections in parallel and indexes them. Returns domain objects with synchronous navigation:

```
Airfield
  .controllers  -  ControllerPosition[]
  .handoff      -  Handoff
  .metar        -  Metar
  .stands       -  Stand[]
  .sids         -  Sid[]
  .holds        -  Hold[]
  .msl          -  number

ControllerPosition
  .topDownAirfields  -  Airfield[]
  .handoffs          -  Handoff[]
  .prenotes          -  Prenote[]

Hold
  .navaid                -  Navaid
  .deemedSeparatedHolds  -  Hold[]
  .restrictionAirfields  -  Airfield[]
```

## Development

```bash
npm test          # run tests
npm run test:watch
npm run build     # compile TypeScript
```

## License

[MIT](LICENSE)
