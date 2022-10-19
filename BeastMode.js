///the following items must be in the world's sidebar to be populated on the actor
const tail=game.items.getName("Form of the Beast: Tail")
const claws=game.items.getName("Form of the Beast: Claws")
const bite=game.items.getName("Form of the Beast: Bite")
const spell = game.items.getName("Absorb Elements")
const tailId = actor.items.getName("Form of the Beast: Tail")?.id
const clawsId = actor.items.getName("Form of the Beast: Claws")?.id
const biteId = actor.items.getName("Form of the Beast: Bite")?.id
const spellId = actor.items.getName("Absorb Elements")?.id


let d = new Dialog({
title: "Form of the Beast",
content: `Chose your Form of the Beast, this will add the appropriate item to your inventory`,
buttons: {
one: {
 label: "<b>Tail</b> <p>1d8 Piercing</p> <p>RXN +1d8 to AC</p>",
 callback: () => {actor.createEmbeddedDocuments("Item",[tail]),
                  actor.deleteEmbeddedDocuments("Item",[spellId])}
},
two: {
 label: "<b>Claws</b> <p>1d6 Slashing</p> <p>2x/Attack</p>",
 callback: () => {actor.createEmbeddedDocuments("Item",[claws]),
                  actor.deleteEmbeddedDocuments("Item",[spellId])}
},
three: {
 label: "<b>Bite</b> <p>1d8 Piercing</p> <p>Heal if HP<50%</p>",
 callback: () => {actor.createEmbeddedDocuments("Item",[bite]),
                  actor.deleteEmbeddedDocuments("Item",[spellId])}
},
four: {
 icon: '<i class="fas fa-times"></i>',
 label: "<b>DELETE ITEMS</b>",
 callback: () => {actor.deleteEmbeddedDocuments("Item",[tailId || clawsId || biteId]),
                  actor.createEmbeddedDocuments("Item",[spell])}
}
},

default: "one",
render: html => console.log("Register interactivity in the rendered dialog"),
close: html => console.log("This always is logged no matter which option is chosen")
});
d.render(true);
