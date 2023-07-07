// Originally adapted from from Jenthura's DnD5e Conditions Macro ( https://github.com/jenthura/foundryVTT5eConditionRulesMacro/blob/master/ConditionRulesMacro.js )
// Improved with the help of Freeze and Zhell in #macro-polo
// Updated for Crucible 0.5.6

const content = `<style>
  #conditions-dialog .dialog-buttons {
      display: grid;
      gap: 1em;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      background-image:url('systems/crucible/ui/journal/overlay.png');
      background-size: contain;
      background-repeat: no-repeat;
      
  }
  #conditions-dialog .button-image {
      max-width: 50px;
      max-height: 50px;
      border: none;
  }
}
</style>`

// const buttons = CONFIG.statusEffects.toSorted((a,b) => a.id>b.id ? 1 : -1).reduce((acc, data) => {  // Use this line instead of the next to have the conditions in alphabetical order
const buttons = CONFIG.statusEffects.reduce((acc, data) => {
  acc[data.id] = {
    label: `<img class="button-image" src="${data.icon}"> <div><label><h2>${game.i18n.localize(data.label)}</h2></label></div>`,
    callback
  };
  return acc;
}, {});

const bigObjectOfDescriptions = {
    weakened: 
        "<p>A creature that is <strong>Weakened</strong> is vulnerable to taking deadly wounds. Protagonists become Weakened when they reach zero Health. Any further damage to Health taken while Weakened increases Wounds.</p><p>While a creature is Weakened, it suffers -1 to maximum Action, loses access to a free Movement action, and suffers an additional <strong>2 Vulnerability</strong> to any <strong>Morale</strong> damage sustained.</p>",
    inacapacitated: 
        "<p>When a creature is entirely unable to act, it is <strong>Inacapacitated</strong>. When a target is Incapacitated, its <strong>Dodge, Block, </strong>and<strong> Parry</strong> defenses become zero and it no longer benefits from <strong>Ability Score</strong> bonuses to <strong>Fortitude, Willpower, </strong>or Reflex defense. It cannot contribute to Flanking or otherwise aid allies.</p>",
    dead: 
        "<p>When a protagonist's Wounds reach their maximum value, or when an adversary's Health reaches zero, that character is <strong>Dead</strong>. A creature which is Dead is also treated as <strong>Incapacitated</strong>, can no longer Rest, and cannot be revived except by magical means.</p>",
    broken: 
        "<p>A creature that is <strong>Broken</strong> is vulnerable to psychological trauma. Protagonists become Broken when they reach zero Morale. Any further damage to Morale taken while Broken increases Madness.</p><p>While a creature is Broken it cannot expend <strong>Focus</strong>, actions it takes suffer from <strong>+2 Banes</strong>, and it suffers an additional <strong>2 Vulnerability</strong> to any <strong>Health</strong> damage sustained.</p><p>Creatures which are Broken cannot contribute towards Flanking. Non-player Adversaries which become Broken will attempt to flee the battle unless they lack instincts of self-preservation or escape seems impossible.</p>",
    insane: 
        "<p>When a protagonist's Madness reaches its maximum value, that character is <strong>Insane</strong>. A character which is Insane may no longer be controlled by its player and is controlled by the Gamemaster. This condition cannot be healed or cured except by magical means.</p>",
    staggered: 
        "<p>A creature that is <strong>Staggered</strong> temporarily has 1 fewer Action Point available than normal.</p>",
    stunned: 
        "<p>A creature that is <strong>Stunned</strong> temporarily has 2 fewer Action Points available than normal.</p>",
    slowed: 
        "<p>A creature that is <strong>Slowed</strong> pays a +1 Action cost for any Action that involves Movement, including the free Move action each Turn which costs 1 AP instead.</p>",
    disoriented: 
        "<p>A creature that is <strong>Disoriented </strong>incurs a +1 Focus cost to all Actions which require Focus.</p>",
    restrained: 
        "<p>A creature that is <strong>Restrained</strong> is unable to perform any Action which involves Movement.</p>",
    prone: 
        "<p>A creature that has been knocked to the ground, or has voluntarily thrown itself to the ground is considered <strong>Prone</strong>. While Prone, the creature is <strong>Exposed</strong> against melee attacks. Returning to your feet from a Prone position requires one Movement action, however that Movement may only move a maximum of 1 Space.</p>",
    blinded: 
        `TBD`,
    deafened: 
        `TBD`,
    silenced: 
        `TBD`,
    enraged: 
        "<p>When a creature is <strong>Enraged</strong>, it behaves recklessly and is less able to defend itself. An <strong>Enraged</strong> creature's Block and Parry defenses become zero and that creature cannot expend Focus.</p>",
    frightened: 
        "<p>A creature that is <strong>Frightened</strong> cannot recover Morale or heal Madness for the duration of the Frightened effect.</p>",
    invisible: 
        `TBD`,
    resolute: 
        "<p>A creature which is <strong>Resolute</strong> is temporarily immune to Morale or Madness damage.</p>.",
    guarded: 
        "<p>Some terrain or abilities may temporarily harden a creature's defenses. When a creature is <strong>Guarded </strong>attacks against it suffer +1 Banes.</p>",
    exposed: 
        "<p>Some attacks can leave an enemy temporarily vulnerable. When a creature is <strong>Exposed</strong> attacks against it gain +2 Boons.</p>",
    flanked: 
        "<p>When a creature is <strong>Engaged</strong> by multiple foes which are its own size or larger and those foes are located on opposite sides of its square, the creature is considered to be <strong>Flanked</strong>.</p><p>When attacking a creature that is your size or smaller that is currently <strong>Flanked</strong>, you gain a number of <strong>Boons</strong> to Attack abilities equal to the number of flanking allies (excluding yourself).</p>",
    diseased: 
        "<p>A creature that is <strong>Diseased</strong> cannot recover Health or heal Wounds for the duration of the Diseased effect.</p>",
    paralyzed: 
        "<p>A creature that is <strong>Paralyzed</strong> is unable to perform Actions until the paralysis is ended. During this time the target is <strong>Incapacitated</strong>.</p>",
    unaware: 
        "<p>A creature that is <strong>Unaware</strong> acts in combat at Initiative 1 and cannot perform Reactions.</p>",
    invlunerable:
        "<p>A creature that is <strong>Invulnerable</strong> is temporarily immune to Health or Wounds damage.</p>"
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

new Dialog({content,buttons},{classes: ["dialog", "crucible-new"], id: "conditions-dialog", width: "auto !important", height: "auto !important"}).render(true);
