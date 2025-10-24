const { getMyProfile, deleteMyProfile, updaeMyProfile, updateMyPassword } = require("../controller/userprofile/userProfile.controller");
const isAutenticated = require("../middleware/isAuthenticated");
const catchAsync = require("../service/catchAsync");

const router= require("express").Router()


router.route("/").get(isAutenticated, catchAsync(getMyProfile)).delete(isAutenticated, catchAsync(deleteMyProfile)).patch(isAutenticated, catchAsync(updaeMyProfile))

router.route("/changepassword").patch(isAutenticated, catchAsync(updateMyPassword))

module.exports = router;