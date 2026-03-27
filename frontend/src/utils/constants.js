export const SEVERITY_COLORS = {
  CRITICAL: { bg: '#FEE2E2', text: '#DC2626', border: '#DC2626', mapColor: '#DC2626', scale: 16 },
  HIGH: { bg: '#FFEDD5', text: '#EA580C', border: '#EA580C', mapColor: '#EA580C', scale: 13 },
  MEDIUM: { bg: '#FEF3C7', text: '#D97706', border: '#D97706', mapColor: '#D97706', scale: 11 },
  LOW: { bg: '#DCFCE7', text: '#16A34A', border: '#16A34A', mapColor: '#16A34A', scale: 9 },
};

export const AGENCY_COLORS = {
  MEDICAL: { color: '#2563EB', bg: '#DBEAFE', label: 'Hospital Services' },
  HOSPITAL: { color: '#2563EB', bg: '#DBEAFE', label: 'Hospital Services' },
  POLICE: { color: '#D97706', bg: '#FEF3C7', label: 'Police Services' },
  FIRE: { color: '#DC2626', bg: '#FEE2E2', label: 'Fire Services' },
};

export const ROLE_TO_AGENCY = {
  HOSPITAL_ADMIN: 'MEDICAL',
  POLICE_ADMIN: 'POLICE',
  FIRE_ADMIN: 'FIRE',
};

export const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  HOSPITAL_ADMIN: 'Hospital Admin',
  POLICE_ADMIN: 'Police Admin',
  FIRE_ADMIN: 'Fire Admin',
};

export const INCIDENT_TYPES = ['MEDICAL', 'POLICE', 'FIRE'];

export const INCIDENT_STATUSES = ['REPORTED', 'ASSIGNED', 'EN_ROUTE', 'RESOLVED'];

export const VEHICLE_STATUSES = ['AVAILABLE', 'EN_ROUTE', 'ON_SCENE', 'RETURNING'];

export const VEHICLE_TYPE_TO_ICON = {
  AMBULANCE: '/icons/ambulance.svg',
  FIRE_TRUCK: '/icons/firetruck.svg',
  POLICE_CAR: '/icons/police.svg',
};

export const SEVERITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const STATUS_COLORS = {
  REPORTED: { bg: '#EFF6FF', text: '#2563EB' },
  ASSIGNED: { bg: '#FEF3C7', text: '#D97706' },
  EN_ROUTE: { bg: '#FFEDD5', text: '#EA580C' },
  RESOLVED: { bg: '#DCFCE7', text: '#16A34A' },
  AVAILABLE: { bg: '#DCFCE7', text: '#16A34A' },
  ON_SCENE: { bg: '#FEE2E2', text: '#DC2626' },
  RETURNING: { bg: '#F3E8FF', text: '#7C3AED' },
  ACTIVE: { bg: '#FEE2E2', text: '#DC2626' },
  INACTIVE: { bg: '#F3F4F6', text: '#6B7280' },
};

export const GHANA_CENTER = { lat: 7.9465, lng: -1.0232 };
export const DEFAULT_ZOOM = 7;

export const WS_BASE_URL = process.env.REACT_APP_DISPATCH_URL
  ? process.env.REACT_APP_DISPATCH_URL.replace('http://', 'ws://').replace('https://', 'wss://')
  : 'ws://localhost:8083';

export const AGENCY_NAMES = {
  MEDICAL: 'Hospital Services',
  POLICE: 'Police Services',
  FIRE: 'Fire Services',
};
