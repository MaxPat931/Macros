const tokenActor = token?.actor ?? game.user.character;
const faves = tokenActor.system.favorites;

const sortedFaves = faves.sort((a, b) => a.sort - b.sort);

async function getFaveLabel(fave) {
    const fullItem = await fromUuid(`${_token.actor.uuid}${fave.id}`);
    return `<span class="item-tooltip item " data-favorite-id="${fave.id}" data-item-id="${fave.id}" draggable="true" data-tooltip="
        <section class=&quot;loading&quot; data-uuid=${_token.actor.uuid}${fave.id}><i class=&quot;fas fa-spinner fa-spin-pulse&quot;></i></section>
      " data-tooltip-class="dnd5e2 dnd5e-tooltip item-tooltip" data-tooltip-direction="LEFT">
      <img src="${fullItem.img}" height="30" style="vertical-align: middle; margin-right: 5px;"> 
      ${fullItem.name} ${fullItem.system.uses?.value ? `(${fullItem.system.uses?.value}/${fullItem.system.uses?.max})` : ""}
      </span>
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
        title: "Favorite Items",
        icon: "fa-solid fa-star"
    },
    render: (event, html) => html.querySelector(".form-footer").style.flexDirection = "column",
    close: () => { return false; }
}, { id: "faves-dialog", width: 'auto' });

const item = await fromUuid(`${_token.actor.uuid}${faveId}`);
item.use({ legacy: false });
