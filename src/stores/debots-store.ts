import { makeObservable, observable, action } from "mobx"

export type DebotInfo = any;

class DebotsStore {
  debotInfoMap: {[key: string]: DebotInfo } = {}

  constructor() {
      makeObservable(this, {
          debotInfoMap: observable,
          setDebotInfo: action,
      })
  }

  setDebotInfo(address: string, info: DebotInfo) {
    this.debotInfoMap[address] = info;
  }

  getDebotInfo(address: string): DebotInfo {
    return this.debotInfoMap[address];
  }
}

export { DebotsStore }
