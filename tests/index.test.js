const askReduction = require("../src/index");

describe("promocode validation application", () => {
  it("should return acceptance of a simple promo code", async () => {
    const promoCode = {
      name: "WeatherCodeAgeSimple",
      avantage: { percent: 25 },
      restrictions: {
        "@age": {
          gt: 10,
          lt: 20,
        },
      },
    };
    const redeemInfo = {
      promocode_name: "WeatherCodeAge",
      arguments: {
        age: 15,
      },
    };

    const received = await askReduction(redeemInfo, promoCode);

    expect(received).toEqual({
      avantage: { percent: 25 },
      promocode_name: "WeatherCodeAgeSimple",
      status: "accepted",
    });
  });

  it("should return acceptance of a complex valid promo code", async () => {
    const promoCode = {
      name: "WeatherCodeAgeComplex",
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
      promocode_name: "WeatherCodeAgeComplex",
      arguments: {
        age: 16,
        meteo: { town: "Lyon" },
      },
    };

    const received = await askReduction(redeemInfo, promoCode);

    expect(received).toEqual({
      avantage: { percent: 20 },
      promocode_name: "WeatherCodeAgeComplex",
      status: "accepted",
    });
  });

  it("should reject an invalid promo code", async () => {
    const promoCode = {
      name: "WeatherCodeInvalid",
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
      arguments: {
        age: 55,
      },
    };

    const received = await askReduction(redeemInfo, promoCode);

    expect(received).toEqual({
      promocode_name: "WeatherCodeInvalid",
      reasons: {
        age: "isNotLt",
      },
      status: "denied",
    });
  });
});
