const {PromoCode} = require('../Models/promocode');
const askReduction = require('../askReduction');
//const { fetchWeather } = require("../fetchWeather");
const { validateData } = require("../Middleware/promoCodeMiddleware");
const { checkPromo } = require("../Middleware/promoCodeMiddleware");


module.exports.promo = async (req, res,) => {
    const  { name , code, isActive, avantage, restrictions } = req.body;
    try{
        await validateData(name, code)
        const newPromocode = await PromoCode.create({ name , code, isActive, avantage, restrictions })
        res.status(200).json({promoCodeId: newPromocode._id});
    } catch (err) {
        //console.error(err);
        res.status(400).json({ error: err.message });
    }
}


module.exports.readPromo = async (req, res) => {
    const  redeemInfo = req.body;
    try{
        const promoCode = await checkPromo(redeemInfo.promocode_name, redeemInfo.code);
        const reductionResult =  await askReduction(redeemInfo, promoCode)
        //console.log("Checking reduction res  :", reductionResult);
        res.status(200).json({
            reductionResult
        });
        //return reductionResult;
        
    }catch(err){
        res.status(400).json({ error: err.message });
    }
}