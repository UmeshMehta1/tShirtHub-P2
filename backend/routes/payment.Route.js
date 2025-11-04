const { initiateKhaltiPayment, verifyPidx } = require("../controller/user/payment/payment.controller")
const isAutenticated = require("../middleware/isAuthenticated")

const router = require("express").Router()


router.route("/").post(initiateKhaltiPayment)
// router.route("/verifypidx").post(isAutenticated ,verifyPidx)
    router.route("/verifypidx").post(verifyPidx)

module.exports = router