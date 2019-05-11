  function dd() {
    var str = ""
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + date.getMonth() + 1).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var hour = ("0" + date.getHours()).slice(-2);
    var min = ("0" + date.getMinutes()).slice(-2);
    var sed = ("0" + date.getSeconds()).slice(-2);
    return str += year + month + day + hour + min + sed;
}
module.exports = dd