const faves = token.actor.items.contents;

async function getFaveData(fave) {
  const fullItem = await fromUuid(`${fave.uuid}`);
  return {
    id: fave.id,
    uuid: fullItem.uuid,
    img: fullItem.img,
    name: fullItem.name,
    uses: fullItem.system.uses?.value,
    max: fullItem.system.uses?.max,
    aMax: fullItem.system.linkedActivity?.uses?.max,
    aUses: fullItem.system.linkedActivity?.uses?.value
  };
}

const faveData = await Promise.all(faves.map(f => getFaveData(f)));

const buttons = faveData.map(fd => ({
  label: fd.name,
  action: fd.id,
  callback: async (event, button, dialog) => { 
      const item = await fromUuid(`${fd.uuid}`);
      await item.use({ legacy: false })},
}));

await foundry.applications.api.DialogV2.wait({
  buttons,
  window: {
    title: "NPC Items",
    icon: "fa-solid fa-sword"
  },
  render: (event, app) => {
    const html = app.element ?? app;
    html.querySelector("footer.form-footer").style.flexDirection = "column";
    html.querySelectorAll("footer > button").forEach(e => e.style.minWidth = "-webkit-fill-available");
    faveData.forEach(fd => {
      const button = html.querySelector(`button[data-action="${fd.id}"]`);
      if (button) {
        button.classList.add("item-name", "item-action", "item-tooltip", "rollable");
        button.setAttribute("data-tooltip", `<section class='loading' data-uuid='${fd.uuid}'><i class='fas fa-spinner fa-spin-pulse'></i></section>`);
        button.setAttribute("data-tooltip-class", "dnd5e2 dnd5e-tooltip item-tooltip");
        button.setAttribute("data-tooltip-direction", "LEFT");
        button.innerHTML = `
          <img src="${fd.img}" height="30" style="vertical-align: middle; margin-right: 5px;">
          ${fd.name} ${fd.max ? `(${fd.uses}/${fd.max})` : ""} ${fd.aMax ? `(${fd.aUses}/${fd.aMax})` : ""}
        `;
      }
    });
  },
});
