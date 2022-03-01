/// This macro is supposed to be used with Hammonds Harvesting Guide
/// It will send a whisper to the DM for the Targeted Creature, the Creature Type, the associated skill to appraise it, and the DC of the check
/// It provides a drop down to select which type of Appraisal check the player will be doing
/// And roll according to the Adv/Normal/Disadv buttons selected


if (game.user.targets.size !== 1)
    ui.notifications.warn(`Please target one token to appraise.`)
else{

let actors = canvas.tokens.controlled.map(({ actor }) => actor);
const intMod = actor.data.data.abilities.int.mod;
const arc = actor.data.data.skills.arc.prof;
const inv = actor.data.data.skills.inv.prof;
const med = actor.data.data.skills.med.prof;
const nat = actor.data.data.skills.nat.prof;
const [target] = game.user.targets;
const targetDc = target.actor.data.data.details.cr;
const targetType = target.actor.data.data.details.type.value;


const checkTypes = {
    beast: 'Nature',
    dragon: 'Nature',
    giant: 'Medicine',
    monstrosity: 'Nature',
    plant: 'Nature',
    humanoid: 'Medicine',
    celestial: 'Arcana',
    fiend: 'Arcana',
    undead: 'Arcana',
    aberration: 'Arcana',
    construct: 'Invstigation',
    elemental: 'Arcana',
    fey: 'Arcana',
    ooze: 'Investigation'
};

let checkSkill = checkTypes[targetType]


ChatMessage.create({
    content: `<b>Appraisal of:</b> ${target.data.name} <b>Type:</b> ${targetType} <p><b>Appraisal Skill:</b> ${checkSkill}  <b>DC:</b> [[floor(8+${targetDc})]]</p>`,
    whisper: ChatMessage.getWhisperRecipients('GM'),
  })

let d = new Dialog({
    title: 'Appraisal Check',
    content: `
      <form class="flexcol">
        <div class="form-group">
          <label for="exampleSelect">Select Appraisal Type</label>
          <select id="exampleSelect">
            <option value="${arc}">Arcana - Abberation, Celestial, Elemental, Fey, Fiend, Undead</option>
            <option value="${inv}">Investigation - Construct, Ooze</option>
            <option value="${med}">Medicine - Giant, Humanoid</option>
            <option value="${nat}">Nature - Beast, Dragon, Monstrosity, Plant</option>
          </select>
        </div>
      </form>
    `,
    buttons: {
      advantage:{
          label: 'Advantage',
          callback: (html) => {
            new Roll(`2d20kh+${intMod}+${html.find("#exampleSelect")[0].value}`).toMessage({ flavor: `${actor.data.name} appraises the ${target.data.name}` })
        }
      },
      normal: {
        label: 'Normal',
        callback: (html) => {
            new Roll(`1d20+${intMod}+${html.find("#exampleSelect")[0].value}`).toMessage({ flavor: `${actor.data.name} appraises the ${target.data.name}` })
        }
      },
      disadvantage: {
        label: 'Disadvantage',
        callback: (html) => {
            new Roll(`2d20kl+${intMod}+${html.find("#exampleSelect")[0].value}`).toMessage({ flavor: `${actor.data.name} appraises the ${target.data.name}` })    
        }
      },
    },
    default: 'yes',
    close: () => {
      console.log('Dialog Closed');
    }
  }).render(true)
}
