///Hides Source Config from Players if the item is unidentified
Hooks.on("renderItemSheet", (sheet, [html]) => {
  if (game.user.isGM) return;
  const unidentified = sheet.item.system.identified === false;
  if (!unidentified) return;
  html.querySelectorAll(".dnd5e.sheet.item .sheet-header .summary li .config-button").forEach(n => n.remove());
});
