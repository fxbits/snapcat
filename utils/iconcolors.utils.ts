import { Status } from "../models/zone.model";

const yellowPin =  "/icon/in-progress.png";  
const greenPin =  "/icon/done.png"; 
const redPin =  "/icon/to-do.png";

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