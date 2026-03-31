import React from 'react';
import { OverlayView } from '@react-google-maps/api';
import styles from './PulseOverlay.module.css';

export function PulseOverlay({ position, color }) {
  if (!position) return null;

  return (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <div className={styles.container} style={{ '--pulse-color': color }}>
        <div className={styles.ring} />
        <div className={styles.innerRing} />
      </div>
    </OverlayView>
  );
}

export default PulseOverlay;
