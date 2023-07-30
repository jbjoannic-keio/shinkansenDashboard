import React, { useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

import { shinkansenStore } from '../stores/shinkansen';

import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Geometry, LineString, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';

import { observer } from 'mobx-react-lite';
import './Map.scss'
import { ShinkansenData } from '../utils/shinkansen';
import { Color, fromString } from 'ol/color';
import { interpolateColors } from '../utils/turbo';

const JapanCoordinates = [138.2529, 36.2048];
const JapanZoom = 5;

const getColorFromCompany: (company: string) => Color = (company) => {
  switch (company) {
    case "JR_Central":
      return fromString('rgba(237, 109, 0,1)');
    case "JR_West":
      return fromString('rgba(0, 104, 183, 1)');
    case "JR_East":
      return fromString('rgba(10, 140, 13, 1)');
    case "JR_Kyushu":
      return fromString('rgba(229, 0, 18, 1)');
    case "JR_Hokkaido":
      return fromString('rgba(5, 70, 6, 1)');
    default:
      return fromString('rgba(255, 255, 255, 1)');
  }
}


const getColorFromLine: (shinkansenLine: string) => Color = (shinkansenLine) => {   
  switch (shinkansenLine) {
    case "Tokaido_Shinkansen":
      return fromString('rgba(128, 0, 0, 1)');
    case "Sanyo_Shinkansen":
      return fromString('rgba(128, 0, 128, 1)');
    case "Tohoku_Shinkansen":
      return fromString('rgba(128, 128, 0, 1)');
    case "Joetsu_Shinkansen":
      return fromString('rgba(0, 128, 0, 1)');
    case "Yamagata_Shinkansen":
      return fromString('rgba(0, 128, 128, 1)');
    case "Akita_Shinkansen":
      return fromString('rgba(0, 0, 128, 1)');
    case "Hokuriku_Shinkansen":
      return fromString('rgba(64, 64, 128, 1)');
    case "Kyushu_Shinkansen":
      return fromString('rgba(64, 128, 64, 1)');
    case "Hokkaido_Shinkansen":
      return fromString('rgba(128, 64, 64, 1)');
    case "Nishi_Kyushu_Shinkansen":
      return fromString('rgba(0, 0, 0, 1)');
    case "Tohoku_Shinkansen,Hokkaido_Shinkansen":
      return fromString('rgba(128, 128, 128, 1)');
    case "Joetsu_Shinkansen,Hokuriku_Shinkansen":
      return fromString('rgba(128, 128, 128, 1)');
    case "Tohoku_Shinkansen,Akita_Shinkansen":
      return fromString('rgba(128, 128, 128, 1)');
    case "Tohoku_Shinkansen,Yamagata_Shinkansen": 
      return fromString('rgba(128, 128, 128, 1)');
    case "Tohoku_Shinkansen,Joetsu_Shinkansen":
      return fromString('rgba(128, 128, 128, 1)');
    case "Tokaido_Shinkansen,Sanyo_Shinkansen":
      return fromString('rgba(128, 128, 128, 1)');
    case "Sanyo_Shinkansen,Kyushu_Shinkansen":
      return fromString('rgba(128, 128, 128, 1)');
    default:
      return fromString('rgba(255, 255, 255, 1)');
  }
}

const getColorFromYear: (colorMode: string, year: number, infDate: number, supDate: number) => Color = (colorMode, year, infDate, supDate) => {
  const ratio = (year - infDate) / (supDate - infDate);
  // turbo color map
  console.log(ratio);
  const [r, g, b] = interpolateColors(ratio, colorMode);
  return fromString(`rgba(${r}, ${g}, ${b}, 1)`);
}

const getLineStyle = (styleType: string, feature: Feature, getShinkansenDataByStationName: (name: string) => ShinkansenData | undefined, infDate: number, supDate: number, infDistance: number, supDistance: number, colorMode: string, vectorSource: VectorSource) => {
  const geometry = feature.getGeometry() as Geometry;
  const firstPoint = (geometry as LineString).getLastCoordinate();
  //search fotr point feature that have the same coordinates
  const pointFeature = vectorSource.getFeaturesAtCoordinate(firstPoint).filter((feature) => feature.getGeometry() instanceof Point)[0];
  const info = pointFeature.getProperties();
  const name = info.name;
  const station = getShinkansenDataByStationName(name);
  if (station === undefined) {
    return new Style({
      stroke: new Stroke({
        color: [0, 0, 0, 1],
        width: 1
      })
    })
  } else {
    return new Style({
      stroke: new Stroke({
        color: ((styleType === 'chronology') ? 'black' : ((styleType === 'company') ? getColorFromCompany(station.company) : (styleType === 'point') ? getColorFromLine(station.shinkansenLine) : getColorFromYear(colorMode, station.distanceFromTokyoSt, infDistance, supDistance))),
        width: ((styleType === 'chronology') ? 1 : 5)
      })
    })
  }
}

const getStyleUnselected = (styleType: string, feature: Feature, getShinkansenDataByStationName: (name: string) => ShinkansenData | undefined, infDate: number, supDate: number,infDistance:number ,supDistance: number, colorMode:string ) => {
  const info = feature.getProperties();
  const name = info.name;
  const station = getShinkansenDataByStationName(name);
  if (station === undefined) {
    return new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: [0, 0, 0, 1],
        })
      })
    })
  } else {
    return new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: ((styleType === 'chronology') ? getColorFromYear(colorMode, station.year, infDate, supDate) : ((styleType === 'company') ? getColorFromCompany(station.company) : (styleType === 'point') ? getColorFromLine(station.shinkansenLine) : getColorFromYear(colorMode, station.distanceFromTokyoSt, infDistance, supDistance))),
        })
      })
    })
  }
}

