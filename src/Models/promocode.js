
const mongoose = require('mongoose');
const { Schema } = mongoose;

const restrictionSchema = new Schema({
  "@or": {
    type: Array,
    of: {
      type: Object,
      of: {
        "@age": {
          type: Object,
          of: {
            "eq": { type: Number },
            "lt": { type: Number },
            "gt": { type: Number },
          },
        },
        "@date": {
          type: Object,
          of: {
            "after": { type: Date },
            "before": { type: Date },
          },
        },

      },
    },
  },
  "@age": {
    type: Object,
    of: {
      "eq": { type: Number },
      "lt": { type: Number },
      "gt": { type: Number },
    },
  },
  "@date": {
    type: Object,
    of: {
      "after": { type: Date },
      "before": { type: Date },
    },
  },
  "@meteo": {
    type: Object,
    of: {
      "is": { type: String },
      "temp": {
        type: Object,
        of: {
          "gt": { type: String },
          "lt": { type: String },
        },
      },
    },
  },
});

const promoCodeoSchema = new Schema({
  name: { type: String, unique:true, required: true },
  code: { type: String, unique:true, required: true },
  isActive: { type: Boolean, required: true, default: true },
  avantage: {
    type: Object,
    of: {
      "percent": { type: Number, required: true },
    },
  },
  restrictions: { type: restrictionSchema, required: true },
});

const PromoCode = mongoose.model('PromoCode', promoCodeoSchema);

module.exports = { PromoCode };

