/// This macro is supposed to be used with Anne Gregersen's Monster Loot supplements
/// It will send a whisper to the DM for the Targeted Creature, the Creature Type, the associated skill to harvest it, and the DC of the check
/// It provides a drop down to select which type of Harvest check the player will be doing
/// And roll according to the Adv/Normal/Disadv buttons selected

if (game.user.targets.size !== 1)
    ui.notifications.warn(`Please target one token to harvest.`)
else{

let actors = canvas.tokens.controlled.map(({ actor }) => actor);
const intMod = actor.data.data.abilities.int.mod;
const arc = actor.data.data.skills.arc.prof;
const rel = actor.data.data.skills.rel.prof;
const sur = actor.data.data.skills.sur.prof;
const nat = actor.data.data.skills.nat.prof;
const [target] = game.user.targets;
const targetDc = target.actor.data.data.details.cr;
const targetType = target.actor.data.data.details.type.value;
const harvestItem = target.actor.items.getName(`${target.data.name} Harvest`) //worthless right now, grab item id by name from target

const checkTypes = {
    beast: 'Nature',
    dragon: 'Nature',
    giant: 'Nature',
    monstrosity: 'Nature',
    plant: 'Nature',
    humanoid: 'Survival',
    celestial: 'Religion',
    fiend: 'Religion',
    undead: 'Religion',
    aberration: 'Arcana',
    construct: 'Arcana',
    elemental: 'Arcana',
    fey: 'Arcana',
    ooze: 'Arcana'
};

let checkSkill = checkTypes[targetType]

function advRoll(skillCheck) {
    let xroll = new Roll(`2d20kh+${intMod}+${skillCheck}`).evaluate({async: false});
    let messageContent;
    if (xroll.total >= 10+targetDc) { messageContent = `${actor.data.name} succeds, harvesting all items! `} // Edit this content for great success.
    else if (xroll.total <= 4+targetDc) { messageContent = `${actor.data.name} fails, harvesting no items.`} // Edit this content for failure.
    else if (xroll.total <= 9+targetDc) { messageContent = `${actor.data.name} suffers a mishap during harvesting, only harvesting half of the items shown.`} // Edit this content for mundane success.
    xroll.toMessage({ flavor: `${actor.data.name} attempts to harvest the ${target.data.name}`})
    let chatData = {
        user: game.data.userId,
        //speaker: ChatMessage.getSpeaker(),
        content: messageContent,
        //whisper: game.collections.get("User").filter((u) => u.isGM).map((u) => game.data.userId)
        whisper: ChatMessage.getWhisperRecipients('GM'),
      }
    ChatMessage.create(chatData, {});
};

function normalRoll(skillCheck) {
    let xroll = new Roll(`1d20+${intMod}+${skillCheck}`).evaluate({async: false});
    let messageContent;
    if (xroll.total >= 10+targetDc) { messageContent = `${actor.data.name} succeds, harvesting all items! `} // Edit this content for great success.
    else if (xroll.total <= 4+targetDc) { messageContent = `${actor.data.name} fails, harvesting no items.`} // Edit this content for failure.
    else if (xroll.total <= 9+targetDc) { messageContent = `${actor.data.name} suffers a mishap during harvesting, only harvesting half of the items shown.`} // Edit this content for mundane success.
    xroll.toMessage({ flavor: `${actor.data.name} attempts to harvest the ${target.data.name}`})
    let chatData = {
        user: game.data.userId,
        //speaker: ChatMessage.getSpeaker(),
        content: messageContent,
        //whisper: game.collections.get("User").filter((u) => u.isGM).map((u) => game.data.userId)
        whisper: ChatMessage.getWhisperRecipients('GM'),
      }
    ChatMessage.create(chatData, {});
};

function disRoll(skillCheck) {
    let xroll = new Roll(`2d20kl+${intMod}+${skillCheck}`).evaluate({async: false});
    let messageContent;
    if (xroll.total >= 10+targetDc) { messageContent = `${actor.data.name} succeds, harvesting all items! `} // Edit this content for great success.
    else if (xroll.total <= 4+targetDc) { messageContent = `${actor.data.name} fails, harvesting no items.`} // Edit this content for failure.
    else if (xroll.total <= 9+targetDc) { messageContent = `${actor.data.name} suffers a mishap during harvesting, only harvesting half of the items shown.`} // Edit this content for mundane success.
    xroll.toMessage({ flavor: `${actor.data.name} attempts to harvest the ${target.data.name}`})
    let chatData = {
        user: game.data.userId,
        //speaker: ChatMessage.getSpeaker(),
        content: messageContent,
        //whisper: game.collections.get("User").filter((u) => u.isGM).map((u) => game.data.userId)
        whisper: ChatMessage.getWhisperRecipients('GM'),
      }
    ChatMessage.create(chatData, {});
};

ChatMessage.create({
    content: `<b>${actor.data.name} is harvesting:</b> ${target.data.name} <p><b>Type:</b> ${targetType} <b>Harvest Skill:</b> ${checkSkill}  <p><b>DC:</b> [[floor(10+${targetDc})]]</p>`, ///need to set max of 30?
    whisper: ChatMessage.getWhisperRecipients('GM'),
  })

let d = new Dialog({
    title: 'Harvest Check',
    content: `
      <form class="flexcol">
        <div class="form-group">
          <label for="exampleSelect">Select Harvest Type</label>
          <select id="exampleSelect">
            <option value="${arc}">Arcana - Aberration, Construct, Elemental, Fey, Ooze</option>
            <option value="${rel}">Religion - Celestial, Fiend, Undead</option>
            <option value="${sur}">Survival - Humanoid</option>
            <option value="${nat}">Nature - Beast, Dragon, Giant, Monstrosity, Plant</option>
          </select>
        </div>
      </form>
    `,
    buttons: {
      advantage:{
          label: 'Advantage',
          callback: (html) => { advRoll(`+${html.find("#exampleSelect")[0].value}`),
            harvestItem.roll({rollMode: CONST.DICE_ROLL_MODES.PRIVATE})
        }
      },
      normal: {
        label: 'Normal',
        callback: (html) => { normalRoll(`+${html.find("#exampleSelect")[0].value}`),
        harvestItem.roll({rollMode: CONST.DICE_ROLL_MODES.PRIVATE})
        }
      },
      disadvantage: {
        label: 'Disadvantage',
        callback: (html) => { disRoll(`+${html.find("#exampleSelect")[0].value}`),  
            harvestItem.roll({rollMode: CONST.DICE_ROLL_MODES.PRIVATE})  
        }
      },
    },
    default: 'yes',
    close: () => {
      console.log('Dialog Closed');
    }
  }).render(true)
}