const getStyleSelected = (styleType: string, feature: Feature, getShinkansenDataByStationName: (name: string) => ShinkansenData | undefined, infDate: number, supDate: number, infDistance:number ,supDistance: number, colorMode: string ) => {
  const info = feature.getProperties();
  const name = info.name;
  const station = getShinkansenDataByStationName(name);
  if (station === undefined) {
    return new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: [0, 0, 0, 1],
        })
      })
    })
  } else {
    return new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: ((styleType === 'chronology') ? getColorFromYear(colorMode, station.year, infDate, supDate) : ((styleType === 'company') ? getColorFromCompany(station.company) : (styleType === 'point') ? getColorFromLine(station.shinkansenLine) : getColorFromYear(colorMode, station.distanceFromTokyoSt, infDistance, supDistance))),
        }),
        stroke: new Stroke({
          color: 'black',
          width: 1
        })
      }),
      text: new Text({
        text: `${station.stationName}, ${station.shinkansenLine}, ${station.year}`,
        font: '24px Calibri,sans-serif',
        offsetY: -15,
        fill: new Fill({
          color: ((styleType === 'chronology') ? getColorFromYear(colorMode, station.year, infDate, supDate) : ((styleType === 'company') ? getColorFromCompany(station.company) : (styleType === 'point') ? getColorFromLine(station.shinkansenLine) : getColorFromYear(colorMode, station.distanceFromTokyoSt, infDistance, supDistance))),
        }),
        stroke: new Stroke({
          color: 'white',
          width: 1
        })
      }),
    })
  }
}


const MapComponent: React.FC = observer(() => {

  const { getShinkansenDataByDate, infDate, supDate, mapMode, colorMode, getShinkansenDataByStationName } = shinkansenStore;
  
  useEffect(() => {
    const shinkansenData = getShinkansenDataByDate();
    const infDistance = 0;
    const distances = shinkansenData.map((data) => data.distanceFromTokyoSt);
    const supDistance = Math.max(...distances);
    const japanCenter = fromLonLat(JapanCoordinates);
    // Create the map when the component mounts
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: japanCenter,
        zoom: JapanZoom,
      }),
    });

    // for each shinkansenData.shinkansenLine, create a list to add nodes
    const shinkansenLineList = shinkansenData.map((data) => data.shinkansenLine);
    const shinkansenLineSet = new Set(shinkansenLineList);
    const shinkansenLineArray = Array.from(shinkansenLineSet);
    const shinkansenLinesNodes: ShinkansenData[][] = [];
    shinkansenLineArray.filter((line) => !line.includes(','))
      .forEach((line) => {
        shinkansenLinesNodes.push(
          shinkansenData.filter((data) => data.shinkansenLine.includes(line)).sort((a, b) => a.distanceFromTokyoSt - b.distanceFromTokyoSt));
      })
    
    console.log(shinkansenLinesNodes);


    const vectorSource = new VectorSource();

    shinkansenData.forEach((data) => {
      const pointFeature = new Feature({
        geometry: new Point(fromLonLat([data.longitude, data.latitude])),
        name: data.stationName,
      })

      pointFeature.setStyle(getStyleUnselected(mapMode, pointFeature, getShinkansenDataByStationName, infDate, supDate, infDistance, supDistance, colorMode));
      vectorSource.addFeature(pointFeature);
    })

    shinkansenLinesNodes.forEach((line) => {
      line.forEach((data, index) => {
        if (index !== line.length - 1) {
          const lineFeature = new Feature({
            geometry: new LineString([fromLonLat([data.longitude, data.latitude]), fromLonLat([line[index + 1].longitude, line[index + 1].latitude])]),
          })
          lineFeature.setStyle(getLineStyle(mapMode, lineFeature, getShinkansenDataByStationName, infDate, supDate, infDistance, supDistance, colorMode, vectorSource));
          vectorSource.addFeature(lineFeature);
        }
      })
    })
            

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);


    map.on('pointermove' , (event) => {
      
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature); 
      if (feature !== undefined) {
        const tFeature = feature as Feature;
        if (tFeature.getGeometry() instanceof LineString) {
          //
        } else {
          tFeature.setStyle(getStyleSelected(mapMode, tFeature, getShinkansenDataByStationName, infDate, supDate, infDistance, supDistance, colorMode));
          const otherFeatures = vectorSource.getFeatures().filter((f) => (f !== tFeature) && (f.getGeometry() instanceof Point) );
          otherFeatures.forEach((f) => f.setStyle(getStyleUnselected(mapMode, f, getShinkansenDataByStationName, infDate, supDate, infDistance, supDistance, colorMode)));
        }
      }
    })
    return () => {
      // Clean up the map when the component unmounts
      map.setTarget(undefined);
   };
  }, [getShinkansenDataByDate, infDate, supDate, mapMode, colorMode, getShinkansenDataByStationName]);

  return (
    <div id="map-container">
      <div id="map" style={{ width: '100%', height: '500px' }} />
    </div>);
});


export default MapComponent;
