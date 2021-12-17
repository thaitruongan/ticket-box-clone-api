<<<<<<< HEAD
const d = new Date("12-17-2021");
d.setHours(13);
d.setMinutes(30);
console.log(d);
// {
//   "movieId": "61aedafbc5c70c6293511675",
//   "timeStart": "2021-12-11T05:30:00.000Z",
//   "roomId": "61b2d0135b2065af8e65c4f7",
//   "standardPrice": 30000,
//   "vipPrice": 50000
// }
=======
const d = new Date("2021-12-17T06:30:00.000Z");
console.log(d.getHours(), d.getMinutes());

const d2 = d;
d2.setMinutes(d2.getMinutes() + 60);
console.log(d2.getHours(), d2.getMinutes());
>>>>>>> 83d7635f31d42446c7f7f6e0039693b9dc1370f1
