const { registerUser, loginUser, forgotPassword, verifyOtp } = require("../controller/admin/auth/authController")

const router= require("express").Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/fogotpassword").post(forgotPassword)
router.route("/verifyotp").post(verifyOtp)

module.exports= router