# GhanaERS — National Emergency Response and Dispatch Coordination Platform

## Project Overview
University project for CPEN 421 at the University of Ghana. A React SPA communicating with a Spring Boot microservices backend. The platform coordinates emergency response across three agencies: Hospital/Medical, Police, and Fire.

## Tech Stack
- **Frontend**: React 18, CRA (react-scripts), JavaScript/JSX, Tailwind CSS, shadcn-style components
- **Maps**: @react-google-maps/api — LoadScript at App.jsx level, LIBRARIES const outside component
- **Charts**: Recharts
- **HTTP**: Axios with interceptors (Bearer token, auto-refresh on 401)
- **Real-time**: Native WebSocket (ws://localhost:8083/ws/vehicles/track?token=...)
- **State**: AuthContext + useReducer, local state for UI-only
- **Routing**: React Router v6

## Backend Services
| Service | Port | Status |
|---------|------|--------|
| auth-service | 8081 | Fully implemented |
| incident-service | 8082 | Skeleton only |
| dispatch-service | 8083 | Skeleton only |
| analytics-service | 8084 | Skeleton only |

## Environment Variables (frontend/.env)
```
REACT_APP_AUTH_URL=http://localhost:8081
REACT_APP_INCIDENT_URL=http://localhost:8082
REACT_APP_DISPATCH_URL=http://localhost:8083
REACT_APP_ANALYTICS_URL=http://localhost:8084
REACT_APP_GOOGLE_MAPS_KEY=your_key_here
```

## Authentication
- POST /auth/login → { accessToken, refreshToken }
- **accessToken**: stored IN MEMORY only (module var in axiosInstance.js) — NEVER localStorage
- **refreshToken**: stored in localStorage
- JWT payload: { sub, email, role, exp }
- On 401: auto-refresh → retry once → on second 401 → clear tokens + redirect /login
- Role routing after login:
  - SUPER_ADMIN → /admin/overview
  - HOSPITAL_ADMIN / POLICE_ADMIN / FIRE_ADMIN → /dashboard

## Roles & Agency Mapping
```
HOSPITAL_ADMIN → MEDICAL incidents, AMBULANCE vehicles, blue (#2563EB)
POLICE_ADMIN   → POLICE incidents, POLICE_CAR vehicles, amber (#D97706)
FIRE_ADMIN     → FIRE incidents, FIRE_TRUCK vehicles, red (#DC2626)
SUPER_ADMIN    → all agencies, super admin portal
```

## Design System
- Font: Inter (400, 500, 600 only)
- Background: #FFFFFF | Surface: #F8F9FA | Border: #E5E7EB
- Text: #111827 (primary), #6B7280 (secondary)
- Accent: #1D4ED8
- Cards: white bg, 1px #E5E7EB border, 8px radius, NO shadow
- NO gradients, NO zebra striping, NO colored large surfaces
- Severity: CRITICAL #DC2626, HIGH #EA580C, MEDIUM #D97706, LOW #16A34A

## Key Architectural Rules
1. **MapPanel NEVER unmounts** in AgencyShell — passes activeTab as prop
2. **WebSocket connects once** in AgencyShell, reconnects on disconnect (3s backoff, max 5 retries)
3. **No console.log in production** — use logger utility
4. **All API errors caught and displayed** — no silent failures
5. Min width: 1280px (ops tool, not mobile-first)

## File Structure
```
frontend/src/
  api/          axiosInstance.js, authApi.js, incidentApi.js, dispatchApi.js, analyticsApi.js
  components/
    common/     Button, Badge, Card, Table, Modal, Toast, Spinner, EmptyState
    map/        MapPanel, IncidentMarker, VehicleMarker, IncidentInfoWindow
    charts/     ResponseTimeChart, IncidentBarChart, AgencyPieChart, SparkLine
    layout/     AgencyShell, SuperAdminShell, Navbar, AgencySidebar, SuperAdminNav
  context/      AuthContext.jsx
  hooks/        useIncidents, useVehicles, useAnalytics, useUsers, useWebSocket
  pages/
    LoginPage.jsx
    agency/     IncidentsTab, DispatchTab, ReportTab, AnalyticsTab
    admin/      OverviewPage, UsersPage, AgenciesPage, MapPage, AnalyticsPage, AuditLogsPage
  utils/        jwtUtils.js, formatters.js, constants.js, logger.js
  App.jsx
```

## CORS Note
If CORS errors appear in dev, add to each Spring Boot SecurityConfig:
```java
.cors(cors -> cors.configurationSource(request -> {
  CorsConfiguration config = new CorsConfiguration();
  config.setAllowedOrigins(List.of("http://localhost:3000"));
  config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE"));
  config.setAllowedHeaders(List.of("*"));
  config.setAllowCredentials(true);
  return config;
}))
```
