// module.exports = function(req,res,next) {
//     if(req.session && req.session.user){
//       next()
//     }else{
//         return {
//             msg:'用户状态失效'
//         }
//     }
// }

module.exports = function (req, res, next) {
    // 判断依据:用户是否登录
    if (req.session && req.session.user) {

        next();
    } else {
        res.json({
            code: 403,
            msg: "用户状态失效"
        });
    }
};