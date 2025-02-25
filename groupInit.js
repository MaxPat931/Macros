// Use with a selected group of tokens.
// Rolls initiative for one of those tokens, the sets that inititive value for all selected tokends
const tokenGroup = canvas.tokens.controlled
const roller = tokenGroup[0]
await roller.document.toggleCombatant();
await game.combat.rollNPC({ messageOptions: { rollMode: CONST.DICE_ROLL_MODES.PRIVATE }})
const initVal = roller.combatant.initiative
for(const token of tokenGroup.slice(1)){
    await token.document.toggleCombatant();
    await token.combatant.update({initiative: initVal});
  }
