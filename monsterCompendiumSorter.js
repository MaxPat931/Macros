async function monsterTypeCompendium() {
    const key = "dnd5e.monsters";
    const pack = game.packs.get(key);
    const wasLocked = pack.locked;
    if (wasLocked) await pack.configure({locked:false});
    const index = await pack.getIndex({ fields: ["system.details.type.value"] });

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const folderData = Object.keys(CONFIG.DND5E.creatureTypes).map(v => ({
        name: capitalizeFirstLetter(v),
        type: "Actor"
    }));
    const folders = await Folder.createDocuments(folderData, { pack: key });

    const updates = [];
    for (const idx of index) {
        if (idx.type !== "npc") continue;
        const folderName = idx.system.details.type.value;
        const folder = folders.find(e => e.name === capitalizeFirstLetter(folderName));
        updates.push({ _id: idx._id, folder: folder.id });
    }

    await Actor.updateDocuments(updates, { pack: key });
    if (wasLocked) await pack.configure({locked:true});
    await ui.notifications.warn(`${pack.metadata.label} Type Folders Created`)
}

async function monsterCrCompendium() {
    const key = "dnd5e.monsters";
    const pack = game.packs.get(key);
    const wasLocked = pack.locked;
    if (wasLocked) await pack.configure({locked:false});
    const index = await pack.getIndex({ fields: ["system.details.cr"] });

    const uniqueCRs = [...new Set(index.map(entry => entry.system.details.cr))];
    const formattedCRs = uniqueCRs.map(cr => (cr >= 1 && cr <= 9) ? `CR 0${cr}` : `CR ${cr}`);

    const folderData = formattedCRs.map(cr => ({ name: `${cr}`, type: "Actor" }));
    const folders = await Folder.createDocuments(folderData, { pack: key });

    const updates = [];
    for (const idx of index) {
        if (idx.type !== "npc") continue;
        const cr = (idx.system.details.cr >= 1 && idx.system.details.cr <= 9) ? `0${idx.system.details.cr}` : `${idx.system.details.cr}`;
        const folderName = `CR ${cr}`;
        const folder = folders.find(e => e.name === folderName);
        updates.push({ _id: idx._id, folder: folder.id });
    }
    await Actor.updateDocuments(updates, { pack: key });
    if (wasLocked) await pack.configure({locked:true});
    await ui.notifications.warn(`${pack.metadata.label} CR Folders Created`)
}

async function clearCompendiumFolders() {
    const key = "dnd5e.monsters";
    const pack = game.packs.get(key);
    const wasLocked = pack.locked;
    if (wasLocked) await pack.configure({locked:false});
    if (pack.folders.size > 0) {
        const index = await pack.getIndex();
        const updates = [];
        for (const idx of index) {
            updates.push({ _id: idx._id, folder: null });
        }
        await Actor.updateDocuments(updates, { pack: key });

        const packFolders = pack.folders
        const folderIds = packFolders.map(folder => folder.id);

        await Folder.deleteDocuments(folderIds, { pack: key });
    }
    if (wasLocked) await pack.configure({locked:true});
    await ui.notifications.warn(`${pack.metadata.label} Folders Cleared`)
}

new Dialog({
    title: "Monster Compendium Folders",
    content: `<h1> Sort Monster Compendium by Creature Type or CR</h1>`,
    buttons: {
        type: {
            label: "Creature Type",
            callback: async () => {
                await clearCompendiumFolders();
                await monsterTypeCompendium();
            }
        },
        cr: {
            label: "Challenge Rating",
            callback: async () => {
                await clearCompendiumFolders();
                await monsterCrCompendium();
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
