const express = require("express");
const router = express.Router();

const authentication = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/rbac.middleware");
const { sendRequest, getMyRequests, getUsersRequest, approveRequest } = require("../controllers/request.controller")

router.post("/request", authentication, sendRequest);
router.get("/my-requests", authentication, authorizeRoles('request','view_own'), getMyRequests);
router.get("/requests", authentication, authorizeRoles('request','view_all'), getUsersRequest);
router.patch("/requests/:requestId", authentication, authorizeRoles('request','approve'), approveRequest);

module.exports = router;