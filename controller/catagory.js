const { Router } = require("express");
const router = Router();
const categoryModel = require("../model/category");
const auth = require("./auth");
const admin_auth = require("./admin_auth");
// 获取分类列表
router.get("/", async (req, res, next) => {
    try {
        let count = await categoryModel.count();
        let { pn = 1, size = 10 } = req.query;
        let page = parseInt(pn);
        let p_size = parseInt(size);
        let data = await categoryModel
          .find()
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

// 增加分类
router.post("/", admin_auth, async (req, res, next) => {
    try {
        let { c_name } = req.body;
        let g = await categoryModel.findOne({ c_name: c_name });
        // console.log(c_name);
        if (!g) {
            let cats = await categoryModel.create({
              c_name
            });
            res.json({
              code: 200,
              msg: "添加成功",
              data: cats
            });
        } else {
            res.json({
                code: 400,
                msg: '分类已存在'
            })
        }

    } catch (error) {
        next(error);
    }
});
//获取单个分类
router.get("/:id", admin_auth, async (req, res, next) => {
    try {
        let { id } = req.params
        let data = await categoryModel.findById(id)
        res.json({
            code: 200,
            data
        })
    } catch (error) {
        next(error)
    }
})
// 删除单个分类
router.delete("/:id", admin_auth, async (req, res, next) => {
    try {
        let { id } = req.params
        let admin = await categoryModel.findById(id);
        let data = admin.delete()
        res.json({
            code: 200,
            msg: '已删除',
            data
        })
    } catch (error) {
        next(error)
    }
})
//修改分类
router.patch("/:id", admin_auth, async (req, res, next) => {
    try {
        let { id } = req.params
        let { c_name } = req.body;
        let data = await categoryModel.findOneAndUpdate({ _id: id }, {
            $set: {
               c_name
            }
        }, { new: true })
        res.json({
            code: 200,
            data
        });
    } catch (error) {
        next();
    }
});
module.exports = router