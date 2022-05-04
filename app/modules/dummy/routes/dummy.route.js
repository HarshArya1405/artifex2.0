// API configuration
const config = require('../../../config/env.config');
const minimumSupportedApiVersion = (config.minimumSupportedApiVersion ?? "1")


// Controller
const dummyController =require("./../controllers/dummy.controller")

// Routes
const express = require('express')
const router = express.Router();

// APIs
router.get(`/v1/dummyRoute`, dummyController.helloDummy);

module.exports = router;