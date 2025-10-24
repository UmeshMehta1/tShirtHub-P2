const { getUser } = require("../controller/admin/user/adminuser.controller")
const isAutenticated = require("../middleware/isAuthenticated")
const restrictTo = require("../middleware/restrictTo")

const router= require("express").Router()

router.route("/user").get(isAutenticated, restrictTo("admin"), getUser)

module.exports= router