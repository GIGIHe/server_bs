const { Router } = require("express");
const router = Router();
const auth = require("./auth");
const carModel = require("../model/car");
//加入购物车
router.post("/", auth, async (req, res, next) => {
  try {
    let { goods } = req.body;
    let user = req.session.user._id;
    let counts = 1;
    let shop_goods = await carModel.findOne({ goods: goods, user: user });
    console.log(shop_goods)
    if (shop_goods) {
      res.json({
        code: 401,
        msg:'该商品已存在'
      });
    }else{
      let data = await carModel.create({
        goods,
        user,
        counts,
        checked: true
      });
      res.json({
        code: 200,
        msg:'成功加入购物车',
        data
      });
    } 
  } catch (error) {
    next(error)
  }
});
//查xun购物车
router.get("/", auth, async (req, res, next) => {
  try {
    let user = req.session.user._id;
    let count = await carModel.count(); //有关数据的都要加await
    let { pn = 1, size = 10 } = req.query;
    let page = parseInt(pn);
    let pagesize = parseInt(size);
    let data = await carModel
      .find({ user: user })
      .skip((page - 1) * pagesize)
      .limit(pagesize)
      .sort({ _id: -1 })
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
//修改购物车商品数量
router.patch("/:goods", auth, async (req, res, next) => {
  try {
    let goods = req.params.goods;
    let counts = req.body.counts;
    let data = await carModel.findOneAndUpdate({ _id: goods }, {
      $set: {
        counts
      }
    }, { new: true })
    res.json({
      code: 200,
      data
    });
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", auth, async (req, res, next) => {
  try {
    let {id} = req.params
    let data = await carModel.findByIdAndDelete(id)
    res.json({
      code: 200,
      msg:"删除成功"
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
