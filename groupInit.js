// Use with a selected group of tokens.
const tokenGroup = canvas.tokens.controlled;
const roller = tokenGroup[0];
//If the first selected token is not in itiative, roll init and add remaining selected tokens to that init value
if (!roller.combatant) {
    await roller.document.toggleCombatant();
    await game.combat.rollNPC({ messageOptions: { rollMode: CONST.DICE_ROLL_MODES.PRIVATE } });
    const initVal = roller.combatant.initiative;
    for (const token of tokenGroup.slice(1)) {
        if (!token.combatant) await token.document.toggleCombatant();
        await token.combatant.update({ initiative: initVal });
    }
//If the first selected token is in itiative, then add/reassign remaining selected tokens to that init value
} else {
    const initVal = roller.combatant.initiative;
    for (const token of tokenGroup.slice(1)) {
        if (!token.combatant) await token.document.toggleCombatant();
        await token.combatant.update({ initiative: initVal });
    }
};
//Adds/updates an Active Effect on the token to visually indicate groups
function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
const effectName = "Token Group";
const rollerEffect = roller.actor.effects.find(e => e.name === effectName);
const color = rollerEffect ? rollerEffect.tint : getRandomColor();
const effectData = {
    name: effectName,
    icon: "icons/svg/combat.svg",
    tint: color,
    duration: {
        startTime: game.time.worldTime,
        rounds: 10
    }
};

for (const token of tokenGroup) {
    const existingEffect = token.actor.effects.find(e => e.label === effectName);
    if (existingEffect) {
        existingEffect.update({ tint: color });
    } else {
        token.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
    }
}
