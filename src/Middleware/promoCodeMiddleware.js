const {PromoCode} = require('../Models/promocode');

module.exports.validateData = async(name, code) => {
    if (!name || !code) {
        throw new Error("Invalid data: name and/or  code are required!");
    }
    const inputData = await PromoCode.findOne({name, code})
    if(inputData){
        throw new Error("Invalid data: name and/or code already exist!");
    }
}

module.exports.checkPromo = async(name, code) => {
    const inputData = await PromoCode.findOne({name, code})
    if(!inputData){
        throw new Error("Invalid data: error: Promo code not found!");
    }
    return inputData;
}