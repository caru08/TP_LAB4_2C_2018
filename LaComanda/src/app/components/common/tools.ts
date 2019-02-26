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
      date.getMinutes()

    /*return date.getFullYear() +
      '-' + Tools.pad(date.getMonth() + 1) +
      '-' + Tools.pad(date.getDate()) +
      'T' + Tools.pad(date.getHours()) +
      ':' + Tools.pad(date.getMinutes()) +
      ':' + Tools.pad(date.getSeconds()) +
      'Z';
      */
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
