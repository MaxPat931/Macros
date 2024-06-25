const actorFolders = game.actors.folders.contents;
if (actorFolders.length === 0) return ui.notifications.error("No actor folders found.");
 
const folderOptions = actorFolders.map(f => `<option value="${f.id}">${f.name}</option>`).join("");
const folderId = await Dialog.prompt({
  title: "Select Actor Folder",
  content: `<form><div class="form-group"><label>Select Folder:</label><select name="folderId">${folderOptions}</select></div></form>`,
  label: "Submit",
  callback: html => new FormDataExtended(html[0].querySelector("form")).object.folderId
});
const actorFolder = game.actors.folders.get(folderId);

const mainJournalName = `Influence Capacities (${actorFolder.name})`;
const influenceJournal = game.journal.getName(mainJournalName) ?? await JournalEntry.create({name: mainJournalName});
// Process each actor and create a journal entry
for (const actor of actorFolder.contents) {
  ///Actor Data
  /// HP, AC, Init, Speed, Prof, Senses
  /// Level, Class(es), Hit Die
  /// Abilities, Saves
  /// Skills
  /// Profs - Armor, Weapon, Language, Tools
  /// Cash Money
  /// Spellcasting
  /// Biography?
  const abilities = actor.system.abilities;

  const actorContent = `
    <img src="${actor.img}" width ="300" style="border: none; float:right">
    <h1>Level ${actor.system.details.level}  HP: __/${actor.system.attributes.hp.max}</h1>
    <div style="clear:both"></div>
  `
  //Item Data
  /// Weapons
  /// Consumables
  /// Equiptment
  /// Tools
  /// Loot
  /// Containers?!
  //Features
  /// Class Features
  /// Race Features
  /// Other Features
  //Spells
  /// 
  let itemContent = {
    weapon: [],
    spell: [],
  };

  actor.items.forEach(item => {
    const itemName = item.name;
    console.log(item)
    const desc = item.system.description.value;
    const itemType = item.type
    const introContent = `<div class="fvtt advice"><figure class="icon"><img src="${item.img}" class="round"></figure><article>
    `;

    let weaponDesc = '';
    if (itemType === 'weapon') {
        weaponDesc = `
            <h2>[[/item ${itemName}]]</h2>
            ${desc}
            To Hit: ${item.labels.toHit}
            <br>Damage: 
        `;
        if (item.labels.derivedDamage && item.labels.derivedDamage.length > 0) {
            item.labels.derivedDamage.forEach(damage => {
                weaponDesc += `
                    ${damage.label}
                `;
            });
        }
        if (item.labels.range) {
            weaponDesc += `
                <br>Range: ${item.labels.range}
            `;
        }
        if (item.labels.properties && item.labels.properties.length > 0) {
            item.labels.properties.forEach(prop => {
                weaponDesc += `
                    <br>${prop.label}
                `;
            });
        }
    }
    
    let spellDesc = '';
    if (itemType === 'spell') {
        spellDesc = `
            <h2>[[/item ${itemName}]]</h2>
            ${desc}
            Activation: ${item.labels.activation}
        `;
    }

    const outroContent = `</article></div>`;
    
    ///Combine descriptions per Type
    let fullContent = introContent;
    if (itemType === 'weapon') {
        fullContent += weaponDesc;
    } else if (itemType === 'spell') {
        fullContent += spellDesc;
    }
    fullContent += outroContent;

    if (itemType === 'weapon') {
        itemContent.weapon.push(fullContent);
    } else if (itemType === 'spell') {
        itemContent.spell.push(fullContent);
    }  
});

function generateColumns(title, items) {
    const column1 = items.slice(0, Math.ceil(items.length / 2)).join('');
    const column2 = items.slice(Math.ceil(items.length / 2)).join('');
    return `
        <div class="column" style="float: left; width: 50%">
            <h2>${title}</h2>
            ${column1}
        </div>
        <div class="column" style="float: right; width: 50%">
            <h2>${title}</h2>
            ${column2}
        </div>
    `;
}

// Example usage:

// Page Content
const pageTitle = `${actor.name}`;
const weaponsContent = generateColumns('Items - Weapons', itemContent.weapon);
const spellsContent = generateColumns('Items - Spells', itemContent.spell);
const content = `
   ${actorContent}
   <div class="item-columns">
       ${weaponsContent}
       <div style="clear:both"></div>>
       ${spellsContent}
   </div>
`;
  
   const page = influenceJournal.pages.getName(pageTitle);
  if(page){
    await JournalEntryPage.updateDocuments([{
      _id: page.id,
      "text.content": content,
    }], {parent: influenceJournal});
  }
  else{
    await JournalEntryPage.create({
      name: pageTitle,
      type: "text",
      "text.content": content,
    }, {parent: influenceJournal});
  }
}
ui.notifications.info("All journal entries created for actors in the selected folder.");
