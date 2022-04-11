import { Status } from "../models/zone.model";

const yellowPin =  "/icon/in-progress-cat.svg";  
const greenPin =  "/icon/done-cat.svg"; 
const redPin =  "/icon/to-do-cat.svg";

export const getColorMarkerByStatus = (status:Status): string => {
    let selectedPin = '';
    switch (status) {
      case Status.TODO:
        selectedPin = redPin;
        break;
      case Status.INPROGRESS: 
        selectedPin = yellowPin;
        break;
      case Status.DONE:
        selectedPin = greenPin;
        break;
      default: break;
    }
    return selectedPin;
  }