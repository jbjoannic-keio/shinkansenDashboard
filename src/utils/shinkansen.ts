import Papa, { ParseResult } from "papaparse";

import { shinkansenStore } from "../stores/shinkansen";

const csvPath = "fuse.csv"; //"/Shinkansen_stations_inJapan_with_coordinates.csv";

interface ParsedData {
  Station_Name: string;
  Shinkansen_Line: string;
  Year: number;
  Prefecture: string;
  Distance_from_Tokyo_st: string;
  Company: string;
  Latitude: number;
  Longitude: number;
}

export interface ShinkansenData {
  stationName: string;
  shinkansenLine: string;
  year: number;
  prefecture: string;
  distanceFromTokyoSt: number;
  company: string;
  latitude: number;
  longitude: number;
}

function convertToData(parsedData: ParsedData[]): ShinkansenData[] {
  return parsedData.map((item) => ({
    stationName: item.Station_Name,
    shinkansenLine: item.Shinkansen_Line,
    year: item.Year,
    prefecture: item.Prefecture,
    distanceFromTokyoSt: parseFloat(item.Distance_from_Tokyo_st),
    company: item.Company,
    latitude: item.Latitude,
    longitude: item.Longitude,
  }));
}

export const readShinkansenData: () => void = () => {
  let shinkansenData: ShinkansenData[] = [];

  Papa.parse(csvPath, {
    header: true,
    download: true,
    skipEmptyLines: true,
    delimiter: ",",
    error: (error) => {
      console.log(error);
    },
    complete: (results: ParseResult<ParsedData>) => {
      shinkansenData = convertToData(results.data);
      shinkansenStore.setShinkansenData(shinkansenData as ShinkansenData[]);
    },
  });
};
