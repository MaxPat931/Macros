Hooks.on("renderItemSheet", (sheet, [html]) => {
  if (game.user.isGM) return;
  const unidentified = sheet.item.system.identified === false;
  if (!unidentified) return;
  html.querySelectorAll(".dnd5e.sheet.item .sheet-header .item-subtitle label:has(input:not([disabled]))").forEach(n => n.remove()); //remove Identified toggle on item
});

Hooks.on("dnd5e.getItemContextOptions", (item, steve) => {
    if (game.user.isGM) return;
    const unidentified = item.system.identified === false;
    if (!unidentified) return;
    steve.pop();
});
