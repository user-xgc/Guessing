//工具库、工具方法
class Utils {

  constructor() {

  }

  //格式化日期方法
  //yyyy-MM-dd
  formatDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month >= 10 ? month : `0${month}`;
    let d = date.getDate();
    d = d >= 10 ? d : `0${d}`;

    return `${year}-${month}-${d}`;
  }
}

module.exports = new Utils();