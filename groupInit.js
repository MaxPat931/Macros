// Use with a selected group of tokens.
// Rolls initiative for one of those tokens, the sets that inititive value for all selected tokends
const tokenGroup = canvas.tokens.controlled
const roller = tokenGroup[1]
await roller.document.toggleCombatant();
await game.combat.rollNPC({ messageOptions: { rollMode: CONST.DICE_ROLL_MODES.PRIVATE }})

const initVal = roller.combatant.initiative
console.log(initVal)
await roller.document.toggleCombatant();

for(const token of canvas.tokens.controlled){
    await token.document.toggleCombatant();
    await token.combatant.update({initiative: initVal});
  }
