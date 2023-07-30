import React, { useState } from "react";
import { shinkansenStore } from "../stores/shinkansen";


const TypeMapSelector: React.FC = () => {
    const [mapMode, setMapMode] = useState('point');
    return (
        <div>
            <label htmlFor="mapMode">SelectMapMode </label>
            <select id="mapMode" onChange={(event) => {
                setMapMode(event.target.value);
                shinkansenStore.setMapMode(event.target.value)
                }}>
                <option value="point">Shinkansen Lines</option>
                <option value="company">Company</option>
                <option value="distanceFromTokyo">Distance from Tokyo</option>
                <option value="chronology">Chronology</option>
            </select>
            {
                mapMode === 'chronology' || mapMode === 'distanceFromTokyo' ? (
                    <select id="color_transfert" onChange={(event) => shinkansenStore.setColorMode(event.target.value)}>
                        <option value="turbo">Turbo</option>
                        <option value="gray">Grayscale</option>
                    </select>) : null
            }
            {
                mapMode === 'company' ? (
                <div><img src="areacompany.png" alt='areacompany'></img>
                <img src='companykm.png' alt='companykm'></img>
                </div>) : null
            }
            {
                mapMode === 'point' ? (
                <div><img src="arealine.png" alt='arealine'></img>
                <img src='linekm.png' alt='linekm'></img>
                </div>) : null
            }
            {
                mapMode === 'chronology' ? (
                <div>
                    <img src="scatterdistanceyear.png" alt='scatterdistanceyear'></img>
                </div>) : null
            }
        </div>
    )
}

export default TypeMapSelector;