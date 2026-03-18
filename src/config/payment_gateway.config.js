import Razorpay from 'razorpay';

import EnvData from './env.config.js';

const razorpay = new Razorpay({
  key_id: EnvData.RAZORPAY_KEY_ID,
  key_secret: EnvData.RAZORPAY_KEY_SECRET,
});

export default razorpay;
