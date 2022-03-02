/// This macro is supposed to be used with Anne Gregersen's Monster Loot supplements
/// It will send a public chat card for the Targeted Creature, the Creature Type, the associated skill to harvest it, and the DC of the check
/// It provides a drop down for the player to select which type of Harvest check they will be doing
/// And roll according to the Adv/Normal/Disadv buttons selected
/// It will then send a chat on how well the player succeeds or fails
/// It will also send the targeted creature's "[Monster name] Harvest" item to chat

if(game.user.targets.size < 1) return ui.notifications.warn(`Please target one token to harvest.`) /// Gotta target a token to harvest it
if(!actor) return ui.notifications.warn(`You need a selected actor to perform the harvesting.`);

const [target] = game.user.targets;
const traits = {
	name: target.data.name,
	cr: target.actor.data.data.details.cr,
	type: target.actor.data.data.details.type.value,
	size: target.actor.data.data.traits.size,
	harvest: target.actor.items.getName(`${target.actor.name} Harvest`)?.data.data.description.value
};
if(!traits.harvest) return ui.notifications.info(`The target has nothing to harvest.`);
const targetValue = Math.min(30, Math.floor(10+traits.cr));
let adv = 0; // modifier for disadv (-1), normal (0), adv (1)

const harvestStr = {
	success: `${actor.data.name} succeeds, harvesting all items! `,
	fail: `${actor.data.name} fails, harvesting no items.`,
	partial: `${actor.data.name} suffers a mishap during harvesting, only harvesting half of the items shown.`
}


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
let checkSkill = checkTypes[traits.type]

/// Define harvest time based on creature size
const harvestSize = {
    tiny: 'Less than ½ hour',
    sm: '½ hour',
    med: '1 hour',
    lg: '2 hours',
    huge: '4 hours',
    grg: '8+ hours'
};
let harvestTime = harvestSize[traits.size]

/// Send the GM a whisper for the Target information, Check Type, and DC once the player uses the macro
ChatMessage.create({
    content: `
		<b>${actor.data.name} is harvesting:</b> ${traits.name} <br>
		<b>Type:</b> ${traits.type} <b>Harvest Skill:</b> ${checkSkill} <br>
		<b>DC:</b> ${targetValue} <b>Harvest Time:</b> ${harvestTime}`, // DC between 10-30
})

/* Request skill check and create ChatMessages */
async function skillRoll(skillCheck) {
    let harvestRoll = (await actor.rollSkill(skillCheck, {
		targetValue,
		fastForward: true,
		advantage: adv > 0,
		disadvantage: adv < 0,
		flavor: `
		<em>${actor.data.name} attempts to harvest the ${traits.name}.</em> <br>
		${CONFIG.DND5E.skills[skillCheck]} Skill Check: ${actor.data.name}`
	})).total;
    let messageContent = (harvestRoll > 9 + traits.cr) ? harvestStr.success : (harvestRoll <= 4 + traits.cr) ? harvestStr.fail : harvestStr.partial;
    
    const chatData = {
        user: game.data.userId,
        content: `${messageContent}<hr>${traits.harvest}`,
        blind: true, ///this will hide the roll from the player if Actually Private Rolls is enabled
        whisper: ChatMessage.getWhisperRecipients('GM'),
      }
    await ChatMessage.create(chatData, {});
};

/// This will create the dialog for the player to select the check type and add it to the roll with Dis/Adv/Normal as appropriate.
let d = new Dialog({
	title: `Harvest Check: ${traits.name} (${traits.type})`,
	content: `
      <form class="flexcol">
        <div class="form-group">
          <label for="exampleSelect">Select Harvest Type</label>
          <select id="exampleSelect">
            <option value="arc">Arcana - Aberration, Construct, Elemental, Fey, Ooze</option>
            <option value="rel">Religion - Celestial, Fiend, Undead</option>
            <option value="sur">Survival - Humanoid</option>
            <option value="nat">Nature - Beast, Dragon, Giant, Monstrosity, Plant</option>
          </select>
        </div>
      </form>
    `,
	buttons: {
		advantage:{
			label: 'Advantage',
			callback: () => { adv = 1 }
		},
		normal: {
			label: 'Normal',
			callback: () => { adv = 0 }
		},
		disadvantage: {
			label: 'Disadvantage',
			callback: () => { adv = -1 }
		},
	},
	default: 'yes',
	close: async (html) => {
		await skillRoll(`${html.find("#exampleSelect")[0].value}`);
	}
}).render(true)
