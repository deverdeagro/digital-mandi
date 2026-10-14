# Digital Mandi

Digital Mandi is one React application with four role areas: farmer, spoke staff, hub staff, and buyer. All roles use the same authentication context, lot data, logo, lot tracker, and status chips; role-specific routes are guarded by `RoleRoute`.

## Run locally

```sh
npm install
npm run dev
```

The demo login accepts any account ID and a 4-digit PIN. Choose a role on the shared login screen to open that role's home page.

## Role routes

- `/farmer` and `/farmer/bids`
- `/spoke` and `/spoke/lots/:lotId/grade`
- `/hub`
- `/buyer`, `/buyer/lots/:lotId`, and `/buyer/lots/:lotId/bids`

Lot data is seeded in `src/services/lotService.ts` and shared for the current app session through `src/hooks/useLots.ts`. The Axios client in `src/services/api.ts` is ready for API-backed data.

## Checks

```sh
npm run build
npm run lint
```
