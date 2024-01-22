const { fetchWeather } = require("./fetchWeather");
module.exports = askReduction;

/**
 * check age, date and meteo restrictions for  a promotionnal code.
 *
 * @param {Object} askReductionInput - Input data.
 * @param {Object} promoCode - promotional code details.
 * @returns {Object} -  reduction status objects.
 */

async function askReduction(askReductionInput, promoCode) {
    if (promoCode.isActive) {
        const orRestrictionLogic = promoCode.restrictions["@or"];
        const couponArgument = askReductionInput.arguments;
        
        if (orRestrictionLogic && orRestrictionLogic.length != 0) {
            const combinedResult = await checkCombinedRestrictions(askReductionInput, promoCode);
            if (combinedResult.status === "accepted") {
                return combinedResult;
            }else{
                return combinedResult;
            }
        } else {
            const andResult = await checkAndRestrictions(askReductionInput, promoCode);
            if (andResult.status === "accepted") {
                return andResult;
            }else{
                return andResult;
            }
        }
    }
    return {
        promocode_name: promoCode.name,
        reasons: {},
        status: "denied"
    };
}

let checkCombinedRestrictions = async (askReductionInput, promoCode) => {
    const couponArgument = askReductionInput.arguments;
    const orRestrictionLogic = promoCode.restrictions["@or"];

    for (const orCondition of orRestrictionLogic) {
        let isAllConditionsMet = true;

        for (const key in orCondition) {
            if (key === "@age") {
                const ageCheckResult = await checkAge(askReductionInput, key, orCondition, promoCode);
                if (!ageCheckResult) {
                    isAllConditionsMet = false;
                    break;
                }
            } else if (key === "@date") {
                const dateCheckResult = await checkDate(askReductionInput, key, orCondition, promoCode);
                if (!dateCheckResult) {
                    isAllConditionsMet = false;
                    break;
                }
            } else if (key === "@meteo") {
                const meteoCheckResult = await checkMeteoRestriction(askReductionInput,  key, orCondition, promoCode);
                if (meteoCheckResult.status === "denied") {
                    isAllConditionsMet = false;
                    break;
                }
            } else {
                return {
                    promocode_name: askReductionInput.promocode_name,
                    reasons: { undefined: "not supported condition" },
                    status: "denied"
                };
            }
        }

        if (isAllConditionsMet) {
            return {
                avantage: promoCode.avantage,
                promocode_name: askReductionInput.promocode_name,
                status: "accepted"
            };
        }
    }

    return {
        promocode_name: askReductionInput.promocode_name,
        reasons: { orConditions: "notValid" },
        status: "denied"
    };
};

// check @age, @date and @meteo field out of "OR" logic 
let checkAndRestrictions = async (askReductionInput, promoCode) => {
    const couponArgument = askReductionInput.arguments;

    const ageRestriction = promoCode.restrictions["@age"];
    if (ageRestriction) {
        const ageCheckResult = await checkAge(askReductionInput, "@age", ageRestriction, promoCode);
        if (ageCheckResult.status === "denied") {
            return ageCheckResult;
        }
    }

    const dateRestriction = promoCode.restrictions["@date"];
    if (dateRestriction) {
        const dateCheckResult = await checkDate(askReductionInput, "@date", dateRestriction, promoCode);
        
        if (dateCheckResult.status === "denied") {
            return dateCheckResult;
        }
    }

    const meteoRestriction = promoCode.restrictions["@meteo"];
    if (meteoRestriction) {
        const meteoCheckResult = await checkMeteoRestriction(askReductionInput, promoCode);
        if (meteoCheckResult.status === "denied") {
            return meteoCheckResult;
        }
    }

    // if all "AND" conditions are valid 
    return {
        avantage: promoCode.avantage,
        promocode_name: askReductionInput.promocode_name,
        status: "accepted"
    };
};

let checkAge = async (askReductionInput, key, condition, promoCode) => {
    //const ageCondition = condition[key];
    const ageCondition = condition;
    const couponArgument = askReductionInput.arguments;
    if (ageCondition.eq && couponArgument.age !== ageCondition.eq) {
        // custom return if not valid "eq" conditions
        return {
            promocode_name: askReductionInput.promocode_name,
            reasons: { age: "isNotEq" },
            status: "denied"
        };
    }
    if (ageCondition.lt && couponArgument.age < ageCondition.lt && ageCondition.gt && couponArgument.age  > ageCondition.gt){
        return {
            avantage: promoCode.avantage,
            promocode_name: askReductionInput.promocode_name,
            status: "accepted"
        };
    }
    if (ageCondition.lt && couponArgument.age <= ageCondition.lt || ageCondition.gt && couponArgument.age >= ageCondition.gt) {
        //custom return if not valid "lt" and "gt" conditions
        return {
            promocode_name: askReductionInput.promocode_name,
            reasons: { age: "isNotLtOrGt" },
            status: "denied"
        };
    }
    //default return valid conditions 
    return {
        avantage: promoCode.avantage,
        promocode_name: askReductionInput.promocode_name,
        status: "accepted"
    };
};

let checkDate = async (askReductionInput, key, condition, promoCode) => {
    //const dateCondition = condition[key];
    const dateCondition = condition;
    const couponArgument = askReductionInput.arguments;
    const curentDate = new Date(couponArgument.date);
    const afterCondition = dateCondition.after ? new Date(dateCondition.after) : null;
    const beforeCondition = dateCondition.before ? new Date(dateCondition.before) : null;

    if (afterCondition && curentDate < afterCondition || beforeCondition && curentDate > beforeCondition) {
        //custom return if not valid date condition
        return {
            promocode_name: askReductionInput.promocode_name,
            reasons: { date: "isNotValid" },
            status: "denied"
        };
    }
    //default return valid conditions 
    return {
        avantage: promoCode.avantage,
        promocode_name: askReductionInput.promocode_name,
        status: "accepted"
    };
};

// getting meteo data from promise 
async function getMeteo(town) {
    try {
        const { meteoTemp, meteoDescription } = await fetchWeather(town);
        console.log('Temp:', meteoTemp);
        console.log('Desc:', meteoDescription);
        return { meteoTemp, meteoDescription };
    } catch (error) {
        console.error('Erreur:', error);
    }
}

let checkMeteoRestriction = async (askReductionInput, key, condition, promoCode) => {
    const meteoCondition = condition;
    const couponArgument = askReductionInput.arguments;
    const getMeteoData = await getMeteo(couponArgument.meteo.town);
    const couponMeteoTemp = getMeteoData.meteoTemp;
    const couponMeteoDescription = getMeteoData.meteoDescription;
    const promoMeteoTemp = meteoCondition.temp;
    const promoMeteoDescription = meteoCondition.is;
    if(!(promoMeteoDescription && couponMeteoDescription === promoMeteoDescription && promoMeteoTemp.gt && couponMeteoTemp >= promoMeteoTemp.gt)) {
        return {
            promocode_name: askReductionInput.promocode_name,
            reasons: { meteo: "isNotClear" },
            status: "denied"
        };

    }
    return {
        avantage: promoCode.avantage,
        promocode_name: askReductionInput.promocode_name,
        status: "accepted"
    };
};


