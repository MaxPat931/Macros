async function spellCompendiumFolders(method) {
    const key = "dnd5e.spells";
    const pack = game.packs.get(key);

    let indexFields, configValue;
    if(method == "school"){
        indexFields = "system.school";
        configValue = "spellSchools";
    } else if(method == "level"){
        indexFields = "system.level";
        configValue = "spellLevels"
    }

    const index = await pack.getIndex({fields: [indexFields]});
    const config = CONFIG.DND5E[configValue];

    const folderData = Object.values(config).map(v => ({name: v, type: "Item"}));
    const folders = await Folder.createDocuments(folderData, {pack: key});

    const updates = [];
    for(const idx of index) {
        if(idx.type !== "spell") continue;
        let folderName;
        if (method == "school") {
            folderName = config[idx.system.school];
        } else if (method == "level") {
            folderName = config[idx.system.level];
        }
    const folder = folders.find(e => e.name === folderName);
    updates.push({_id: idx._id, folder: folder.id});
    }
    await Item.updateDocuments(updates, {pack: key});
}

async function clearCompendiumFolders() {
    const key = "dnd5e.spells";
    const pack = game.packs.get(key);
    if(pack.folders.size > 0){
        const index = await pack.getIndex();
        const updates = [];
        for(const idx of index) {
            updates.push({_id: idx._id, folder: null});
        }
        await Item.updateDocuments(updates, {pack: key});

        const packFolders = pack.folders
        const folderIds = packFolders.map(folder => folder.id);

        await Folder.deleteDocuments(folderIds, {pack: key});
        }
}

new Dialog({
    title: "Spell Compendium Folders",
    content: `<h1> Sort Spell Compendium by Spell Level or by Spell School?</h1>`,
    buttons: {
        level: {
            label: "Spell Level",
            callback: async () => {
            await clearCompendiumFolders();
            await spellCompendiumFolders("level");
            }
            },
        school: {
            label: "Spell School",
            callback: async () => {
            await clearCompendiumFolders();
            await spellCompendiumFolders("school");
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
