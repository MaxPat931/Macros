/// For dnd5e Versions 2.4.0 + 2.4.1 - NOT NECESSARY FOR VERSION 3.0.0 AND ABOVE
/// Hides Source Config and description.value from Players if the item is unidentified
Hooks.on("renderItemSheet", (sheet, [html]) => {
  if (game.user.isGM) return;
  const unidentified = sheet.item.system.identified === false;
  if (!unidentified) return;
  html.querySelectorAll(".dnd5e.sheet.item .sheet-header .summary li .config-button").forEach(n => n.remove()); //remove the Source config gear
  html.querySelectorAll(`.dnd5e.sheet.item [data-tab="description"] .item-description .accordion:first-child`).forEach(n => n.remove()); //remove the Description
});

/// When an item is used, and it is Unidentified, display the Chat Description if it exists, 
/// otherwise display the Unidentified description if it exists, 
/// otherwise display the Description (which is hidden from the player due to the above script)
Hooks.on("renderChatMessage", async (chatItem, html) => {
  const itemId = chatItem.flags.dnd5e?.use?.itemUuid;
  const itemData = await fromUuid(itemId);
  const unidentified = itemData?.system.identified === false;
  if (!unidentified) return;
  const itemDescription = itemData.system.description.value;
  const unidentifiedDesc = itemData.system.description.unidentified;
  const chatDesc = itemData.system.description.chat;
  const description = chatDesc || unidentifiedDesc || itemDescription;
  const cardContent = html.find(".card-content");
  cardContent.html(description);
});

/*
Hooks.on("renderActorsSheet5eCharacter", (sheet, html, data) => {
  Something with .item-summary?
});
*/

///Automatically retrieve Identified item from Source Item flag when Identified by a GM
///NOTE: This will replace any item that has a different name than the sourceId item's name
Hooks.on("updateItem", identify);

async function identify(item, update, options){
  if (game.user.isGM) {
    const identification = update.system?.identified === true;
    if(!identification) return;
    
    const sourceItem = await fromUuid(item.flags.core.sourceId);
    if (item.name === sourceItem.name) return;

    new Dialog({
      content: await TextEditor.enrichHTML(`<p>Do you want to replace ${item.name} with @UUID[${item.flags.core.sourceId}]?</p>`),
      title: "Identification",
      buttons: {
        yes: {label: "Yes",
          callback: async () => {
            const itemData = game.items.fromCompendium(sourceItem);
            let identified = await item.parent.createEmbeddedDocuments("Item", [itemData]);
              if(identified.length > 0) item?.delete();
  
            ChatMessage.create({
            user: game.user.id,
            content: `The ${item.name} has been identified as a ${sourceItem.name}`,
            })
          }
        },
        no: {label: "No"}
      }
    }).render(true);
  }
};
