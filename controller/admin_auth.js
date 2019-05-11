module.exports = function (req, res, next) {
    if (req.session && req.session.admin) {
        next()
    } else {
        res.json({
            code:403,
            msg:'用户状态失效'
        })
    }
}