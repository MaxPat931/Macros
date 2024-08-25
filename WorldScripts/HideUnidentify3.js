// CHOOSE THE APPROPRIATE SECTION FOR THE DND5E SYSTEM VERSION YOU ARE ON

// for DND5E version 3.0.0 - 3.3.1
// Prevent Players from Identifying their items by hiding the buttons from them, only the GM will be able to Identify them
// Remove Identify button at top of Item Sheet and right-click context menu
Hooks.on("renderItemSheet", (sheet, [html]) => {
  if (game.user.isGM) return;
  const unidentified = sheet.item.system.identified === false;
  if (!unidentified) return;
  html.querySelectorAll(".dnd5e.sheet.item .sheet-header .item-subtitle label:has(input:not([disabled]))").forEach(n => n.remove());
});

// Remove Identify button from Item Context menu on Actor Sheet
Hooks.on("dnd5e.getItemContextOptions", (item, buttons) => {
    if (game.user.isGM) return;
    const unidentified = item.system.identified === false;
    if (!unidentified) return;
    const removeUnid = buttons.findIndex(option => option.name === 'DND5E.Identify');
    buttons.findSplice(e => e.name === "DND5E.Identify");
});


// For DND5E 4.0.0
// Prevent Players from Identifying their items by hiding the buttons from them, only the GM will be able to Identify them
// Remove Identify button at top of Item Sheet
Hooks.on("renderItemSheet5e2", (sheet, [html]) => {
  if (game.user.isGM) return;
  const unidentified = sheet.item.system.identified === false;
  if (!unidentified) return;
  html.querySelectorAll(".pseudo-header-button.state-toggle.toggle-identified").forEach(n => n.remove());
});

// Remove Identify button from Item Context menu on Actor Sheet
Hooks.on("dnd5e.getItemContextOptions", (item, buttons) => {
    if (game.user.isGM) return;
    const unidentified = item.system.identified === false;
    if (!unidentified) return;
    const removeUnid = buttons.findIndex(option => option.name === 'DND5E.Identify');
    buttons.findSplice(e => e.name === "DND5E.Identify");
});
