const { Router } = require("express");
const router = Router();
const auth = require("./auth");
const admin_auth = require("./admin_auth");
const orderModel = require("../model/order");
const goodsModel = require("../model/goods");
 var dd = require("../utils/format")
// 提交订单
router.post("/", auth, async (req, res, next) => {
  try {
    const { goodlist, total_price } = req.body; //提交订单的时候把提供商品id
    let user = req.session.user._id;
    // console.log(user);
    if(goodlist.length){
      goodlist.forEach( async element => {
        let data = await orderModel.create({
          user,
          goods:element.goods._id,
          order_num:1,
          good_num:element.counts,
          total_price,
          order_id: dd()
        });
        // console.log(element.goods._id)
        let goods_data = await goodsModel.findById({ _id: element.goods._id})
        let up_num = await goodsModel.updateOne({_id:element.goods._id},{
          $set: {
            storage: goods_data.storage - element.counts,
            like: goods_data.like + element.counts
          }
        },{
          new:true
        })
        // console.log(up_num)
      });
      
      res.json({
        code: 200,
        msg:"订购成功"
      });
    }else{
      res.json({
        code:200,
        msg:"请选择商品"
      })
    }
  
  } catch (error) {
    next(error)
  }
  
});
// 用户查询所有订单
router.get("/", auth, async (req, res, next) => {
  try {
    let user = req.session.user._id;
    // console.log(user);
    let data = await orderModel
      .find({ user })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "goods" });
    res.json({
      code: 200,
      data
    });
    // console.log(data)
  } catch (error) {
    next(error);
  }
});
// 管理员查询所有订单
router.get("/all", admin_auth, async (req, res, next) => {
  try {
    let { pn = 1, size = 10 } = req.query;
    let page = parseInt(pn);
    let p_size = parseInt(size);
      let count = await orderModel.count()
    let data = await orderModel
      .find()
      .populate({ path: "user", select: "-password" })
      .populate({ path: "goods" })
      .limit(p_size)
      .skip((page - 1) * p_size);
    res.json({
      code: 200,
      data,
      count
    });
    console.log(data);
  } catch (error) {
    next(error);
  }
});
//用户查询单条订单信息
router.get("/sigle/:order_id", auth, async (req, res, next) => {
  try {
    let { order_id } = req.params;
    let user = req.session.user._id;
    console.log(user);
    console.log(order_id);
    let data = await orderModel
      .findOne({ _id: order_id, user: user })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "goods" });
    res.json({
      code: 200,
      data
    });
    console.log(data);
  } catch (error) {
    next(error);
  }
});
// 管理员查询单个用户的单个订单
router.get("/:user/:order", admin_auth, async (req, res, next) => {
  try {
    let user = req.params.user;
    let order = req.params.order;
    // console.log(user,order)
    let data = await orderModel
      .find({ _id: order, user: user })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "goods" });
    res.json({
      code: 200,
      data
    });
  } catch (error) {
    next();
  }
});
// 管理员查询单个商品的所有订单
router.get("/all/:order_id", admin_auth, async (req, res, next) => {
  try {
    let { order_id } = req.params;
    let count = await orderModel.count()
    let data = await orderModel
      .find({ goods: order_id })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "goods" });
    res.json({
      code: 200,
      data,
      count
    });
  } catch (error) {
    next(error);
  }
});
// 删除订单
router.delete("/:user/:order", admin_auth, async (req, res, next) => {
  try {
    let user = req.params.user;
    let order = req.params.order;
    // console.log(user,order)
    let data = await orderModel
      .findOneAndDelete({ _id: order, user: user })
    res.json({
      code: 200,
      data
    });
  } catch (error) {
    next();
  }
});
// 修改订单信息
router.patch("/:user/:order", admin_auth, async (req, res, next) => {
  try {
    let user = req.params.user;
    let order = req.params.order;
    let data = await orderModel
      .findOneAndUpdate({ _id: order, user: user },{
          address:address
      },{
        new:true
        }).populate({ path: "user", select: "-password" })
      .populate({ path: "goods" });
    res.json({
      code: 200,
      data
    });
  } catch (error) {
    next();
  }
});
module.exports = router;
