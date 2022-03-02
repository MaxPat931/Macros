/// This macro is supposed to be used with Anne Gregersen's Monster Loot supplements
/// It will send a public chat card for the Targeted Creature, the Creature Type, the associated skill to harvest it, and the DC of the check
/// It provides a drop down for the player to select which type of Harvest check they will be doing
/// And roll according to the Adv/Normal/Disadv buttons selected
/// It will then send a chat on how well the player succeeds or fails
/// It will also send the targeted creature's "[Monster name] Harvest" item to chat

if (game.user.targets.size !== 1)
    ui.notifications.warn(`Please target one token to harvest.`) /// Gotta target a token to harvest it
else{

let actors = canvas.tokens.controlled.map(({ actor }) => actor); /// Might be a better option out there?
const arc = actor.data.data.skills.arc.total;
const rel = actor.data.data.skills.rel.total;
const sur = actor.data.data.skills.sur.total;
const nat = actor.data.data.skills.nat.total;
const [target] = game.user.targets;
const targetDc = target.actor.data.data.details.cr;
const targetType = target.actor.data.data.details.type.value;
const targetSize = target.actor.data.data.traits.size;
const harvestItem = target.actor.items.getName(`${target.actor.name} Harvest`) ///Grabs the harvest item with the Actor's name, rather than token name

/// Define check type based on creature type
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

/// Define harvest time based on creature size
const harvestSize = {
    tiny: 'Less than ½ hour',
    sm: '½ hour',
    med: '1 hour',
    lg: '2 hours',
    huge: '4 hours',
    grg: '8+ hours'
};
let harvestTime = harvestSize[targetSize]

/// Send the GM a whisper for the Target information, Check Type, and DC once the player uses the macro
ChatMessage.create({
    content: `<b>${actor.data.name} is harvesting:</b> ${target.data.name} <p><b>Type:</b> ${targetType} <b>Harvest Skill:</b> ${checkSkill}  <p><b>DC:</b> [[floor(10+${targetDc})]] <b>Harvest Time:</b> ${harvestTime}</p>`, ///need to set max of 30?
  })

/// Let's start building the rolls, these will "pre-roll" the d20s and send a the chat message to the DM for success level
/// There might be a better way to build this rather than having three of them, but I dont know how to simplify it because the d20 roll type is determined in the dialog

function advRoll(skillCheck) {
    let xroll = new Roll(`2d20kh+${skillCheck}`).evaluate({async: false});
    let messageContent;
    if (xroll.total > 9+targetDc) { messageContent = `${actor.data.name} succeeds, harvesting all items! `} // Edit this content for success.
    else if (xroll.total <= 4+targetDc) { messageContent = `${actor.data.name} fails, harvesting no items.`} // Edit this content for failure.
    else if (xroll.total <= 9+targetDc) { messageContent = `${actor.data.name} suffers a mishap during harvesting, only harvesting half of the items shown.`} // Edit this content for partial success.
    xroll.toMessage({ flavor: `${actor.data.name} attempts to harvest the ${target.data.name}`})
    let chatData = {
        user: game.data.userId,
        content: messageContent,
        blind: true, ///this will hide the roll from the player if Actually Private Rolls is enabled
        whisper: ChatMessage.getWhisperRecipients('GM'),
      }
    ChatMessage.create(chatData, {});
};

function normalRoll(skillCheck) {
    let xroll = new Roll(`1d20+${skillCheck}`).evaluate({async: false});
    let messageContent;
    if (xroll.total > 9+targetDc) { messageContent = `${actor.data.name} succeeds, harvesting all items! `} // Edit this content for success.
    else if (xroll.total <= 4+targetDc) { messageContent = `${actor.data.name} fails, harvesting no items.`} // Edit this content for failure.
    else if (xroll.total <= 9+targetDc) { messageContent = `${actor.data.name} suffers a mishap during harvesting, only harvesting half of the items shown.`} // Edit this content for partial success.
    xroll.toMessage({ flavor: `${actor.data.name} attempts to harvest the ${target.data.name}`})
    let chatData = {
        user: game.data.userId,
        content: messageContent,
        blind: true, ///this will hide the roll from the player if Actually Private Rolls is enabled
        whisper: ChatMessage.getWhisperRecipients('GM'),
      }
    ChatMessage.create(chatData, {});
};

function disRoll(skillCheck) {
    let xroll = new Roll(`2d20kl+${skillCheck}`).evaluate({async: false});
    let messageContent;
    if (xroll.total > 9+targetDc) { messageContent = `${actor.data.name} succeeds, harvesting all items! `} // Edit this content for success.
    else if (xroll.total <= 4+targetDc) { messageContent = `${actor.data.name} fails, harvesting no items.`} // Edit this content for failure.
    else if (xroll.total <= 9+targetDc) { messageContent = `${actor.data.name} suffers a mishap during harvesting, only harvesting half of the items shown.`} // Edit this content for partial success.
    xroll.toMessage({ flavor: `${actor.data.name} attempts to harvest the ${target.data.name}`})
    let chatData = {
        user: game.data.userId,
        content: messageContent,
        blind: true, ///this will hide the roll from the player if Actually Private Rolls is enabled
        whisper: ChatMessage.getWhisperRecipients('GM'),
      }
    ChatMessage.create(chatData, {});
};

/// This will create the dialog for the player to select the check type and add it to the roll with Dis/Adv/Normal as appropriate, 
/// Will also send the Harvest Item from the target to chat, whispered to GM, once they have rolled
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
          callback: (html) => { advRoll(`${html.find("#exampleSelect")[0].value}`)
        }
      },
      normal: {
        label: 'Normal',
        callback: (html) => { normalRoll(`${html.find("#exampleSelect")[0].value}`)
        }
      },
      disadvantage: {
        label: 'Disadvantage',
        callback: (html) => { disRoll(`${html.find("#exampleSelect")[0].value}`)
        }
      },
    },
    default: 'yes',
    close: () => {
      console.log('Dialog Closed'),
      harvestItem.roll({rollMode: 'blindroll'}) ///Sends Harvest Item from Target to chat, Player will see this card unless you have Actually Private Rolls, and Dice So Nice's "Enable 3d Dice on Inline Rolls" is OFF
    }
  }).render(true)
}
