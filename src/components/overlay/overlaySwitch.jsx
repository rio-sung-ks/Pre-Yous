import React from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';
import { useCameraStore } from '../../store/useCameraStore';

export default function OverlaySwitch() {
  const isOverlaySwitchOn = useCameraStore((state) => state.isOverlaySwitchOn);
  const setIsOverlaySwitch = useCameraStore(
    (state) => state.setIsOverlaySwitch,
  );

  return (
    <View style={styles.overlay}>
      <Text style={styles.label}>{isOverlaySwitchOn ? 'ON' : 'OFF'}</Text>
      <Switch
        value={isOverlaySwitchOn}
        onValueChange={setIsOverlaySwitch}
        thumbColor='#FFF'
        trackColor={{ true: '#3fc85a', false: '#888' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 15,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 4,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
    transform: [{ scale: 0.9 }],
  },
  label: {
    color: '#FFF',
    marginRight: 8,
    fontWeight: 'bold',
  },
});
