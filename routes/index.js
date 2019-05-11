var express = require('express');
var router = express.Router();
var user = require("../controller/user");
var admin_user = require('../controller/admin');
var cates = require("../controller/catagory")
var goods = require("../controller/goods");
var order = require("../controller/order")
var carList = require("../controller/car")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// 后端解决跨域，前端带上cookie
// router.all('*', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://l27.0.0.1");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
//   res.header("X-Powered-By", ' 3.2.1');
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// });
router.use('/user',user);
router.use("/admin", admin_user);
router.use("/cates",cates)
router.use("/goods",goods);
router.use('/order',order);
router.use("/carList",carList)
module.exports = router;
