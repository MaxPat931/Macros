const images = [ `https://i.imgur.com/kHiXKXe.png`,
 `https://i.imgur.com/FgquTdP.png`,
 `https://i.imgur.com/Z0RveMJ.png`,
 `https://i.imgur.com/s3ugSXN.png`,
 `https://i.imgur.com/Yst5QcC.png`
];
const buttons = images.reduce((acc, e, i) => {
  acc[i] = {
    label: `<img src="${e}">`,
    callback: () => token.document.update({"texture.src": e})
  };
  return acc;
}, {});
new Dialog({title: "Tokens", buttons}).render(true);
