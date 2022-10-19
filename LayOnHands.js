//######################################################################################################
// READ THIS FIRST!!!!!!
// Usage: 
// Adjust line 13 "resourceSlot" to whatever you need either "primary", "secondary" or "tertiary".
//######################################################################################################

let target = Array.from(game.user.targets)[0];
if (!target) return ui.notifications.error(`Please select a single target.`);
let illegal = (target.actor.system.details?.type?.value || target.actor.system.details?.race).toLowerCase().includes("undead", "construct");
let actorD = actor || canvas.tokens.controlled[0].actor || game.user.character;
let itemD = actorD.items.find(i=> i.name === "Lay on Hands");
// Change resoureSlot to either primary, secondary or tertiary
let resourceSlot = "primary";
let curtRes = actorD.system.resources[resourceSlot].value;
let maxResRnd = actorD.system.resources[resourceSlot].max/5;
let curtResRnd = Math.floor(actorD.system.resources[resourceSlot].value/5);
let maxHealz = Math.clamped(actorD.system.resources[resourceSlot].value, 0,target.actor.system.attributes.hp.max - target.actor.system.attributes.hp.value);
if (illegal) return ui.notifications.error(`You cannot use Lay on Hands on this target.`);
if (curtRes === null) return ui.notifications.warn(`You are out of the required resources.`);
let content_loh = `<p>Which <strong>Action</strong> would you like to do? [${curtRes}] points remaining.</p>`;
    new Dialog({
	title: "Lay on Hands",
	content: content_loh,
	buttons: {
        cure: { label: "Cure Condition", callback: () => { loh_cure(); }},
		heal: { label: "Heal", callback: () => { loh_heal(); }}
    }    
}).render(true);
// Condition Curing Function
function loh_cure(){
    let condition_list = ["Diseased", "Poisoned"];
    let effect = target.actor.effects.filter( i=> condition_list.includes(i.label));    
    let selectOptions = "";
    for (let i = 0; i < effect.length; i++){
        let condition = effect[i].label;
        selectOptions +=`<option value="${condition}">${condition}</option>`;
        }
    if (selectOptions === "") {
        return ui.notifications.warn(`There's nothing to Cure on ${target.name}.`);
    } else {
    let content_cure = `<p><em>${actorD.name} Lays on Hands on ${target.name}.</em></p><p>Choose a Condition Cure | [${curtResRnd}/${maxResRnd}] charges left.</p><form class="flexcol"><div class="form-group"><select id="element">${selectOptions}</select></div></form>`;					
	new Dialog({
        title: "Lay on Hands: Curing",
        content: content_cure,
        buttons: {
            yes:{
                icon: '<i class="fas fa-check"></i>',
                label: 'Cure!',
                callback: (html) => {
                    let element = html.find('#element').val();                    
                    actorD.update({"data.resources.primary.value" : curtRes - 5});
                     ChatMessage.create({
                         user: game.user._id,
                         speaker: ChatMessage.getSpeaker({actor: actorD.name}),
                         content: `${actorD.name} cures ${target.name} of 1 ${element} condition.`
                     });
                    }
                }
            }
        }).render(true);
    }
}
// Healing Function
function loh_heal() {
    let content_heal = `<p><em>${actorD.name} lays hands on ${target.name}.</em></p><p>How many HP do you want to restore to ${target.name}?</p><form class="flexcol"><div class="form-group"><label for="num">HP to Restore: (Max = ${maxHealz})</label><input id="num" name="num" type="number" min="0" max="${maxHealz}"></input></div></form>`;
    new Dialog({
        title: "Lay on Hands: Healing",
        content: content_heal,
        buttons: {
            heal: { icon: '<i class="fas fa-check"></i>', label: 'Heal', callback: (html) => {
                let number = Math.floor(Number(html.find('#num')[0].value));
                if (number < 1 || number > maxHealz) {
                    return ui.notifications.warn(`Invalid number of charges entered = ${number}. Aborting action.`);
                } else {                    
                    actorD.update({"data.resources.primary.value" : curtRes - number});
                    new Roll(`${number}d1`).toMessage(),
                    ChatMessage.create({
                         user: game.user._id,
                         speaker: ChatMessage.getSpeaker({actor: actorD.name}),
                         content: `${actorD.name} heals ${target.name} for <b>${number}</b> Hit Points.`
                     });                    
                }
            }
        }
        }
    }).render(true);
}
