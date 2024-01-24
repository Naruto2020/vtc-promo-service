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

// let gethome = async() => {
//     // rest param (...param) prend des valeurs libre et les places dans un tableau 
    
//     //const tabNumbers = [5, 8, 21, 46, 17]

//     const sumTabNumber = (...n) => {
//         console.log("REST PARAM -------> : ", n);
//         let result = 0;
//         for(const num of n) {
//             result += num
//         }
//         return result;
//     }

//     return sumTabNumber(5, 8, 21, 46, 17);
// }
// let getAppart = async() => {
//     // opérateur spread  (...[5, 8, 12]) prend des valeurs d'un tableau et les transforme en nombre libre 

//     const tabNumbers = [5, 8, 21, 46, 17]

//     const sumTabNumber = (n1, n2, n3) => {
//         return n1 + n2 + n3;
//     }

//     return sumTabNumber(...tabNumbers);
// }

// const learnJsSpread = async() => {
//     return new Promise((resolve, reject) => {
//         // on peut aussi utiliser les spread pour fusionner plusieurs tableau 

//         const redFruits =  ["fraise", "framboise"];
//         const greenFruits =  ["pomme", "poire"];

//         if(redFruits && greenFruits) {
//             const fruits = redFruits && redFruits.length > 0 || greenFruits && greenFruits.length > 0 ? [...redFruits, ...greenFruits] : "undefinded"
//             resolve(fruits)

//         } else {
//             reject(new Error("ERROR"))
//         }

//     });
// }


module.exports.readPromo = async (req, res) => {
    // console.log("ASYNC1 -----> : ", await gethome());
    // console.log("ASYNC2 -----> : ", await getAppart());
    // console.log("ASYNC3 -----> : ", await learnJsSpread());
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