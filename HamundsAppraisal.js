/// This macro is supposed to be used with Hammonds Harvesting Guide
/// It will send a whisper to the DM for the Targeted Creature, the Creature Type, the associated skill to appraise it, and the DC of the check
/// It provides a drop down to select which type of Appraisal check the player will be doing
/// And roll according to the Adv/Normal/Disadv buttons selected

if (game.user.targets.size !== 1) {
  return ui.notifications.warn("Please target exactly one token to appraise.");
}
const target = game.user.targets.first();
const tsd = target.actor.system.details;
const checkSkill = {
  beast: "nat",
  dragon: "nat",
  giant: "med",
  monstrosity: "nat",
  plant: "nat",
  humanoid: "med",
  celestial: "arc",
  fiend: "arc",
  undead: "arc",
  aberration: "arc",
  construct: "inv",
  elemental: "arc",
  fey: "arc",
  ooze: "inv"
}[tsd.type.value];
if (!checkSkill || !(tsd.type.value in CONFIG.DND5E.creatureTypes)) {
  return ui.notifications.warn("Target actor has no creature type.");
}
const dc = Math.floor(8 + tsd.cr);
ChatMessage.create({
  content: `
  <strong>Appraisal of:</strong> ${target.document.name}
  <br>
  <strong>Type:</strong> ${game.i18n.localize(CONFIG.DND5E.creatureTypes[tsd.type.value])}
  <p><strong>Appraisal Skill:</strong> ${CONFIG.DND5E.skills[checkSkill].label}
  <br>
  <strong>DC:</strong> ${dc}</p>`,
  whisper: ChatMessage.getWhisperRecipients('GM'),
});

return actor.rollSkill(checkSkill, {event, targetValue: dc});
