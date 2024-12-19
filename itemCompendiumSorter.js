const key = "dnd5e.items";
const pack = game.packs.get(key);
const wasLocked = pack.locked;
const Cls = pack.documentClass;

const type = await foundry.applications.api.DialogV2.wait({
  window: {
    icon: "fas fa-atlas",
    title: "Item Compendium Folders",
  },
  position: {
    width: 400,
    height: "auto",
  },
  content: "<p>Sort item compendium by type or by rarity?</p>",
  rejectClose: false,
  buttons: [
    {action: "type", label: "Type"},
    {action: "rarity", label: "Rarity"},
  ],
});
if (!type) return;

if (wasLocked) await pack.configure({locked: false});

const fields = [
  type === "type" ? "type" : null,
  type === "rarity" ? "system.rarity" : null,
].filter(_ => _);
const index = await pack.getIndex({fields: fields});

// Remove old folders.
await getDocumentClass("Folder").deleteDocuments(pack.folders.map(f => f.id), {pack: key});

// Map documents to new folders, created dynamically.
const folders = new Map();
const updates = [];
const size = index.size;
const notif = ui.notifications.info("Foldering the compendium...", {progress: true, pct: 0});

for (const [i, idx] of Array.from(index.values()).entries()) {
  const path = fields[0];
  const value = foundry.utils.getProperty(idx, path);
  let label;
  switch (type) {
    case "type":
      label = game.i18n.localize(CONFIG[Cls.documentName].typeLabels[value]);
      break;
    case "rarity":
      label = CONFIG.DND5E.itemRarity[value]?.capitalize() ?? "Mundane";
      break;
    default:
      continue;
  }

  if (!folders.get(label)) {
    const folder = await getDocumentClass("Folder").create({
      name: label,
      type: Cls.documentName,
    }, {pack: key});
    folders.set(label, folder);
  }
  const folder = folders.get(label);
  updates.push({_id: idx._id, folder: folder.id});
  if (game.release.generation > 12) notif.update({pct: i / size});
}
await Cls.updateDocuments(updates, {pack: key});
if (wasLocked) await pack.configure({locked: true});

if (game.release.generation > 12) notif.update({message: "Foldering complete!", pct: 1});
else ui.notifications.info("Foldering complete!");
