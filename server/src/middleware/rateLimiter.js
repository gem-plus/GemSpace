const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 10,// Limit each IP to 100 requests per `window` (here, per 15 minutes).
	handler: (req, res) => {
    res.status(429).json({ success: false, message: "Too many requests, please try again later." })
	},
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})

module.exports = {limiter};