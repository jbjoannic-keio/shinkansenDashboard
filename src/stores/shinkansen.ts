import { makeAutoObservable } from "mobx";
import { ShinkansenData, readShinkansenData } from "../utils/shinkansen";

class ShinkansenStore {
  shinkansenDataArray: ShinkansenData[] = [];

  infDate = 40;
  supDate = 60;

  min = 0;
  max = 110;

  mapMode = "point";
  colorMode = "turbo";

  constructor() {
    makeAutoObservable(this);
    readShinkansenData();
  }

  setShinkansenData(shinkansenData: ShinkansenData[]) {
    this.shinkansenDataArray = shinkansenData;
    const years = this.shinkansenDataArray.map((data) => data.year);
    this.min = Math.min(...years);
    this.max = Math.max(...years);
    this.infDate = this.min;
    this.supDate = this.max;
  }

  setInfDate(infDate: number) {
    this.infDate = infDate;
    console.log(this.shinkansenDataArray);
  }

  setSupDate(supDate: number) {
    this.supDate = supDate;
  }

  getShinkansenDataByDate: () => ShinkansenData[] = () => {
    if (this.shinkansenDataArray === undefined) {
      return [];
    }
    return this.shinkansenDataArray.filter(
      (data) => data.year >= this.infDate && data.year <= this.supDate
    );
  };

  getShinkansenDataByStationName: (name: string) => ShinkansenData | undefined =
    (name) => {
      return this.shinkansenDataArray.find((data) => data.stationName === name);
    };

  setMapMode(mode: string) {
    this.mapMode = mode;
  }

  setColorMode(mode: string) {
    this.colorMode = mode;
  }
}

export const shinkansenStore = new ShinkansenStore();
