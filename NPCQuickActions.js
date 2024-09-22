const tokenActor = token.actor;
const faves = tokenActor.items.contents;

const sortedFaves = faves
console.log("sfave",sortedFaves)

async function getFaveLabel(fave) {
    const fullItem = await fromUuid(`${_token.actor.uuid}.Item.${fave.id}`);
    console.log("fullItem",fullItem)
    return `
      <img src="${fullItem.img}" height="30" style="vertical-align: middle; margin-right: 5px;"> 
      ${fullItem.name} ${fullItem.system.uses?.value ? `(${fullItem.system.uses?.value}/${fullItem.system.uses?.max})` : ""}
      `;
}

const buttons = await Promise.all(sortedFaves.map(async (f) => {
    const label = await getFaveLabel(f);
    return {
        label, 
        action: f.id, 
        callback: () => { return f.id; }
    };
}));

const faveId = await foundry.applications.api.DialogV2.wait({
    buttons,
    window: {
        title: "NPC Items",
        icon: "fa-solid fa-sword"
    },
    render: (event, html) => html.querySelector(".form-footer").style.flexDirection = "column",
    close: () => { return false; }
}, { id: "warcaster-dialog", width: 'auto' });

const item = await fromUuid(`${_token.actor.uuid}.Item.${faveId}`);
item.use({ legacy: false });
