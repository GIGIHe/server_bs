const { Router } = require("express");
const router = Router();
const goodsModel = require("../model/goods");
const auth = require("./auth");
const admin_auth = require("./admin_auth");
router.get("/", async (req, res, next) => {
  try {
    // let { cates } = req.params;
    let count = await goodsModel.count();
    let { pn = 1, size = 10 } = req.query;
    let page = parseInt(pn);
    let p_size = parseInt(size);
    let data = await goodsModel
      .find()
      .populate({ path: "category" })
      .skip((page - 1) * p_size)
      .limit(p_size)
      .sort({ _id: -1 });
    res.json({
      code: 200,
      data,
      count
    });
  } catch (error) {
    next(error);
  }
});
// 获取商品列表
router.get("/:cates", async (req, res, next) => {
  try {
    let { cates } = req.params;
    let count = await goodsModel.count();
    let { pn = 1, size = 4 } = req.query;
    let page = parseInt(pn);
    let p_size = parseInt(size);
    let data = await goodsModel
      .find({ category: cates })
      .populate({ path: "category" })
      .skip((page - 1) * p_size)
      .limit(p_size)
      .sort({ _id: 1 });
    res.json({
      code: 200,
      data,
      count
    });
  } catch (error) {
    next(error);
  }
});
// 下架
router.delete("/:id", admin_auth, async (req, res, next) => {
  try {
    let { id } = req.params;
    let goods = await goodsModel.findById(id);
    let data = goods.delete();
    res.json({
      code: 200,
      msg: "已下架"
    });
  } catch (error) {
    next(error);
  }
});
// 修改商品信息
router.patch("/:id", admin_auth, async (req, res, next) => {
  try {
    let { id } = req.params;
    let { g_name, g_price, g_desc, poster, category } = req.body;
    // let data = await goodsModel.findById(id);
    let data = await goodsModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          g_name,
          g_price,
          g_desc,
          poster,
          category
        }
      },
      { new: true }
    );
    res.json({
      code: 200,
      msg: "修改成功",
      data
    });
  } catch (error) {
    next(error);
  }
});
// 获取单个商品
router.get("/sigle/:id", admin_auth, async (req, res, next) => {
  try {
    let { id } = req.params;
    let data = await goodsModel.findById(id).populate({ path: "category" });
    console.log(data)
    res.json({
      code: 200,
      data
    });
  } catch (error) {
    next(error);
  }
});
// 增加商品
router.post("/", admin_auth, async (req, res, next) => {
  try {
    // let {  } = req.body;
    let { g_name, g_price,  g_desc, poster, category } = req.body;
    let number1 = Math.ceil(Math.random() * 1000 + 800);
    let number2 = Math.ceil(Math.random() * 800);
    let g = await goodsModel.findOne({ g_name: g_name });
    console.log(g_name);
    if (!g) {
      let goods = await goodsModel.create({
        g_name,
        g_price,
         g_desc,
        poster,
        category,
        storage: number1,
        like: number2
      });
      res.json({
        code: 200,
        msg: "上架成功",
        data: goods
      });
    } else {
      res.json({
        code: 400,
        msg: "请不要重复上架"
      });
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
