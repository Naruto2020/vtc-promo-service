const express = require("express");
const router = express.Router();

const promoCodeController = require("../Controllers/promocodeController");
const weat = require("../fetchWeather");

// create promo code 
router.post("/promoCode", promoCodeController.promo);

// read promo code 
router.get("/askReduction", promoCodeController.readPromo);



module.exports = router;