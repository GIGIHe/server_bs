const { Router } = require("express");
const router = Router(); //实例化router
const auth = require("./auth");
const  admin_auth = require('./admin_auth')
const userModel = require("../model/user"); //引入数据表模型 //
// 注册接口
router.post("/", async (req, res, next) => {
  try {
    // const { username, password, phone, desc, address } = req.body;
    const { username, password, phone, desc, city,area,stress } = req.body;
    let num = Math.floor(Math.random() * 9);
    if (username && password && password.length >= 5) {
      let phon = await userModel.findOne({ phone });
      let user = await userModel.findOne({ username})
      if (!phon && !user) {
        let avatar = `http://pbl.yaojunrong.com/avatar${num}.jpg`;
        const data = await userModel.create({
          username,
          password,
          phone,
          avatar,
          desc,
          // address
          city,
          area,
          stress
        });
        console.log(req.session);
        res.json({
          code: 200,
          msg: "注册成功",
          data
        });
      } else if(user) {
        res.json({
          code: 400,
          msg: "该用户名已被占用"
        });
      }else
      {
        res.json({
          code: 400,
          msg: "该手机号已被注册"
        });
      }
    } else {
      res.json({
        code: 400,
        msg: "缺少必要参数"
      });
    }
  } catch (error) {
    next(error);
  }
});
//登录接口
router.post("/login", async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (username && password) {
      let user = await userModel.findOne({ username });
      req.session.user = user;
      if (user) {
        if (password == user.password) {
          res.json({
            code: 200,
            msg: "登录成功",
            // data: user 密码不可见
            // data:user
            data: {
              username: user.username,
              desc: user.desc,
              phone: user.phone,
              avatar: user.avatar,
              // address: user.address,
              _id: user._id,
              city: user.city,
              area: user.area,
              stress: user.stress
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
router.post("/logout", auth, async (req, res, next) => {
  //首先判断有没有登录
  try {
    req.session.user = null;
    res.json({
      code: 200,
      msg: "退出登录，请重新登录"
    });
  } catch (error) {
    res.json({
      code: 401,
      msg: "用户未登录，请先登录"
    });
    next(error);
  }
});
//用户列表
router.get("/", admin_auth, async (req, res, next) => {
  try {
    let count = await userModel.count();//有关数据的都要加await
    let { pn = 1, size = 10 } = req.query
    let page = parseInt(pn);
    let pagesize = parseInt(size);
    let data = await userModel
      .find()
      .skip((page - 1) * pagesize)
      .limit(pagesize)
      .sort({ _id: -1 })
      .select("-password");
    res.json({
      code: 200,
      data,
      count
    })
  } catch (error) {
    next(error)
  }
})
// 删除单个用户
router.delete("/:id", admin_auth, async (req, res, next) => {
  try {
    let { id } = req.params
    let admin = await userModel.findById(id);
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
//修改个人信息
router.patch("/:id", auth, async (req, res, next) => {
  try {
    let { id } = req.params
    // console.log(id)
    // let { password, desc, avatar, address,username } = req.body;
    let { desc, avatar, city, area, stress,username } = req.body;
    let data = await userModel.findOneAndUpdate({ _id: id }, {
      $set: {
        desc,
        avatar,
        city,
        area,
        stress,
        username
      }
    }, { new: true })
    res.json({
      code: 200,
      msg: "修改成功",
      data:{
        username: data.username,
        desc: data.desc,
        phone: data.phone,
        avatar: data.avatar,
        // address: user.address,
        _id: data._id,
        city: data.city,
        area: data.area,
        stress: data.stress
      }
    });
  } catch (error) {
    next(error);
  }
});
//修改密码
router.patch("/pass/:id", auth, async (req, res, next) => {
  try {
    let { id } = req.params
    // console.log(id)
    // let { password, desc, avatar, address,username } = req.body;
    let { oldpassword,password } = req.body;
    let data = await userModel.findById(id)
    // console.log(data.password == password)
    if (oldpassword == data.password){
      let up_data = await userModel.findOneAndUpdate({ _id: id }, {
        $set: {
          password
        }
      }, { new: true })
      res.json({
        code: 200,
        msg: "修改成功"
        
      });
    }else{
      res.json({
        code: 401,
        msg: "原密码不正确"
      });
    }
   
   
  } catch (error) {
    next(error);
  }
});
//修改地址
router.patch("/addr/:id", auth, async (req, res, next) => {
  try {
    let { id } = req.params
    let {city,area,stress} = req.body
      let data = await userModel.findOneAndUpdate({ _id: id }, {
        $set: {
          city,
          area,
          stress
        }
      }, { new: true })
      res.json({
        code: 200,
        data,
        msg: "修改成功"

      });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
