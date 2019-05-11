const { Router } = require("express");
const router = Router(); //实例化router
const adminModel = require("../model/admin");
const admin_auth = require("./admin_auth");
//管理员注册
router.post("/", async (req, res, next) => {
  try {
    const { name, password, desc, avatar, tel,level } = req.body;
    let admin = await adminModel.findOne({ name });
    if (admin) {
      res.json({
        code: 401,
        msg: "该用户已注册"
      });
    } else {
      let data = await adminModel.create({
        name,
        password,
        avatar,
        tel,
        desc,
        level
      });
      res.json({
        code: 200,
        // data: admin,
        msg: "注册成功，请登录"
      });
    }
  } catch (error) {
    next(error);
  }
});
// 管理员登录
router.post("/login", async (req, res, next) => {
  try {
    let { name, password } = req.body;

    if (name && password) {
      let user = await adminModel.findOne({ name });
      req.session.admin = user;
      if (user) {
        if (password == user.password) {
          res.json({
            code: 200,
            msg: "登录成功",
            // data: user 密码不可见
            data:{
              _id:user._id,
              avatar: user.avatar,
              created_at: user.created_at,
              desc: user.desc,
              level: user.level,
              name: user.name,
              tel: user.tel,
              updated_at: user.updated_at
            }
          });
        } else {
          res.json({
            code: 400,
            msg: "密码错误"
          });
        }
      } else {
        res.json({
          code: 400,
          msg: "请先注册"
        });
      }
    } else {
      res.json({
        code: 400,
        msg: "请输入必要信息"
      });
    }
  } catch (error) {
    next(error);
  }
});
// 退出登录
router.post("/logout", admin_auth, async (req, res) => {
  try {
    req.session.admin = null;
    res.json({
      code: 200,
      msg: "退出登录"
    });
  } catch (error) {
    res.json({
      code: 401,
      msg: "请先登录"
    });
    next(error);
  }
}); 
// 修改管理员信息
router.patch("/update/:id", admin_auth, async (req, res, next) => {
  try {
    let { id } = req.params;
    let {  desc, avatar, tel,level } = req.body;
    let data = await adminModel.findOneAndUpdate({ _id: id }, {
      $set: {
      desc,
      avatar,
      tel,
      level
    }},{ new: true })
      res.json({
        code: 200,
        msg: "修改成功",
       data
      });
  } catch (error) {
    next(error);
  }
});
router.patch("/adpass/:id", admin_auth, async (req, res, next) => {
  try {
    let { id } = req.params
    // console.log(id)
    // let { password, desc, avatar, address,username } = req.body;
    let { oldpassword, password } = req.body;
    let data = await adminModel.findById(id)
    // console.log(data.password == password)
    if (oldpassword == data.password) {
      let up_data = await adminModel.update({ _id: id }, {
        $set: {
          password
        }
      }, { new: true })
      res.json({
        code: 200,
        msg: "修改成功"

      });
    } else {
      res.json({
        code: 401,
        msg: "原密码不正确"
      });
    }


  } catch (error) {
    next(error);
  }
});
// 获取管理员列表
router.get('/',admin_auth,async(req,res,next)=>{
    try {
        let count = await adminModel.count();//有关数据的都要加await
        let { pn = 1,size = 10} = req.query
        let page = parseInt(pn);
        let pagesize = parseInt(size);
        let data = await adminModel
            .find()
            .skip((page - 1) * pagesize)
            .limit(pagesize)
            .sort({ _id: -1 })
            .select("-password");
        res.json({
            code:200,
            data,
            count
        })
    } catch (error) {
        next(error)
    }
})
// 获取单个管理员
router.get("/:id",admin_auth,async(req,res,next)=>{
    try {
        let {id} = req.params
        let data = await adminModel.findById(id).select("-password");
        res.json({
            code:200,
            data
        })
    } catch (error) {
        next(error)
    }
})
// 删除单个管理员
router.delete("/:id", admin_auth, async (req, res, next) => {
    try {
        let { id } = req.params
        let admin = await adminModel.findById(id);
        let data = admin.delete()
        res.json({
            code: 200,
            msg:'已删除',
            data
        })
    } catch (error) {
        next(error)
    }
})
module.exports = router; //没有导出出错了
