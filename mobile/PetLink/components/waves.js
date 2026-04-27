import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

export function TopWave() {
    return (
        <Svg width={width} height={220} viewBox={`0 0 ${width} 220`} style={styles.waveTop}>
            <Path
                d={`M0,0 L${width},0 L${width},140 C${width * 0.75},220 ${width * 0.25},220 0,140 Z`}
                fill="#F4A261"
            />
        </Svg>
    );
}

export function BottomWave() {
    return (
        <Svg width={width} height={220} viewBox={`0 0 ${width} 220`} style={styles.waveBottom}>
            <Path
                d={`M0,220 L${width},220 L${width},80 C${width * 0.75},0 ${width * 0.25},0 0,80 Z`}
                fill="#E9C46A"
            />
        </Svg>
    );
}

const styles = StyleSheet.create({
    waveTop: { position: 'absolute', top: 0, left: 0 },
    waveBottom: { position: 'absolute', bottom: 0, left: 0 },
});