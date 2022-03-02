const image1 = `https://i.imgur.com/kHiXKXe.png`;
const image2 = `https://i.imgur.com/FgquTdP.png`;
const image3 = `https://i.imgur.com/Z0RveMJ.png`;
const image4 = `https://i.imgur.com/s3ugSXN.png`;
const image5 = `https://i.imgur.com/Yst5QcC.png`;

let d = new Dialog({
title: "Conditions",
buttons: {
one: {
 label: `<img src= "${image1}">`,
 callback: () => {token.document.update({ img: image1 })}
},
two: {
  label: `<img src= "${image2}">`,
  callback: () => {token.document.update({ img: image2 })}
 },
 three: {
  label: `<img src= "${image3}"`,
  callback: () => {token.document.update({ img: image3 })}
 },
four: {
  label: `<img src= "${image4}"`,
  callback: () => {token.document.update({ img: image4 })}
 },
five: {
  label: `<img src= "${image5}"`,
  callback: () => {token.document.update({ img: image5 })}
 }
},
default: "one",
render: html => console.log("Register interactivity in the rendered dialog"),
close: html => console.log("This always is logged no matter which option is chosen")
});
d.render(true);
