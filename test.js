const d = new Date("2021-12-17T06:30:00.000Z");
console.log(d.getHours(), d.getMinutes());

const d2 = d;
d2.setMinutes(d2.getMinutes() + 60);
console.log(d2.getHours(), d2.getMinutes());
