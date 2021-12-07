const accountSid = "AC2278d5934ef0267f102cc86150d9004e";
const authToken = "ab17935e1f26d26a40c8d5c926ac2572";
const client = require("twilio")(accountSid, authToken);
const randomCode = (number) => {
  let src = "1234567890";
  let result = "";
  for (let i = 0; i < number; i++) {
    result += src[Math.floor(Math.random() * src.length)];
  }
  return result;
};
client.messages
  .create({
    body: `Your verify code is: ${randomCode(4)}`,
    from: "+19302006267",
    to: "+840918814602",
  })
  .then((message) => console.log(message.sid))
  .catch((error) => console.log(error));
