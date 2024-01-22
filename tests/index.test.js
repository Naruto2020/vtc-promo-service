const askReduction = require("../src/askReduction");
const { promo } = require("../src/Controllers/promocodeController");
const { PromoCode } = require('../src/Models/promocode');

// mock PromoCode and his create methode 
jest.mock('../src/Models/promocode', () => {
  const mockCreate = jest.fn();
  const mockFindOne = jest.fn();
  return {
    PromoCode: {
      create: mockCreate,
      findOne: mockFindOne,
    },
  };
});

describe("promocode created", () => {

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it("should return a new promo code", async() =>{
    const newPromoCode = {
      name: "WeatherCodeAgeSimple1",
      code: "test28",
      isActive: true,
      avantage: { "percent": 25 },
      restrictions: {
        "@age": {
          "gt": 10,
          "lt": 20
        }
      }
    }

    PromoCode.findOne.mockResolvedValueOnce(null);
    PromoCode.create.mockResolvedValueOnce({ _id: "65abe8fc560e9d4ff6c24025" });

    // mock express res object 
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // call promo function 
    await promo({body: newPromoCode}, mockRes);

    
    expect(PromoCode.create).toHaveBeenCalledWith(newPromoCode);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ promoCodeId: "65abe8fc560e9d4ff6c24025" });
  });
  it("should return error if miss or empty body data", async() => {
    const newPromoCode = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    // call promo function
    await promo({body: newPromoCode}, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid data: name and/or  code are required!" });

  });
}),

describe("promocode validation application", () => {
  it("should return acceptance of a simple promo code", async () => {
    const promoCode = {
      name: "WeatherCodeAgeSimple3",
      code: "test28",
      isActive: true,
      avantage: { percent: 25 },
      restrictions: {
        "@age": {
          gt: 10,
          lt: 20,
        },
      },
    };
    const redeemInfo = {
      promocode_name: "WeatherCodeAgeSimple3",
      code: "test28",
      arguments: {
        age: 15,
      },
    };

    const received = await askReduction(redeemInfo, promoCode);

    expect(received).toEqual({
      avantage: { percent: 25 },
      promocode_name: "WeatherCodeAgeSimple3",
      status: "accepted",
    });
  });

  it("should return acceptance of a complex valid promo code", async () => {
    const promoCode = {
      name: "WeatherCodeAgeComplex4",
      code: "test27",
      isActive: true,
      avantage: { percent: 20 },
      restrictions: {
        "@or": [
          {
            "@age": {
              eq: 40,
            },
          },
          {
            "@age": {
              lt: 30,
              gt: 15,
            },
          },
        ],
        "@date": {
          after: "2021-01-01",
          before: "2022-01-01",
        },
        "@meteo": {
          is: "clear",
          temp: {
            lt: "100", // Celsius here.
          },
        },
      },
    };

    const redeemInfo = {
      promocode_name: "WeatherCodeAgeComplex4",
      code: "test27",
      arguments: {
        age: 16,
        meteo: { town: "Lyon" },
      },
    };

    const received = await askReduction(redeemInfo, promoCode);

    expect(received).toEqual({
      avantage: { percent: 20 },
      promocode_name: "WeatherCodeAgeComplex4",
      status: "accepted",
    });
  });

  it("should reject an invalid promo code testing @age restriction without @or condition", async () => {
    const promoCode = {
      name: "WeatherCodeInvalid",
      code: "test26",
      isActive: true,
      avantage: { percent: 20 },
      restrictions: {
        "@age": {
          gt: 10,
          lt: 20,
        },
      },
    };
    const redeemInfo = {
      promocode_name: "WeatherCodeInvalid",
      code: "test26",
      arguments: {
        age: 55,
      },
    };

    const received = await askReduction(redeemInfo, promoCode);

    expect(received).toEqual({
      promocode_name: "WeatherCodeInvalid",
      reasons: {
        age: "isNotLtOrGt",
      },
      status: "denied",
    });
  });

  it("should reject an invalid promo code testing @date restriction without @or condition", async () => {
    const promoCode = {
      name: "WeatherCodeInvalid",
      code: "test25",
      isActive: true,
      avantage: { percent: 20 },
      restrictions: {
        "@date": {
          after: "2021-01-01",
          before: "2022-01-01",
        },
      },
    };
    const redeemInfo = {
      promocode_name: "WeatherCodeInvalid",
      code: "test25",
      isActive: true,
      arguments: {
        date: "2020-01-01",
      },
    };

    const received = await askReduction(redeemInfo, promoCode);

    expect(received).toEqual({
      promocode_name: "WeatherCodeInvalid",
      reasons: { date: "isNotValid" },
      status: "denied",
    });
  });
});
