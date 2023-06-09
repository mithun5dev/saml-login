import { Injectable } from '@angular/core';

declare var moment;declare var cordova;

@Injectable({
  providedIn: 'root'
})
export class AppUtilitiesService {

  constructor() { }

  rainbow (numOfSteps,step){
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
      case 0: r = 1; g = f; b = 0; break;
      case 1: r = q; g = 1; b = 0; break;
      case 2: r = 0; g = 1; b = f; break;
      case 3: r = 0; g = q; b = 1; break;
      case 4: r = f; g = 0; b = 1; break;
      case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
  }

  isEmpty (object) {
    return typeof object === 'undefined' ||
           object === '' ||
           object == null
  }

  randomId () {
    return new Date().getTime().toString() + (Math.floor(Math.random()*90000) + 10000);
  }

  toUTC (time, date) {
    date = date || new Date()
    var date = moment(new Date(date),"YYYY-MM-DD")
    var timePeriodArray = time.split(/(AM)|(PM)/i)
    var hrsnMinsArray = timePeriodArray[0].split(':');
    var hours = hrsnMinsArray[0];
    var minutes = hrsnMinsArray[1];
    var period = timePeriodArray[2];
    if(period == 'PM') hours = Number(hours) + 12;
    date.hour(hours);
    date.minute(minutes);
    return date;
  }

}
