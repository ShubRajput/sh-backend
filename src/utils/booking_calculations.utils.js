import envConfig from "../config/env.config.js";

const liveModePercentage = envConfig.POOJA_LIVE_MODE_PRICE_PERCENTAGE;
const recordedModePercentage = envConfig.POOJA_RECORDED_MODE_PRICE_PERCENTAGE;
const onSiteModePercentage = envConfig.POOJA_ON_SITE_MODE_PRICE_PERCENTAGE;

export const calculateBookingPrices = (calculationData) => {
  const { basePrice, modeOfPooja, numberOfDevotees, totalSouvernirCost } =
    calculationData;
  let taxRate = 0;
  let newBasePrice = 0;
  let serviceChargeRate = 0;
  let devooteeCharge = 0;

  // Define tax rates based on the mode of pooja
  switch (modeOfPooja) {
    case "live":
    case "Live Video":
      taxRate = 0.1;
      newBasePrice = basePrice + basePrice * liveModePercentage;
      serviceChargeRate = 0.05;
      break;
    case "recorded":
    case "Pre-Recorded":
      taxRate = 0.1;
      newBasePrice = basePrice + basePrice * recordedModePercentage;
      serviceChargeRate = 0.05;
      break;
    case "on_site":
    case "In-Person":
    case "On-Site":
      taxRate = 0.1;
      newBasePrice = basePrice + basePrice * onSiteModePercentage;
      serviceChargeRate = 0.05;
      break;
    default:
      throw new Error(`Invalid mode of pooja: ${modeOfPooja}`);
  }

  // Calculate additional charges based on the number of devotees
  if (numberOfDevotees >= 1 && numberOfDevotees <= 5) {
    devooteeCharge = 0;
  } else if (numberOfDevotees >= 6 && numberOfDevotees <= 9) {
    devooteeCharge = 1000;
  } else if (numberOfDevotees >= 10 && numberOfDevotees <= 20) {
    devooteeCharge = 1500;
  } else if (numberOfDevotees > 20) {
    devooteeCharge = 2500;
  }

  const totalPrice =
    newBasePrice +
    newBasePrice * taxRate +
    newBasePrice * serviceChargeRate +
    devooteeCharge +
    totalSouvernirCost;
  const tax = newBasePrice * taxRate;
  const serviceCharge = newBasePrice * serviceChargeRate;

  return {
    tax: parseFloat(tax).toFixed(2),
    total_price: parseFloat(totalPrice).toFixed(2),
    service_charge: parseFloat(serviceCharge).toFixed(2),
  };
};
