//Original credit: @RinVindor & @Freeze in #macro-polo

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

const mainJournalName = `Printable (${actorFolder.name})`;
const influenceJournal = game.journal.getName(mainJournalName) ?? await JournalEntry.create({ name: mainJournalName });
// Process each actor and create a journal entry


for (const actor of actorFolder.contents) {
    //console.log(actor.system)
    const abilities = actor.system.abilities;
    const attributes = actor.system.attributes;
    const skills = actor.system.skills;
    const slots = actor.system.spells;
    const senses = attributes.senses;
    const movement = attributes.movement;
    const armorCalc = CONFIG.DND5E.armorClasses[attributes.ac.calc]?.label
    const hdArray = [...actor.system.attributes.hd.classes];

    function generateAbilityHTML(abilities) {
        let abilityContent = '';
        let count = 0;
        Object.keys(abilities).forEach(key => {
            const ability = abilities[key];
            if (count % 3 === 0) {
                if (count !== 0) {
                    abilityContent += '</tr>'; // Close previous row if not the first row
                }
                abilityContent += '<tr>'; // Start a new row
            }
            abilityContent += `
            <td>
                <p style="text-align: center;"><span style="font-family: Modesto Condensed; font-size: 1.5em"><strong>${key.toUpperCase()}</strong> 
                <br>${ability.value} (${ability.mod > 0 ? `+${ability.mod}` : `${ability.mod}`})${ability.proficient > 0 ? `<i class="fa-solid fa-circle fa-xs"></i>` : ''}</span></p>
            </td>
        `;
            count++;
        });
        abilityContent += '</tr>';
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
                <p><span style="font-family: 'Modesto Condensed'; font-size: 1em;">&ensp;${skillName} ${skill.proficient == "1" ? ` <i class="fa-solid fa-circle fa-xs"></i>` : ''}</span></p>
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
        let slotContent = '';
        let count = 0;
        Object.keys(slots).forEach(key => {
            const slot = slots[key];
            let slotCount = '';
            for (let i = 0; i < slot.max; i++) {
                slotCount += `
                    <i class="fa-brands fa-superpowers"></i>
                `;
            }
            if (count % 3 === 0) {
                if (count !== 0) {
                    slotContent += '</tr>'; // Close previous row if not the first row
                }
                slotContent += '<tr>'; // Start a new row
            }
            slotContent += `
                ${slot.max > 0 ?
                    `<td><span style="font-family: Modesto Condensed; font-size: 1.5em"> 
                ${key == "pact" ? `Pact ${slot.level}&ensp;| ` : `Level ${slot.level} | `} ${slotCount}</span>`
                    : ""} </td>
        `;
            count++;
        });
        slotContent += '</tr>';
        return slotContent;
    }
    const slotHTML = generateSlotHTML(slots);

    //Put it all together
    let actorContent = '';
    actorContent = `
    <div class="row">
    <div class="column" style="float: left; width: 30%; page-break-before: always;">
        <span style="font-size: 2.5em; font-family: 'Modesto Condensed';">Level ${actor.system.details.level}  HP: ____/${actor.system.attributes.hp.max}</span>
    `;
    if (hdArray.length > 0) {
        hdArray.forEach(hitd => {
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
        <span style="font-size: 2em; font-family: 'Modesto Condensed';">AC: ${attributes.ac.value} 
        <span style="font-size: .6em; font-family: 'Modesto Condensed';">
        ${attributes.ac.calc === "default" ? ` ${armorCalc} (${attributes.ac.equippedArmor?.name ? attributes.ac.equippedArmor.name : ''}${attributes.ac.equippedShield?.name ? `, ${attributes.ac.equippedShield.name}` : ''})` : `${armorCalc}`}        </span>
        <br>Initiative: ${attributes.init.total > 0 ? `+${attributes.init.total}` : `${attributes.init.total}`}
        <br>Movement: ${movement.walk > 0 ? `Walk ${movement.walk} ${movement.units}` : ''}
        ${movement.climb > 0 ? `Climb ${movement.climb} ${movement.units}` : ''}
        ${movement.fly > 0 ? `, Fly ${movement.fly} ${movement.units}` : ''}
        ${movement.swim > 0 ? `, Swim ${movement.swim} ${movement.units}` : ''}
        ${movement.burrow > 0 ? `, Burrow ${movement.burrow} ${movement.units},` : ''}
    
        <br>Proficiency Bonus: +${attributes.prof}
        <br>Senses: ${senses.darkvision > 0 ? `Darkvision ${senses.darkvision} ${senses.units}` : ''}
        ${senses.blindsight > 0 ? `, Blindsight ${senses.blindsight} ${senses.units}` : ''}
        ${senses.tremorsense > 0 ? `, Tremorsense ${senses.tremorsense} ${senses.units}` : ''}
        ${senses.truesight > 0 ? `, Truesight ${senses.truesight} ${senses.units}` : ''}
        ${senses.special != "" ? `, ${senses.special} ${senses.units}` : ''}
        ${attributes.spelldc > 0 ? `<br>Spell Save DC: ${attributes.spelldc}` : ''}
        </span>
        <span style="font-size: 1.5em;"><br>
        <img src="systems/dnd5e/icons/currency/platinum.webp" style="border: none;"> ${actor.system.currency.pp}
        <img src="systems/dnd5e/icons/currency/gold.webp"style="border: none;"> ${actor.system.currency.gp}
        <img src="systems/dnd5e/icons/currency/silver.webp"style="border: none;"> ${actor.system.currency.sp}
        <img src="systems/dnd5e/icons/currency/copper.webp"style="border: none;"> ${actor.system.currency.cp}
        </span>
    </div>
    <div class="column" style="float: left; width: 45%; page-break-before: always;">
        <table><tbody>
        ${abilitiesHTML}
        </tbody></table>
        <table><tbody>
        ${slotHTML}
        </tbody></table>
    </div>
    <div class="column" style="float: left; width: 25%; page-break-before: always;">
        <img src="${actor.img}" width ="100%" style="border: none; float:right">
    </div>
    <div style="clear:both">

    <div style="clear:both"></div>
    <table><tbody>
    ${skillsHTML}
    </tbody></table>
    <div style="clear:both"></div>
    `;

    let itemContent = {
        weapon: [],
        spell: Array.from({ length: 10 }, () => []),
        spellPact: [],
        atwill: [],
        innate: [],
        ritual: [],
        consumable: [],
        equipment: [],
        otherItem: [],
        class: [],
        race: [],
        feat: [],
        background: [],
        other: []
    };

    actor.items.forEach(item => {
        const itemName = item.name;
        //console.log(item.name, item)
        const desc = item.system.identified === false ? item.system.unidentified?.description : item.system.description.value;
        const system = item.system;
        const itemType = item.type;
        const labels = item.labels;
        const period = CONFIG.DND5E.limitedUsePeriods[system.uses?.per]?.label
        const schoolIcon = CONFIG.DND5E.spellSchools[system.school]?.icon
        const nthNumber = (number) => {
            if (number > 3 && number < 21) return "th";
            switch (number % 10) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th";
            }
        };

        let itemDesc = `<div class="fvtt advice"><figure class="icon"><img src="${item.img}" class="round"></figure><article  style="break-inside: avoid;">`;
        if (item.system.identified === false) {
            itemDesc += `<span style="font-family: 'Modesto Condensed'; font-size: 2em;">${itemName} ${system.quantity > 1 ? ` (${system.quantity})` : ''}</span> <br>Unidentified <hr>${desc}`
        } else {
            itemDesc += `
            ${system.attunement === "required" || system.attunement === "optional" ? `<i class="fa-regular fa-sun" style="float:right"></i>` : ''} 
            ${system.equipped === true ? `<i class="fa-solid fa-shield-halved" style="float:right"></i>` : ''}
            ${system.recharge?.value ? `<span style="float: right;">${system.recharge.value}+ <i class="fa-solid fa-battery-empty fa-xl"> </i></span>` : ''}
            ${itemType == "spell" ? `<i class="fa-regular fa-sun" style="float:right"></i>` : ''}
            <span style="font-family: 'Modesto Condensed'; font-size: 2em;">${itemName} ${system.quantity > 1 ? ` (${system.quantity})` : ''}</span>
            ${system.rarity ? `<br>Rarity: ${system.rarity.charAt(0).toUpperCase() + system.rarity.slice(1)}` : ''}
            ${system.type?.label ? `<br>${system.type.label}` : ''}
            ${labels.activation && labels.activation != "None" ? `<br>Activation: ${labels.activation}` : ''}
            `
            if (system.uses?.max > 0) {
                let useMax = '';
                for (let i = 0; i < system.uses.max; i++) {
                    useMax += `
                                <i class="fa-regular fa-circle"></i>
                            `;
                }
                itemDesc += `<br>Uses: ${system.uses.max} ${period == "Charges" ? `Charges` : `per ${period}`} ${useMax}`
            };
            if (itemType == "spell" && labels.properties && labels.properties.length > 0) {
                itemDesc += `<br>`;
                labels.properties.forEach((prop, index) => {
                    if (index > 0 && index < labels.properties.length - 1) {
                        itemDesc += ', ';
                    }
                    if (prop.label == 'Concentration') {
                        itemDesc += `${prop.label}<img src="${prop.icon}" width ="30" height="30" style="border: none; float:right; filter:brightness(0) saturate(100%)">`;
                    } else if (prop.label == 'Ritual') {
                        itemDesc += `${prop.label}<img src="${prop.icon}" width ="30" height="30" style="border: none; float:right; filter:brightness(0) saturate(100%)">`;
                    } else if (prop.label == 'Magical') {
                        itemDesc += '';
                    } else {
                        itemDesc += `${prop.label}`;
                    };
                });
            }
            if (itemType != "weapon") {
                itemDesc += `
                ${labels.materials ? `<br>Materials: ${labels.materials}` : ``}
                ${labels.armor ? `<br>Armor: ${labels.armor}` : ''}`
            };
            if (itemType == "weapon" && system.type.label == "Siege Weapon") {
                itemDesc += `${labels.armor ? `<br>Armor: ${labels.armor}` : ''}
                        ${system.hp.max ? `<br>Hit Points: ___/${system.hp.max}` : ''}
                        ${system.hp.dt ? `<br>Damage Threshold: ${system.hp.dt}` : ''}
                        ${system.hp.conditions ? `<br>Health Conditions: ${system.hp.conditions}` : ''}
                    `};
            itemDesc += `
                ${system.activation?.condition ? `<br>Condition: ${system.activation?.condition}` : ''}
                ${system.attunement ? `<br>Attunement: ${system.attunement.charAt(0).toUpperCase() + system.attunement.slice(1)}` : ''}
                ${labels.range && labels.range != "None" ? `<br>Range: ${labels.range}` : ''}
                ${labels.target ? `<br>Target: ${labels.target}` : ''}
                ${labels.duration ? `<br>Duration: ${labels.duration}` : ''}
                `
            if (system.consume?.type == "attribute") {
                itemDesc += `<br>Consumes: ${system.consume.amount} ${system.consume.target}`;
            } else if (system.consume?.type == "hitDice") {
                itemDesc += `<br>Consumes: ${system.consume.amount} ${system.consume.target} Hit Die`;
            } else if (system.consume?.type == "charges" || system.consume?.type === "ammo" || system.consume?.type === "material") {
                const conItem = actor.items.get(system.consume.target);
                itemDesc += `<br>Consumes: ${system.consume.amount} ${conItem.name} ${system.consume.type}`;
            }
            itemDesc += `
                    ${labels.save ? `<br><strong>${labels.save} Saving Throw</strong>` : ''}
                    ${labels.toHit ? `<br><strong>${CONFIG.DND5E.itemActionTypes[system.actionType]}: ${labels.toHit}</strong>` : ''}
                `;
            if (labels.derivedDamage && labels.derivedDamage.length > 0) {
                itemDesc += `<br><strong>Damage: `
                labels.derivedDamage.forEach(damage => {
                    itemDesc += `
                        ${damage.label} </strong> ${system.scaling?.mode == "level" ? `<br>Upcasting: +${system.scaling.formula} for each slot level above ${system.level}${nthNumber(system.level)}` : ''}
                    `;
                });
            }
            if (item.system.damage?.versatile) {
                itemDesc += `<br><strong>Versatile: ${system.damage.versatile}</strong>`
            }
            itemDesc += `<hr>${desc}`
            if (itemType != "spell" && labels.properties && labels.properties.length > 0) {
                itemDesc += `<hr>Properties: `
                labels.properties.forEach((prop, index) => {
                    if (index > 0) {
                        itemDesc += ', ';
                    }
                    itemDesc += `${prop.label} ${prop.icon ? `<img src="${prop.icon}" width="30" height="30" style="border: none; float: right">` : ''}`;
                });
            }
            itemDesc += `${itemType == "spell" && system.school != "" ? `<img src="${schoolIcon}" width="30" height="30" style="border: none; float: right">` : ''}`
        }
        itemDesc += `</article></div>`;

        if (itemType === 'weapon') {
            itemContent.weapon.push(itemDesc);
        } else if (itemType === 'spell' && item.system.preparation.mode === 'pact') {
            itemContent.spellPact.push(itemDesc);
        } else if (itemType === 'spell' && item.system.preparation.mode === 'atwill') {
            itemContent.atwill.push(itemDesc);
        } else if (itemType === 'spell' && item.system.preparation.mode === 'innate') {
            itemContent.innate.push(itemDesc);
        } else if (itemType === 'spell' && item.system.preparation.mode === 'ritual') {
            itemContent.ritual.push(itemDesc);
        } else if (itemType === 'spell' && item.system.level >= 0 && item.system.level <= 9) {
            itemContent.spell[item.system.level].push(itemDesc);
        } else if (itemType === 'consumable') {
            itemContent.consumable.push(itemDesc);
        } else if (itemType === 'equipment') {
            itemContent.equipment.push(itemDesc);
        } else if (itemType === 'feat' && item.system.type.value === 'class') {
            itemContent.class.push(itemDesc);
        } else if (itemType === 'feat' && item.system.type.value === 'race') {
            itemContent.race.push(itemDesc);
        } else if (itemType === 'feat' && item.system.type.value === 'feat') {
            itemContent.feat.push(itemDesc);
        } else if (itemType === 'feat' && item.system.type.value === 'background') {
            itemContent.background.push(itemDesc);
        } else if (itemType === 'feat') {
            itemContent.other.push(itemDesc);
        } else if (itemType === 'loot' || itemType === 'tool') {
            itemContent.otherItem.push(itemDesc);
        }
    });

    function generateColumns(title, items) {
        const column1 = items.slice(0, Math.ceil(items.length / 2)).join('');
        const column2 = items.slice(Math.ceil(items.length / 2)).join('');
        return `
        <h2 style="font-family: Modesto Condensed; font-size: 2em">${title}</h2>
        <div class="column" style="float: left; width: 50%; page-break-before: always;">
            ${column1}
        </div>
        <div class="column" style="float: right; width: 50%; page-break-before: always;">
            ${column2}
        </div>
        <div style="clear:both"></div>
    `;
    }

    // Page Content
    const pageTitle = `${actor.name}`;
    const weaponsContent = generateColumns('Weapons', itemContent.weapon);
    const pactContent = generateColumns(`Pact Spells Level ${slots.pact.level}`, itemContent.spellPact)
    const atwillContent = generateColumns(`At Will Spells`, itemContent.atwill)
    const innateContent = generateColumns(`Innate Spells`, itemContent.innate)
    const ritualContent = generateColumns(`Ritual Only`, itemContent.ritual)
    const consumeContent = generateColumns('Consumables', itemContent.consumable)
    const equipContent = generateColumns('Equipment', itemContent.equipment)
    const otherItemContent = generateColumns('Other Items', itemContent.otherItem)
    const classContent = generateColumns('Class Features', itemContent.class)
    const raceContent = generateColumns('Racial Features', itemContent.race)
    const featContent = generateColumns('Feats', itemContent.feat)
    const backContent = generateColumns('Background Features', itemContent.background)
    const otherContent = generateColumns('Other Features', itemContent.other)

    let content = `
    ${actorContent}
    <div class="item-columns">
        ${itemContent.weapon != "" ? `${weaponsContent}` : ''}
        ${itemContent.consumable != "" ? `${consumeContent}` : ''}
`;

    itemContent.spell.forEach((spellLevel, index) => {
        const spellLevelContent = generateColumns(`${index > 0 ? `Level ${index} Spells` : `Cantrips`}`, spellLevel);
        if (index == 0) {
            content += `
        ${itemContent.spell[0] != "" ? `${spellLevelContent}` : ""}
        ${itemContent.atwill != "" ? `${atwillContent}` : ""}
        ${itemContent.innate != "" ? `${innateContent}` : ""}
        ${itemContent.ritual != "" ? `${ritualContent}` : ""}
        ${itemContent.spellPact != "" ? `${pactContent}` : ""}
    `;
        } else if (spellLevel != "") {
            content += `
        ${spellLevelContent}
    `;
        }
    });
    content += `
        ${itemContent.class != "" ? `${classContent}` : ''}
        ${itemContent.feat != "" ? `${featContent}` : ''}
        ${itemContent.other != "" ? `${otherContent}` : ''}
        ${itemContent.equipment != "" ? `${equipContent}` : ''}
        ${itemContent.otherItem != "" ? `${otherItemContent}` : ''}
        ${itemContent.background != "" ? `${backContent}` : ''}
        ${itemContent.race != "" ? `${raceContent}` : ''}
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
