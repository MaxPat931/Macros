// Adapted from from Jenthura's DnD5e Conditions Macro ( https://github.com/jenthura/foundryVTT5eConditionRulesMacro/blob/master/ConditionRulesMacro.js )

function postToChat(conditionName, imgURL, message){
    let chatData = {
    user: game.user._id,
    speaker: {alias: "Conditions"},
    content: `<div class="dnd5e chat-card" style="text-align: center"><header class="card-header flexrow"><h3 class="item-name">${conditionName}</h3></div><br><div><img style="vertical-align: text-top;float: left;margin: 0px 5px;" height=45px src="${imgURL}"</img> ${message}</div>`
  };
  ChatMessage.create(chatData, {});
  };
  let chatMsg = ''
  let d = new Dialog({
  title: "Conditions",
  buttons: {
  one: {
   label: "<img src= systems/crucible/icons/statuses/broken.svg> Broken",
   callback: () => {postToChat(`Broken`,`systems/crucible/icons/statuses/broken.svg`, `When a creature's Morale reaches zero, it's will to fight and capacity to make rational decisions in combat is Broken. Creatures that are Broken will typically attempt to flee the battle. Actions taken by Broken creatures have +2 Banes and Broken creatures cannot expend Focus. Any further damage to Morale suffered while Broken is taken as Madness.`)}
  },
  two: {
    label: "<img src= icons/svg/skull.svg> Dead ",
    callback: () => {postToChat(`Dead`, `icons/svg/skull.svg`, `When a protagonist's Wounds reach their maximum value, or when an adversary's Health reaches zero, that character is Dead. A creature which is Dead is also treated as Incapacitated, can no longer Rest, and cannot be revived except by magical means.`)}
   },
   three: {
    label: "Diseased",
    callback: () => {postToChat(`Diseased`, ``, `A creature that is Diseased cannot recover Health or heal Wounds for the duration of the Diseased effect.`)}
   },
  four: {
    label: "Engaged",
    callback: () => {postToChat(`Engaged`, ``, `When a creature is in base contact with an enemy and is not incapacitated, it is considered to have that enemy Engaged.`)}
   },
  five: {
    label: "<img src= systems/crucible/icons/statuses/enraged.svg> Enraged",
    callback: () => {postToChat(`Enraged`, `systems/crucible/icons/statuses/enraged.svg`, `When a creature is Enraged, it behaves recklessly and is less able to defend itself. An Enraged creature's Block and Parry defenses become zero and that creature cannot expend Focus.`)}
   },
  six: {
    label: "<img src= systems/crucible/icons/statuses/exposed.svg> Exposed",
    callback: () => {postToChat(`Exposed`, `systems/crucible/icons/statuses/exposed.svg`, `Some attacks can leave an enemy temporarily vulnerable. When a creature is Exposed attacks against it gain +2 Boons.`)}
   },
  seven: {
    label: "<img src= systems/crucible/icons/statuses/flanked.svg> Flanked",
    callback: () => {postToChat(`Flanked`, `systems/crucible/icons/statuses/flanked.svg`, `When a creature is Engaged by multiple foes which are its own size or larger and those foes are located on opposite sides of its square, the creature is considered to be Flanked.<br>When attacking a creature that is your size or smaller that is currently Flanked, you gain a number of Boons to Attack abilities equal to the number of flanking allies (excluding yourself).`)}
   },
  eight: { 
    label: "<img src= icons/svg/terror.svg> Frightened",
    callback: () => {postToChat(`Frightened`, `icons/svg/terror.svg`, `A creature that is Frightened cannot recover Morale or heal Madness for the duration of the Frightened effect.`)}
   },
  nine: {
    label: "<img src= icons/svg/unconscious.svg> Incapacitated",
    callback: () => {postToChat(`Incapacitated`, `icons/svg/unconscious.svg`, `When a creature is entirely unable to act, it is Inacapacitated. When a target is Incapacitated, its Dodge, Block, and Parry defenses become zero and it no longer benefits from Ability Score bonuses to Fortitude, Willpower, or Reflex defense. Any further damage to Health suffered while Incapacitated is taken as Wounds.`)}
   },
  ten: {
    label: "<img src= systems/crucible/icons/statuses/insane.svg> Insane",
    callback: () => {postToChat(`Insane`, `systems/crucible/icons/statuses/insane.svg`, `When a protagonist's Madness reaches its maximum value, that character is Insane. A character which is Insane may no longer be controlled by its player and is controlled by the Gamemaster. This condition cannot be healed or cured except by magical means.`)}
   },
  eleven: {
    label: "<img src= icons/svg/falling.svg> Prone",
    callback: () => {postToChat(`Prone`, `icons/svg/falling.svg`, `A creature that has been knocked to the ground, or has voluntarily thrown itself to the ground is considered Prone. While Prone, the creature is Exposed against melee attacks. Returning to your feet from a Prone position requires one Movement action, however that Movement may only move a maximum of 1 Space.`)}
   },
  twelve: {
    label: "<img src= systems/crucible/icons/statuses/resolute.svg> Resolute",
    callback: () => {postToChat(`Resolute`, `systems/crucible/icons/statuses/resolute.svg`, `A creature which is Resolute is temporarily immune to Morale damage.`)}
   },
  thirteen: {
    label: "<img src= systems/crucible/icons/statuses/staggered.svg> Staggered",
    callback: () => {postToChat(`Staggered`, `systems/crucible/icons/statuses/staggered.svg`, `A creature that is Staggered temporarily has 1 fewer Action Point available than normal.`)}
   },
  fourteen: {
    label: "<img src= icons/svg/daze.svg> Stunned",
    callback: () => {postToChat(`Stunned`, `icons/svg/daze.svg`, `A creature that is Stunned temporarily has 2 fewer Action Points available than normal.`)}
   },
  fifteen: {
    label: "Paralyzed",
    callback: () => {postToChat(`Paralyzed`, ``, `A creature that is Paralyzed is unable to perform Actions until the paralysis is ended. During this time the target is Incapacitated.`)}
   },
  sixteen: {
  label: "<img src= systems/crucible/icons/statuses/slowed.svg> Slowed",
  callback: () => {postToChat(`Slowed`, `systems/crucible/icons/statuses/slowed.svg`, `A creature that is Slowed pays a +1 Action cost for any Action that involves Movement, including the free Move action each Turn which costs 1 AP instead.`)}
  },
  seventeen: {
  label: "<img src= icons/svg/net.svg> Restrained",
  callback: () => {postToChat(`Restrained`, `icons/svg/net.svg`, `A creature that is Restrained is unable to perform any Action which involves Movement.`)}
  },
  eighteen: {
  label: "<img src= systems/crucible/icons/statuses/disoriented.svg> Disoriented",
  callback: () => {postToChat(`Disoriented`, `systems/crucible/icons/statuses/disoriented.svg`, `A creature that is Disoriented incurs a +1 Focus cost to all Actions which require Focus.`)}
  },
  nineteen: {
  label: "<img src= systems/crucible/icons/statuses/guarded.svg> Guarded",
  callback: () => {postToChat(`Guarded`, `systems/crucible/icons/statuses/guarded.svg`, `Some terrain or abilities may temporarily harden a creature's defenses. When a creature is Guarded attacks against it suffer +1 Banes.`)}
  },
  twenty: {
  label: "Unaware",
  callback: () => {postToChat(`Unaware`, ``, `A creature that is Unaware acts in combat at Initiative 1 and cannot perform Reactions.`)}
  },
  twentyone: {
  label: "Unconcious",
  callback: () => {postToChat(`Unconcious`, ``, `When a character's Health reaches zero, they become Unconscious. During this time they fall Prone and are Incapacitated.`)}
  },
  },
  default: "one",
  });
  d.render(true);
