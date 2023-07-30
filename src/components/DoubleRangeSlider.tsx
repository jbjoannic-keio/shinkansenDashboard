import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { observer } from 'mobx-react-lite';
import { shinkansenStore } from '../stores/shinkansen';

import './DoubleRangeSlider.scss';

const DoubleRangeSliderObserver: React.FC = observer(() => {
    const { infDate, supDate } = shinkansenStore;
    const { min, max } = shinkansenStore;
    const handleSliderChange = (value: number | number[]) => {
        // separate value
        if (typeof value === 'number') {
           // do nothing
        } else {
            shinkansenStore.setInfDate(value[0] as number);
            shinkansenStore.setSupDate(value[1] as number);
        }
        
    };

    return (
        <div>
        <Slider className='slider' range min={min} max={max} value={[infDate, supDate]} onChange={handleSliderChange} />
        <div>
            Selected Values:
            <div>Start Value: {infDate}</div>
            <div>End Value: {supDate}</div>
        </div>
        </div>
    );
});

export default DoubleRangeSliderObserver;