export const SEVERITY_COLORS = {
  CRITICAL: {
    bg: "rgba(232,66,66,0.15)",
    text: "#e84242",
    border: "#e84242",
    mapColor: "#e84242",
    scale: 16,
  },
  HIGH: {
    bg: "rgba(232,98,42,0.15)",
    text: "#e8622a",
    border: "#e8622a",
    mapColor: "#e8622a",
    scale: 13,
  },
  MEDIUM: {
    bg: "rgba(232,168,42,0.15)",
    text: "#e8a82a",
    border: "#e8a82a",
    mapColor: "#e8a82a",
    scale: 11,
  },
  LOW: {
    bg: "rgba(76,175,110,0.15)",
    text: "#4caf6e",
    border: "#4caf6e",
    mapColor: "#4caf6e",
    scale: 9,
  },
};

export const AGENCY_COLORS = {
  MEDICAL: {
    color: "#4a9ee8",
    bg: "rgba(74,158,232,0.15)",
    label: "Hospital Services",
  },
  HOSPITAL: {
    color: "#4a9ee8",
    bg: "rgba(74,158,232,0.15)",
    label: "Hospital Services",
  },
  POLICE: {
    color: "#e8a82a",
    bg: "rgba(232,168,42,0.15)",
    label: "Police Services",
  },
  FIRE: {
    color: "#e84242",
    bg: "rgba(232,66,66,0.15)",
    label: "Fire Services",
  },
};

export const ROLE_TO_AGENCY = {
  HOSPITAL_ADMIN: "MEDICAL",
  POLICE_ADMIN: "POLICE",
  FIRE_ADMIN: "FIRE",
};

export const ROLE_LABELS = {
  SUPER_ADMIN: "Super Admin",
  HOSPITAL_ADMIN: "Hospital Admin",
  POLICE_ADMIN: "Police Admin",
  FIRE_ADMIN: "Fire Admin",
};

export const INCIDENT_TYPES = ["MEDICAL", "POLICE", "FIRE"];

export const INCIDENT_STATUSES = [
  "REPORTED",
  "ASSIGNED",
  "EN_ROUTE",
  "RESOLVED",
];

export const VEHICLE_STATUSES = [
  "AVAILABLE",
  "EN_ROUTE",
  "ON_SCENE",
  "RETURNING",
  "OFFLINE",
  "MAINTENANCE",
];

export const VEHICLE_TYPE_TO_ICON = {
  AMBULANCE: "/icons/ambulance.svg",
  FIRE_TRUCK: "/icons/firetruck.svg",
  POLICE_CAR: "/icons/police.svg",
};

export const SEVERITY_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export const STATUS_COLORS = {
  REPORTED: { bg: "rgba(232,168,42,0.15)", text: "#e8a82a" },
  ASSIGNED: { bg: "rgba(232,168,42,0.15)", text: "#e8a82a" },
  EN_ROUTE: { bg: "rgba(74,158,232,0.15)", text: "#4a9ee8" },
  RESOLVED: { bg: "rgba(76,175,110,0.15)", text: "#4caf6e" },
  AVAILABLE: { bg: "rgba(76,175,110,0.15)", text: "#4caf6e" },
  ON_SCENE: { bg: "rgba(232,66,66,0.15)", text: "#e84242" },
  RETURNING: { bg: "rgba(74,158,232,0.15)", text: "#4a9ee8" },
  ACTIVE: { bg: "rgba(74,158,232,0.15)", text: "#4a9ee8" },
  INACTIVE: { bg: "rgba(90,90,84,0.2)", text: "#6b6860" },
};

// Ghana map configuration - center point and default zoom
export const GHANA_CENTER = { lat: 7.9, lng: -1.0 };
export const DEFAULT_ZOOM = 7;

// Ghana geographic bounds
export const GHANA_BOUNDS = {
  north: 11.2,
  south: 4.5,
  west: -3.5,
  east: 1.2,
};

export const WS_BASE_URL = process.env.REACT_APP_DISPATCH_URL
  ? process.env.REACT_APP_DISPATCH_URL.replace("http://", "ws://").replace(
      "https://",
      "wss://",
    )
  : "ws://localhost:8083";

export const AGENCY_NAMES = {
  MEDICAL: "Hospital Services",
  POLICE: "Police Services",
  FIRE: "Fire Services",
};
