// Adapted from from Jenthura's DnD5e Conditions Macro ( https://github.com/jenthura/foundryVTT5eConditionRulesMacro/blob/master/ConditionRulesMacro.js )
// Cleaned up thanks to Freeze and Zhell in #macro-polo

const content = `<style>
  #conditions-dialog .dialog-buttons {
      display: grid;
      gap: 1em;
      grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  #conditions-dialog .button-image {
      max-width: 50px;
      max-height: 50px;
  }
}
</style>`

// Originally adapted from from Jenthura's DnD5e Conditions Macro ( https://github.com/jenthura/foundryVTT5eConditionRulesMacro/blob/master/ConditionRulesMacro.js )
// Improved with the help of Freeze and Zhell in #macro-polo

const buttons = CONFIG.statusEffects.reduce((acc, data) => {
  acc[data.id] = {
    label: `<img class="button-image" src="${data.icon}"> <div><label>${game.i18n.localize(data.label)}</label></div>`,
    callback
  };
  return acc;
}, {});



const bigObjectOfDescriptions = {
    incapacitated: 
        "When a creature is entirely unable to act, it is Inacapacitated. When a target is Incapacitated, its Dodge, Block, and Parry defenses become zero and it no longer benefits from Ability Score bonuses to Fortitude, Willpower, or Reflex defense. Any further damage to Health suffered while Incapacitated is taken as Wounds.",
    dead: 
        "When a protagonist's Wounds reach their maximum value, or when an adversary's Health reaches zero, that character is Dead. A creature which is Dead is also treated as Incapacitated, can no longer Rest, and cannot be revived except by magical means.",
    broken: 
        "When a creature's Morale reaches zero, its will to fight and capacity to make rational decisions in combat is Broken. Creatures that are Broken will typically attempt to flee the battle. Actions taken by Broken creatures have +2 Banes and Broken creatures cannot expend Focus. Any further damage to Morale suffered while Broken is taken as Madness.",
    insane: 
        "When a protagonist's Madness reaches its maximum value, that character is Insane. A character which is Insane may no longer be controlled by its player and is controlled by the Gamemaster. This condition cannot be healed or cured except by magical means.",
    staggered: 
        "A creature that is Staggered temporarily has 1 fewer Action Point available than normal.",
    stunned: 
        "A creature that is Stunned temporarily has 2 fewer Action Points available than normal.",
    slowed: 
        "A creature that is Slowed pays a +1 Action cost for any Action that involves Movement, including the free Move action each Turn which costs 1 AP instead.",
    disoriented: 
        "A creature that is Disoriented incurs a +1 Focus cost to all Actions which require Focus.",
    restrained: 
        "A creature that is Restrained is unable to perform any Action which involves Movement.",
    prone: 
        "A creature that has been knocked to the ground, or has voluntarily thrown itself to the ground is considered Prone. While Prone, the creature is Exposed against melee attacks. Returning to your feet from a Prone position requires one Movement action, however that Movement may only move a maximum of 1 Space.",
    blinded: 
        `TBD`,
    deafened: 
        `TBD`,
    silenced: 
        `TBD`,
    enraged: 
        "When a creature is Enraged, it behaves recklessly and is less able to defend itself. An Enraged creature's Block and Parry defenses become zero and that creature cannot expend Focus.",
    frightened: 
        "A creature that is Frightened cannot recover Morale or heal Madness for the duration of the Frightened effect.",
    invisible: 
        `TBD`,
    resolute: 
        "A creature which is Resolute is temporarily immune to Morale damage.",
    guarded: 
        "Some terrain or abilities may temporarily harden a creature's defenses. When a creature is Guarded attacks against it suffer +1 Banes.",
    exposed: 
        "Some attacks can leave an enemy temporarily vulnerable. When a creature is Exposed attacks against it gain +2 Boons.",
    flanked: 
        "When a creature is Engaged by multiple foes which are its own size or larger and those foes are located on opposite sides of its square, the creature is considered to be Flanked.<br>When attacking a creature that is your size or smaller that is currently Flanked, you gain a number of Boons to Attack abilities equal to the number of flanking allies (excluding yourself).",
    diseased: 
        "A creature that is Diseased cannot recover Health or heal Wounds for the duration of the Diseased effect.",
    paralyzed: 
        "A creature that is Paralyzed is unable to perform Actions until the paralysis is ended. During this time the target is Incapacitated.",
    unaware: 
        "A creature that is Unaware acts in combat at Initiative 1 and cannot perform Reactions."
};


async function callback(html, event){
  const id = event.currentTarget.dataset.button;
  const status = CONFIG.statusEffects.find(e => e.id === id);
  const header = `<h1 style="text-align:center;">${game.i18n.localize(status.label)}</h1><img style="vertical-align: text-top;float: left;border:none;margin: 0px 5px;" height=45px  height=50px width=50px src= ${status.icon}>`
  const text = bigObjectOfDescriptions[id];
  return ChatMessage.create({
    speaker: {alias: "Conditions"},
    content: `<div class="crucible-new" style="background-image:url('systems/crucible/ui/journal/overlay.png');background-color: black;background-size: cover;padding:5px;"> ${header} ${text} </div>`
  });
}

new Dialog({content,buttons},{id: "conditions-dialog", width: "auto !important", height: "auto !important"}).render(true);
