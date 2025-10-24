const { createReview, getMyReviews } = require("../controller/review/review.controller")
const isAutenticated = require("../middleware/isAuthenticated")
const restrictTo = require("../middleware/restrictTo")

const router = require("express").Router()


router.route("/:id").post(isAutenticated, restrictTo("customer"), createReview)
router.route("/myreviews").get(isAutenticated, restrictTo("customer"), getMyReviews)


module.exports = router