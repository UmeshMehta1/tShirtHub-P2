const { getAllOrders, updatePaymentStatus, getSingleOrder, updateOrderStatus } = require("../controller/admin/order/adminOrderController")
const isAutenticated = require("../middleware/isAuthenticated")
const restrictTo = require("../middleware/restrictTo")

const router= require("express").Router()

router.route("/").get(isAutenticated, restrictTo("admin"), getAllOrders)
router.route("/paymentStatus/:id").patch(isAutenticated, restrictTo("admin"), updatePaymentStatus)
router.route("/:id").get(isAutenticated, restrictTo("admin"), getSingleOrder).patch(isAutenticated, restrictTo("admin"), updateOrderStatus)

module.exports= router
