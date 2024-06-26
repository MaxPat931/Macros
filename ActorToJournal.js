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
const influenceJournal = game.journal.getName(mainJournalName) ?? await JournalEntry.create({ name: mainJournalName });
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
    console.log(actor.system)
    const abilities = actor.system.abilities;
    const attributes = actor.system.attributes;
    const skills = actor.system.skills;
    const slots = actor.system.spells;
    const senses = attributes.senses;
    const movement = attributes.movement;
    const armorCalc = CONFIG.DND5E.armorClasses[attributes.ac.calc]?.label
    const classesArray = [...actor.system.attributes.hd.classes];

    function generateAbilityHTML(abilities) {
        let abilityContent = '';
        Object.keys(abilities).forEach(key => {
            const ability = abilities[key];
            abilityContent += `
            <td>
                <p style="text-align: center;"><span style="font-family: Modesto Condensed; font-size: 2.5em"><strong>${key.toUpperCase()}</strong> 
                <br>${ability.value} (${ability.mod})</span></p>
            </td>
        `;
        });
        return abilityContent;
    }
    const abilitiesHTML = generateAbilityHTML(abilities);

    function generateSkillHTML(skills) {
        let skillContent = '';
        let count = 0;
        Object.keys(skills).forEach(key => {
            const skill = skills[key];
            const skillName = CONFIG.DND5E.skills[key]?.label;
            if (count % 6 === 0) {
                if (count !== 0) {
                    skillContent += '</tr>'; // Close previous row if not the first row
                }
                skillContent += '<tr>'; // Start a new row
            }
            skillContent += `
            <td>
                <p><span style="font-family: 'Modesto Condensed'; font-size: 1.5em;">${skillName} ${skill.proficient == "1" ? ` <i class="fa-solid fa-circle fa-xs"></i>` : ''}</span></p>
            </td>
            <td style="border-right:1px solid black">
                <p>${skill.total} (${skill.passive})</p>
            </td>
        `;
            count++;
        });
        skillContent += '</tr>';
        return skillContent;
    }
    const skillsHTML = generateSkillHTML(skills);

    function generateSlotHTML(slots) {
        let slotContent = '<b>';
        Object.keys(slots).forEach(key => {
            const slot = slots[key];
            let slotCount = '';
            for (let i = 0; i < slot.max; i++) {
                slotCount += `
                    <i class="fa-brands fa-superpowers"></i>
                `;
            }
            slotContent += `
                ${slot.max > 0 ?
                `<span style="font-family: Modesto Condensed; font-size: 2.5em"> 
                <br>${key == "pact" ? `Pact ${slot.level}&ensp;| ` : `Level ${slot.level} | `} ${slotCount}</span>`
                : ""}
        `;
        });
        return slotContent;
    }
    const slotHTML = generateSlotHTML(slots);

    //Put it all together
    let actorContent = '';
    actorContent = `
    <img src="${actor.img}" width ="300" style="border: none; float:right">
    <h1>Level ${actor.system.details.level}  HP: __/${actor.system.attributes.hp.max}</h1>
    <h2>AC: ${attributes.ac.value} 
    <span style="font-size: .6em;">
    ${attributes.ac.calc === "default" ? ` ${armorCalc} (${attributes.ac.equippedArmor?.name}, ${attributes.ac.equippedShield?.name})` : `${armorCalc}`}
    </span>
    <br>Hit Die: ___/${attributes.hd.max} - 
    `;
    if (classesArray.length > 0) {
        classesArray.forEach(hitd => {
            actorContent += `${hitd.name} ${hitd.system.levels}${hitd.system.hitDice}`;
        });
    }

    actorContent += `
    <br>Initiative: ${attributes.init.total}
    <br>Speed: ${movement.walk> 0 ? `Walk ${movement.walk} ${movement.units}` :''}
    ${movement.climb > 0 ? `Climb ${movement.climb} ${movement.units}` :''}
    ${movement.fly > 0 ? `, Fly ${movement.fly} ${movement.units}` :''}
    ${movement.swim > 0 ? `, Swim ${movement.swim} ${movement.units}` :''}
    ${movement.burrow > 0 ? `, Burrow ${movement.burrow} ${movement.units},` :''}
  
    <br>Proficiency Bonus: ${attributes.prof}
    <br>Senses: ${senses.darkvision > 0 ? `Darkvision ${senses.darkvision} ${senses.units}` :''}
    ${senses.blindsight > 0 ? `, Blindsight ${senses.blindsight} ${senses.units}` :''}
    ${senses.tremorsense > 0 ? `, Tremorsense ${senses.tremorsense} ${senses.units}` :''}
    ${senses.truesight > 0 ? `, Truesight ${senses.truesight} ${senses.units}` :''}
    ${senses.special !="" ? `, ${senses.special} ${senses.units}` :''}
    ${attributes.spelldc > 0 ? `<br>Spell Save DC: ${attributes.spelldc}` : ''}
    </h2>
    <span style="font-size: 1.5em;">
    <i class="currency pp" data-tooltip="Platinum"></i> ${actor.system.currency.pp}
    <i class="currency gp" data-tooltip="Gold"></i> ${actor.system.currency.gp}
    <i class="currency sp" data-tooltip="Silver"></i> ${actor.system.currency.sp}
    <i class="currency cp" data-tooltip="Copper"></i> ${actor.system.currency.cp}
    </span>
    ${slotHTML}
    
    <table><tbody><tr>
    ${abilitiesHTML}
    </tr></tbody></table>
    <table><tbody>
    ${skillsHTML}
    </tbody></table>
    <div style="clear:both"></div>`

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
        //console.log(item)
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
    if (page) {
        await JournalEntryPage.updateDocuments([{
            _id: page.id,
            "text.content": content,
        }], { parent: influenceJournal });
    }
    else {
        await JournalEntryPage.create({
            name: pageTitle,
            type: "text",
            "text.content": content,
        }, { parent: influenceJournal });
    }
}
ui.notifications.info("All journal entries created for actors in the selected folder.");
