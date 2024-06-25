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
    <h1>Level ${actor.system.details.level}  HP: __/${actor.system.attributes.hp.max}</h1>
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
  let itemContent = []
  actor.items.forEach(item => {
    const itemName = item.name;
    console.log(itemName)
    const desc = item.system.description.value;
    const content = `
        <p>${itemName}</p>
        <p>${desc}
        `
    itemContent.push(content)
  })

  //Page Content
  const pageTitle = `${actor.name}`;
  const content = `
   <p>${actorContent}</p>
   <h2>Items<h2>
   <p>${itemContent}</p>
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
