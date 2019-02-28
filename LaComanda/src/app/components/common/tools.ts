
import * as m from 'moment';

export class Tools {

  static deepCopy(obj: any) {
    let copy: any;
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = Tools.deepCopy(obj[i]);
      }
      return copy;
    }
    if (obj instanceof Tools) {
      copy = new (<any>obj.constructor)();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = Tools.deepCopy(obj[attr]);
      }
      return copy;
    }
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = Tools.deepCopy(obj[attr]);
      }
      return copy;
    }
    if (null == obj || "object" != typeof obj) return obj;
  }

  static parseServerFormatDate(date: Date) {
    return date.getDate() + '/' +
      (date.getMonth() + 1) +  '/' +
      date.getFullYear() +
      ' ' +
      date.getHours() + ':' +
      date.getMinutes();
  }

  static parseISOStringDateToShortDateString(date: string) {
    var finalFormat = date.substring(date.length - 1, date.length);
    var d = "";
    if (finalFormat === 'Z') {
      d = date.substring(0, date.length - 1);
    } else {
      d = date;
    }
    var newDate = new Date(d);
    return newDate.getFullYear() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getDate();
  }

  static parseStringDateTimeToDateTime(fecha:string): Date{
    var fechaArray = fecha.split('/');
    var fechaArrayAno = fechaArray[2].split(' ');
    var fechaArrayHoras = fechaArrayAno[1].split(':');
    let date = new Date();
    date.setFullYear(parseInt(fechaArrayAno[0]), parseInt(fechaArray[1]) - 1 , parseInt(fechaArray[0]))
    date.setHours(parseInt(fechaArrayHoras[0]));
    date.setMinutes(parseInt(fechaArrayHoras[1]));
    date.setMilliseconds(0);
    return date;
  }

  static parseMomentDateToString(fecha){
    let fechaString = Tools.parseServerFormatDate(fecha._d);
    return fechaString;   
  }

  static sameDateString(fechaUno, fechaDos){
    let fUno = fechaUno.split('/');
    let fUnoYear = fUno[2].split(' ');
    let fDos = fechaDos.split('/');
    let fDosYear = fDos[2].split(' ');
    if(fUnoYear[0] == fDosYear[0]){
      if(fUno[0] == fDos[0]){
        if(fUno[1] == fDos[1]){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  static greaterThanDates(fichaLimite, fechaAComparar){
    let fUno = fichaLimite.split('/');
    let fUnoYear = fUno[2].split(' ');
    let fDos = fechaAComparar.split('/');
    let fDosYear = fDos[2].split(' ');
    if(fUnoYear[0] == fDosYear[0] || fUnoYear[0] < fDosYear[0]){
      if(fUno[0] == fDos[0] || fUno[0] < fDos[0]){
        if(fUno[1] == fDos[1] || fUno[1] < fDos[1]){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  static smallThanDates(fichaLimite, fechaAComparar){
    let fUno = fichaLimite.split('/');
    let fUnoYear = fUno[2].split(' ');
    let fDos = fechaAComparar.split('/');
    let fDosYear = fDos[2].split(' ');
    if(fUnoYear[0] == fDosYear[0] || fUnoYear[0] > fDosYear[0]){
      if(fUno[0] == fDos[0] || fUno[0] > fDos[0]){
        if(fUno[1] == fDos[1] || fUno[1] > fDos[1]){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  static objectsAreEqual(object1, object2) {
    var areEqual = true;
    var properties = Object.keys(object1);
    for (var key in properties) {
      if (typeof object1[properties[key]] !== 'object') {
        if (object1[properties[key]] !== object2[properties[key]]) {
          areEqual = false;
        }
      } else {
        if (!this.objectsAreEqual(object1[properties[key]], object2[properties[key]])) {
          areEqual = false;
        }
      }
    }
    return areEqual;
  }

  static generateRandomString() {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = 5; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;

  }

  private static pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

}
