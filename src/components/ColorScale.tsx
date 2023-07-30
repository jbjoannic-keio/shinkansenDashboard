import React from 'react';

import { observer } from 'mobx-react-lite';

import { shinkansenStore } from '../stores/shinkansen';
import { interpolateColors } from '../utils/turbo';

const ColorScale: React.FC = observer(() => {
    const scaleHeight = 20;
    const scaleWidth = 300;
    const step = 1 / scaleWidth;
    const colorStops: [number, number, number][] = [];
    const { colorMode, mapMode } = shinkansenStore;

    for (let i = 0; i <= scaleWidth; i++) {
        const ratio = i * step;
        const color = interpolateColors(ratio, colorMode);
        colorStops.push(color);
    }

    if (mapMode === "chronology" || mapMode === "distanceFromTokyo") {
    return (
        <div className="colorScale" style={{ height: `${scaleHeight}px`, width: `${scaleWidth}px`, display: 'flex', margin:'auto' }}>
          {colorStops.map((color, index) => (
            <div
              key={index}
              style={{
                flex: '1',
                backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
              }}
            />
          ))}
        </div>
      );
    } else {
        return (<div></div>)
    }
})

export default ColorScale;