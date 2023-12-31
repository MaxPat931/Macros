const key = "dnd5e.items";
const pack = game.packs.get(key);
const wasLocked = pack.locked;

async function itemCompendiumFolders(method) {
  if (wasLocked) await pack.configure({ locked: false });

  let indexFields;
  if (method == "Type") {
    indexFields = "type";
  } else if (method == "Rarity") {
    indexFields = "system.rarity";
  }

  const index = await pack.getIndex({ fields: [indexFields] });

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const uniqueTypes = [...new Set(index.map(entry => {
    const nestedFields = indexFields.split('.');
    let nestedValue = entry;
    for (const field of nestedFields) {
      nestedValue = nestedValue[field];
    }
    return nestedValue;
  }))];

  const folderData = uniqueTypes.map(v => ({
    name: capitalizeFirstLetter(v) || "Mundane",
    type: "Item"
  }));
  const folders = await Folder.createDocuments(folderData, { pack: key });

  const updates = [];
  for (const idx of index) {
    const folderName = idx[indexFields] || "Mundane";
    const folder = folders.find(e => e.name === capitalizeFirstLetter(folderName));
    updates.push({ _id: idx._id, folder: folder.id });
  }
  await Item.updateDocuments(updates, { pack: key });
  if (wasLocked) await pack.configure({ locked: true });
  await ui.notifications.warn(`${pack.metadata.label} ${method} Folders Created`)
}

async function clearCompendiumFolders() {
  if (wasLocked) await pack.configure({ locked: false }); //Unlock the compendium if it was locked
  if (pack.folders.size > 0) {
    const index = await pack.getIndex(); //get all documents in the pack
    const updates = [];
    for (const idx of index) {
      updates.push({ _id: idx._id, folder: null });
    }
    await Item.updateDocuments(updates, { pack: key }); //remove folder data from docs *CHANGE* Item to your comp's type

    const packFolders = pack.folders //grab all the folders
    const folderIds = packFolders.map(folder => folder.id); //get an array of the ids
    await Folder.deleteDocuments(folderIds, { pack: key }); //nuke the folders
    await ui.notifications.warn(`${pack.metadata.label} Folders Cleared`) //completed notification!
  };
  if (wasLocked) await pack.configure({ locked: true }); //relock the compendium if it was previously locked
}

new Dialog({
  title: "Item Compendium Folders",
  content: `<h1> Sort Item Compendium by Type or by Rarity?</h1>`,
  buttons: {
    level: {
      label: "Type",
      callback: async () => {
        await clearCompendiumFolders();
        await itemCompendiumFolders("Type");
      }
    },
    school: {
      label: "Rarity",
      callback: async () => {
        await clearCompendiumFolders();
        await itemCompendiumFolders("Rarity");
      }
    },
    clear: {
      label: "Clear Folders",
      callback: async () => {
        await clearCompendiumFolders();
      }
    }
  }
}).render(true);
