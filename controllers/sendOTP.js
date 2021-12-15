const accountSid = "ACefaef5e6d3e27d5a1b4203d3e1fce79e";
const authToken = "2d96bc4d6da56482eafb6ea46b5e9c7b";
const client = require("twilio")(accountSid, authToken);

const sendOTP = {
  sendOTP(random, phone) {
    return client.messages.create({
      body: `Your verify code is: ${random}`,
      from: "+18045313630",
      to: `+84${phone}`,
    });
  },
  randomCode(number) {
    let src = "1234567890";
    let result = "";
    for (let i = 0; i < number; i++) {
      result += src[Math.floor(Math.random() * src.length)];
    }
    return result;
  },
};

module.exports = sendOTP;
