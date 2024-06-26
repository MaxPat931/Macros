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
    /// Profs - Armor, Weapon, Language, Tools
    //console.log(actor.system)
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
                <br>${ability.value} (${ability.mod > 0 ? `+${ability.mod}` : `${ability.mod}`})${ability.proficient > 0 ? `<i class="fa-solid fa-circle fa-xs"></i>` : ``}</span></p>
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
                <p><span style="font-family: 'Modesto Condensed'; font-size: 1em;">${skillName} ${skill.proficient == "1" ? ` <i class="fa-solid fa-circle fa-xs"></i>` : ''}</span></p>
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
    <h1>Level ${actor.system.details.level}  HP: ____/${actor.system.attributes.hp.max}</h1>
    `;
    if (classesArray.length > 0) {
        classesArray.forEach(hitd => {
            let dieCount = '';
            for (let i = 0; i < hitd.system.levels; i++) {
                dieCount += `
                    <i class="fa-duotone fa-dice-${hitd.system.hitDice}"></i>
                `;
            }
            actorContent += `<h3>${hitd.name} ${hitd.system.hitDice} ${dieCount}</h3>`;
        });
    }

    actorContent += `
    <h2>AC: ${attributes.ac.value} 
    <span style="font-size: .6em;">
    ${attributes.ac.calc === "default" ? ` ${armorCalc} (${attributes.ac.equippedArmor?.name}, ${attributes.ac.equippedShield?.name})` : `${armorCalc}`}
    </span>
    <br>Initiative: ${attributes.init.total}
    <br>Movement: ${movement.walk > 0 ? `Walk ${movement.walk} ${movement.units}` : ''}
    ${movement.climb > 0 ? `Climb ${movement.climb} ${movement.units}` : ''}
    ${movement.fly > 0 ? `, Fly ${movement.fly} ${movement.units}` : ''}
    ${movement.swim > 0 ? `, Swim ${movement.swim} ${movement.units}` : ''}
    ${movement.burrow > 0 ? `, Burrow ${movement.burrow} ${movement.units},` : ''}
  
    <br>Proficiency Bonus: ${attributes.prof}
    <br>Senses: ${senses.darkvision > 0 ? `Darkvision ${senses.darkvision} ${senses.units}` : ''}
    ${senses.blindsight > 0 ? `, Blindsight ${senses.blindsight} ${senses.units}` : ''}
    ${senses.tremorsense > 0 ? `, Tremorsense ${senses.tremorsense} ${senses.units}` : ''}
    ${senses.truesight > 0 ? `, Truesight ${senses.truesight} ${senses.units}` : ''}
    ${senses.special != "" ? `, ${senses.special} ${senses.units}` : ''}
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
    /// Equipment
    /// Tools
    /// Loot
    /// Containers?!
    //Features
    /// Class Features
    /// Race Features
    /// Other Features
    /// 
    let itemContent = {
        weapon: [],
        spell: Array.from({ length: 10 }, () => []),
        spellPact: [],
        consumable: [],
        class: [],
        subclass: [],
        race: [],
        feat: [],
        background: [],
        other: []
    };

    actor.items.forEach(item => {
        const itemName = item.name;
        console.log(item.name, item.system)
        //if (item.system.identified == false) return;
        const desc = item.system.description.value;
        const system = item.system;
        const itemType = item.type;
        const labels = item.labels;
        const period = CONFIG.DND5E.limitedUsePeriods[system.uses?.per]?.label

        const introContent = `<div class="fvtt advice"><figure class="icon"><img src="${item.img}" class="round"></figure><article  style="break-inside: avoid;">
    `;

        //WEAPONS
        let weaponDesc = '';
        if (itemType === 'weapon') {

            weaponDesc = `<span style="font-family: 'Modesto Condensed'; font-size: 2em;">${itemName}${system.quantity > 1 ? `(${system.quantity})` : ``}</span>
            ${desc}`
            if (system.consume.type == "attribute") {
                weaponDesc += `<br>Consumes: ${system.consume.amount} ${system.consume.target}`;
            } else if (system.consume.type == "hitDice") {
                weaponDesc += `<br>Consumes: ${system.consume.amount} ${system.consume.target} Hit Die`;
            } else if (system.consume.type == "item" || system.consume.type === "ammo" || system.consume.type === "material") {
                const conItem = actor.items.get(system.consume.target);
                weaponDesc += `<br>Consumes: ${system.consume.amount} ${conItem.name} ${system.consume.type}`;
            }
            weaponDesc += `
            <br>To Hit: ${item.labels.toHit}
            <br>Damage: 
        `;
            if (labels.derivedDamage && labels.derivedDamage.length > 0) {
                labels.derivedDamage.forEach(damage => {
                    weaponDesc += `
                    ${damage.label}
                `;
                });
            }
            if (item.system.damage.versatile) {
                weaponDesc += `<br>Versatile: ${system.damage.versatile}`
            }
            if (labels.range) {
                weaponDesc += `
                <br>Range: ${labels.range}<br>
            `;
            }
            if (labels.properties && labels.properties.length > 0) {
                labels.properties.forEach((prop, index) => {
                    if (index > 0) {
                        weaponDesc += ', ';
                    }
                    weaponDesc += `${prop.label}`;
                });
            }
        }

        //CONSUMABLES
        let consumeDesc = '';
        if (itemType === 'consumable') {

            consumeDesc = `<span style="font-family: 'Modesto Condensed'; font-size: 2em;">${itemName}${system.quantity > 1 ? `(${system.quantity})` : ``}</span>
            ${desc}
            ${labels.activation ? `<br>Activation: ${labels.activation}` : ``}
            ${system.activation.condition ? `<br>Condition: ${system.activation.condition}` : ``}
            ${labels.range ? `<br>Range: ${labels.range}` : ``}
            ${labels.save ? `<br>${labels.save} Saving Throw` : ``}
            ${labels.duration ? `<br>Duration: ${labels.duration}` : ``}
            ${system.uses.max ? `<br>Uses: ${system.uses.max} ${system.uses.per}` : ``}
            ${item.labels.toHit ? `<br>To Hit: ${item.labels.toHit}` : ``}
        `;
            if (labels.derivedDamage && labels.derivedDamage.length > 0) {
                consumeDesc += `<br>Damage:`
                labels.derivedDamage.forEach(damage => {
                    consumeDesc += `
                    ${damage.label}
                `;
                });
            }
            if (system.consume.type == "attribute") {
                consumeDesc += `<br>Consumes: ${system.consume.amount} ${system.consume.target}`;
            } else if (system.consume.type == "hitDice") {
                consumeDesc += `<br>Consumes: ${system.consume.amount} ${system.consume.target} Hit Die`;
            } else if (system.consume.type == "item" || system.consume.type === "ammo" || system.consume.type === "material") {
                const conItem = actor.items.get(system.consume.target);
                consumeDesc += `<br>Consumes: ${system.consume.amount} ${conItem.name} ${system.consume.type}`;
            }
            if (labels.properties && labels.properties.length > 0) {
                consumeDesc += `<br>Properties: `
                labels.properties.forEach((prop, index) => {
                    if (index > 0) {
                        consumeDesc += ', ';
                    }
                    consumeDesc += `${prop.label}`;
                });
            }
        }

        //SPELLS
        let spellDesc = '<i class="fa-regular fa-sun" style="float:right"></i>';
        if (itemType === 'spell') {
            if (system.level >= 0 && system.level <= 9) {
                spellDesc += `
            <span style="font-family: 'Modesto Condensed'; font-size: 2em;">${itemName} ${system.uses.per ? ` - Limited Uses: ${system.uses.max} per ${period}` : ``}
</span>
            <br>Activation: ${labels.activation}
            `;
                if (labels.properties && labels.properties.length > 0) {
                    spellDesc += `<br>`;
                    labels.properties.forEach((prop, index) => {
                        if (index > 0 && index < labels.properties.length - 1) {
                            spellDesc += ', ';
                        }
                        if (prop.label == 'Concentration') {
                            spellDesc += `${prop.label}<img src="${prop.icon}" width ="30" height="30" style="border: none; float:right; filter:brightness(0) saturate(100%)">`;
                        } else if (prop.label == 'Ritual') {
                            spellDesc += `${prop.label}<img src="${prop.icon}" width ="30" height="30" style="border: none; float:right; filter:brightness(0) saturate(100%)">`;
                        } else if (prop.label == 'Magical') {
                            spellDesc += ``;
                        } else {
                            spellDesc += `${prop.label}`;
                        };
                    });
                }

                spellDesc += `
            ${labels.materials ? `<br>Materials: ${labels.materials}` : ``}
            ${labels.range ? `<br>Range: ${labels.range}` : ``}
            ${labels.target ? `<br>Target: ${labels.target}` : ``}
            ${labels.duration ? `<br>Duration: ${labels.duration}` : ``}
            ${labels.save ? `<br>Saving Throw: ${labels.save}` : ``}
            ${labels.toHit ? `<br>Spell Attack: ${labels.toHit}` : ``}
            ${desc}`
                if (system.consume.type == "attribute") {
                    spellDesc += `<br>Consumes: ${system.consume.amount} ${system.consume.target}`;
                } else if (system.consume.type == "hitDice") {
                    spellDesc += `<br>Consumes: ${system.consume.amount} ${system.consume.target} Hit Die`;
                } else if (system.consume.type == "item" || system.consume.type === "ammo" || system.consume.type === "material") {
                    const conItem = actor.items.get(system.consume.target);
                    spellDesc += `<br>Consumes: ${system.consume.amount} ${conItem.name} ${system.consume.type}`;
                }
            }
            const schoolIcon = CONFIG.DND5E.spellSchools[system.school]?.icon
            spellDesc += `<img src="${schoolIcon}" width="30" height="30" style="border: none; float: right">`
        }

        //Class Features
        let classDesc = '';
        if (itemType === 'feat') {

            classDesc = `<span style="font-family: 'Modesto Condensed'; font-size: 2em;">${itemName}</span>
            ${desc}
            ${labels.activation ? `<br>Activation: ${labels.activation}` : ``}
            ${system.activation.condition ? `<br>Condition: ${system.activation.condition}` : ``}
            ${labels.range != "None" ? `<br>Range: ${labels.range}` : ``}
            ${labels.save ? `<br>${labels.save} Saving Throw` : ``}
            ${labels.duration ? `<br>Duration: ${labels.duration}` : ``}
            ${system.uses.max ? `<br>Uses: ${system.uses.max} per ${period}` : ``}
            ${item.labels.toHit ? `<br>To Hit: ${item.labels.toHit}` : ``}
        `;
            if (labels.derivedDamage && labels.derivedDamage.length > 0) {
                classDesc += `<br>Damage:`
                labels.derivedDamage.forEach(damage => {
                    classDesc += `
                    ${damage.label}
                `;
                });
            }
            if (system.consume.type == "attribute") {
                classDesc += `<br>Consumes: ${system.consume.amount} ${system.consume.target}`;
            } else if (system.consume.type == "hitDice") {
                classDesc += `<br>Consumes: ${system.consume.amount} ${system.consume.target} Hit Die`;
            } else if (system.consume.type == "item" || system.consume.type === "ammo" || system.consume.type === "material") {
                const conItem = actor.items.get(system.consume.target);
                classDesc += `<br>Consumes: ${system.consume.amount} ${conItem.name} ${system.consume.type}`;
            }
            if (labels.properties && labels.properties.length > 0) {
                classDesc += `<br>Properties: `
                labels.properties.forEach((prop, index) => {
                    if (index > 0) {
                        classDesc += ', ';
                    }
                    classDesc += `${prop.label}`;
                });
            }
        }

        const outroContent = `</article></div>`;

        ///Combine descriptions per Type
        let fullContent = introContent;
        if (itemType === 'weapon') {
            fullContent += weaponDesc;
        } else if (itemType === 'spell') {
            fullContent += spellDesc;
        } else if (itemType === 'consumable') {
            fullContent += consumeDesc;
        } else if (itemType === 'feat') {
            fullContent += classDesc;
        }
        fullContent += outroContent;

        if (itemType === 'weapon') {
            itemContent.weapon.push(fullContent);
        } else if (itemType === 'spell' && item.system.preparation.mode === 'pact') {
            itemContent.spellPact.push(fullContent);
        } else if (itemType === 'spell' && item.system.level >= 0 && item.system.level <= 9) {
            itemContent.spell[item.system.level].push(fullContent);
        } else if (itemType === 'consumable') {
            itemContent.consumable.push(fullContent);
        } else if (itemType === 'feat' && item.system.type.value === 'class') {
            itemContent.class.push(fullContent);
        } else if (itemType === 'feat' && item.system.type.value === 'subclass') {
            itemContent.subclass.push(fullContent);
        } else if (itemType === 'feat' && item.system.type.value === 'race') {
            itemContent.race.push(fullContent);
        } else if (itemType === 'feat' && item.system.type.value === 'feat') {
            itemContent.feat.push(fullContent);
        } else if (itemType === 'feat' && item.system.type.value === 'background') {
            itemContent.background.push(fullContent);
        } else if (itemType === 'feat') {
            itemContent.other.push(fullContent);
        }
    });

    function generateColumns(title, items) {
        const column1 = items.slice(0, Math.ceil(items.length / 2)).join('');
        const column2 = items.slice(Math.ceil(items.length / 2)).join('');
        return `
        <div class="column" style="float: left; width: 50%; page-break-before: always;">
            ${column1}
        </div>
        <div class="column" style="float: right; width: 50%; page-break-before: always;">
            ${column2}
        </div>
    `;
    }

    // Page Content
    const pageTitle = `${actor.name}`;
    const weaponsContent = generateColumns('Items - Weapons', itemContent.weapon);
    const pactContent = generateColumns('Pact', itemContent.spellPact)
    const consumeContent = generateColumns('Items - Consumables', itemContent.consumable);
    const classContent = generateColumns('Class', itemContent.class)
    const subclassContent = generateColumns('Sublass', itemContent.subclass)
    const raceContent = generateColumns('Race', itemContent.race)
    const featContent = generateColumns('Feat', itemContent.feat)
    const backContent = generateColumns('Feat', itemContent.background)
    const otherContent = generateColumns('Feat', itemContent.other)

    let content = `
    ${actorContent}
    <div class="item-columns">
        <h2>Weapons</h2>
        ${weaponsContent}
        <div style="clear:both"></div>
        <h2>Consumables</h2>
        ${consumeContent}
        <div style="clear:both"></div>
`;

    itemContent.spell.forEach((spellLevel, index) => {
        const spellLevelContent = generateColumns(`Spells ${index} Level`, spellLevel);
        if (index == 0) {
            content += `
        ${itemContent.spell[0] != "" ? `
        SPELLCASTING
        
        <h2 >Cantrips</h2>
        ${spellLevelContent}
        <div style="clear:both"></div>` : ""}
        ${itemContent.spellPact != "" ? `<h2>Pact Spells Level ${slots.pact.level}</h2>
        ${pactContent}
        <div style="clear:both"></div>` : ""}
    `;
        } else if (spellLevel != "") {
            content += `
        <h2>Level ${index} Spells</h2>
        ${spellLevelContent}
        <div style="clear:both"></div>
    `;
        }
    });
    content += `
        <h2>Class Features</h2>
        ${classContent}
        <div style="clear:both"></div>
        ${itemContent.subclass != "" ? `<h2>Subclass Features</h2> ${subclassContent} <div style="clear:both"></div>` : ``}
        ${itemContent.feat != "" ? `<h2>Feats</h2> ${featContent} <div style="clear:both"></div>` : ``}
        ${itemContent.other != "" ? `<h2>Other Features</h2> ${otherContent} <div style="clear:both"></div>` : ``}
        ${itemContent.background != "" ? `<h2>Background Features</h2> ${backContent} <div style="clear:both"></div>` : ``}
        <h2>Racial Features</h2>
        ${raceContent}
        <div style="clear:both"></div>
       `;

    content += `
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
