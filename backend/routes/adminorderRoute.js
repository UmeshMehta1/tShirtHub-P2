const { getAllOrders } = require("../controller/admin/order/adminOrderController")
const isAutenticated = require("../middleware/isAuthenticated")
const restrictTo = require("../middleware/restrictTo")

const router= require("express").Router()

router.route("/").get(isAutenticated, restrictTo("admin"), getAllOrders)

module.exports= router