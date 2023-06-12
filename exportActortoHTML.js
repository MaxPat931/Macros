for (let token of canvas.tokens.controlled) {

    // Get actor data
    let actorData = token.actor;

    // Store date
    let date = new Date();

    // Start HTML generation
    let exportHTML = /*html*/ `
    <html>
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://code.jquery.com/jquery-3.6.0.min.js" crossorigin="anonymous"></script>
            <style type="text/css">
                .item{
                    border: black;
                    border-style: solid;
                    border-width: 1px;
                    border-radius: 5px;
                    padding: 2px;
                    margin: 3px 3px;
                    width: 30%;
                    break-inside: avoid;
                }
                .item-header{
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    cursor: pointer;
                    width: 100%;
                    flex-direction: column;
                    margin: 5px;
                }
                .prepared{
                    background-color: #aaffaa;
                }
                .header-img{
                    max-width:50px;
                    max-height:50px;
                    filter: drop-shadow(0px 0px 1px black);
                    margin-right:10px;
                }
                .actor-img{
                    max-width:60px;
                    max-height:60px;
                    float:left;
                }
                .spell-container{
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: space-evenly;
                    align-items: flex-start;
                }
                .primary-info{
                    display: flex;
                    justify-content: space-evenly;
                }
                .secondary-info{
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    justify-content: space-around;
                }
                .spell-details{
                    margin:5;
                    justify-content: flex-end;
                }
                .small-head {
                    margin-left: 5px;
                }
                .abilities-container {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: baseline;
                }
                .ability-container {
                    display: flex;
                    flex-wrap: nowrap;
                    flex-direction: column;
                    align-items: center;
                    width: 80px;
                    border: black solid 1px;
                    border-radius: 20px;
                    background: #dddddd;
                    margin: 10px;
                }
                .ability-title{
                    margin: 8px;
                    font-weight: bold;
                    text-transform: capitalize;
                    font-size: larger;
                }
                .ability-value{
                    margin:2px;
                }
                .skills-container {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    align-items: baseline;
                }
                .skill-container {
                    display: flex;
                    height: 20px;
                    border: black solid 1px;
                    border-radius: 5px;
                    background: #dddddd;
                    margin: 2px;
                    width: 32%;
                    align-items: center;
                    flex-direction: row;
                    justify-content: space-between;
                }
                .skill-title{
                    margin: 8px;
                    font-weight: bold;
                    text-transform: capitalize;
                    font-size: small;
                    width: fit-content;
                }
                .skill-value{
                    margin:8px;
                }
                .link-container{
                    position: fixed;
                    right: 0;
                    bottom: 0;
                    background: white;
                    margin: 10px;
                    padding: 0px 20px;
                    border-radius: 20px;
                    opacity: 0.4;
                    transition: linear 0.5s;
                    -moz-transition: linear 0.5s;
                    -webkit-transition: linear 0.5s;
                }
                .link-container:hover{
                    opacity: 1;
                }
                .skill-terrible{
                    background: #882323;
                }
                .skill-bad{
                    background: #867124;
                }
                .skill-ok{
                    background: #465204;
                }
                .skill-good{
                    background: #327301;
                }
                .skill-excellent{
                    background: #1bea02;
                }
                .skill-awesome {
                    background: linear-gradient(90deg, #1bea02, #c5ffb6);
                    box-shadow: 0px 0px 2px 2px #615100;
                    border-color: gold;
                }
                @media only screen and (max-width: 1000px) {
                    .item{
                        width: 47%;
                    }
                }
                @media only screen and (max-width: 95%) {
                    .spell-container{
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    .item{
                        margin: 5px 0px;
                        width: 95%;
                    }
                }
                @media print {
                    .pagebreak { 
                         page-break-before: always; 
                    }
                }
            </style>
            <script type="text/javascript">
                $(function() {
                    $('div.expand').click(function(){
                        var co = $('.collapse')
                        var el = $(this).next(co);
                        el.toggle('fast')
                    });
                    $('#show-all').click(function(){
                        $('.collapse').show('fast'); //Show all
                    });
                    $('#hide-all').click(function(){
                        $('.collapse').hide('fast'); //Hide all
                    });
                });
            </script>
        </head>
    <body>
        <div>`
    // End first HTML generation

    exportHTML += `<h1>${actorData.name} Level ${actorData.system.details.level}  HP: __/${actorData.system.attributes.hp.max}</h1>`
    if (actorData.img) {
        let image = await ImageHelper.createThumbnail(actorData.img, {
            width: 200,
            height: 200
        });
        exportHTML += `<img class="actor-img" src=${image.thumb}></img>`
    }

    // ABILITIES
    let abilities = actorData.system.abilities;

    exportHTML += `<div class="abilities-container">`
    for (let abilityKey in abilities) {
        exportHTML += `<div class="ability-container">`;
        exportHTML += `<p class="ability-title">${abilityKey}</p>`;
        exportHTML += `<p class="ability-value">${abilities[abilityKey].value} (${abilities[abilityKey].mod>0?`+${abilities[abilityKey].mod}`:abilities[abilityKey].mod||0})</p>`;
        exportHTML += `</div>`;
    }

    exportHTML += `</div>`

    // SKILLS
    let skills = Object.values(actorData.system.skills);    
    let skillNames = Object.keys(actorData.system.skills);
    for(let i=0; i<skills.length; i++){
        if(!skills[i].label){
            skills[i].label = CONFIG.DND5E.skills[skillNames[i]]
        }
    }

    exportHTML += `<div class="skills-container">`
    for (let skill of skills) {
        let skillClass;
        if(skill.total < 0){
            skillClass="skill-terrible";
        }else if(skill.total<= 2){
            skillClass="skill-bad";
        } else if(skill.total <= 4){
            skillClass = "skill-ok";
        } else if(skill.total <= 6){
            skillClass = "skill-good";
        } else if(skill.total <= 9) {
            skillClass = "skill-excellent";
        } else {
            skillClass = "skill-awesome";
        }
        exportHTML += `<div class="skill-container ${skillClass}">`
        exportHTML += `<p class="skill-title">${skill.label.label} (${skill.ability})</p>`
        switch (skill.value) {
            case 0:
                exportHTML += `<small>None</small>`
                break;
            case 0.5:
                exportHTML += `<small>Half</small>`
                break;
            case 1:
                exportHTML += `<small>Prof</small>`
                break;
            case 2:
                exportHTML += `<small>Exp.</small>`
                break;

            default:
                exportHTML += `<small>Unknown: ${skill.value}</small>`
                break;
        }
        exportHTML += `<p class="skill-value"><b>${skill.total>0?`+${skill.total}`:skill.total||'=0'}</b> (${skill.passive})</p>`
        exportHTML += `</div>`

    }
    exportHTML += `</div>`



    // ITEMS
    let items = actorData.items;
    // ["feat", "class","weapon","equipment", "backpack", "loot", "tool", "spell", "consumable"]
    exportHTML += `<button id="show-all">Expand All</button>`;
    exportHTML += `<button id="hide-all">Collapse All</button>`;

    exportHTML += `<div class="link-container">`
    exportHTML += `<p><a href="#spells-header">Spells</a></p>`
    exportHTML += `<p><a href="#feats-header">Features & Feats</a></p>`
    exportHTML += `<p><a href="#loot-header">Inventory</a></p>`
    exportHTML += `</div>`

    //Currency
    exportHTML += `<h3>Currency</h3>`;
    exportHTML += `<p>| `
    for (let currency in actorData.system.currency) {

        exportHTML += `<b>${currency}:</b> ${actorData.system.currency[currency]} | `
    }
    exportHTML += `</p>`
    exportHTML += `<p>`
    exportHTML += `Spell Slots (Spell DC: <b>${actorData.system.attributes.spelldc}</b>)`
    exportHTML += `</p>`
    exportHTML += `First Level: __/ <b>${actorData.system.spells.spell1.max}</b>, Second Level: __/ <b>${actorData.system.spells.spell2.max}</b>, Third Level: __/ <b>${actorData.system.spells.spell3.max}</b>, Fourth Level: __/ <b>${actorData.system.spells.spell4.max}</b>, Fifth Level: __/ <b>${actorData.system.spells.spell5.max}</b>, Sixth Level: __/ <b>${actorData.system.spells.spell6.max}</b><br> Seventh Level: __/ <b>${actorData.system.spells.spell7.max}</b>, Eigth Level: __/ <b>${actorData.system.spells.spell8.max}</b>, Ninth Level: __/ <b>${actorData.system.spells.spell9.max}</b>`
    exportHTML += `<p>`
    exportHTML += `<div class="abilities-container">`
    exportHTML += `<div class="ability-container">`;
    exportHTML += `<p class="ability-title">AC</p>`;
    exportHTML += `${actorData.system.attributes.ac.value}`
    exportHTML += `</div>`;
    exportHTML += `<div class="ability-container">`;
    exportHTML += `<p class="ability-title">Hit Die</p>`;
    exportHTML += `${actorData.system.attributes.hd}`
    exportHTML += `</div>`;
    exportHTML += `<div class="ability-container">`;
    exportHTML += `<p class="ability-title">Initiative</p>`;
    exportHTML += `+${actorData.system.attributes.init.total}`
    exportHTML += `</div>`;
    exportHTML += `<div class="ability-container">`;
    exportHTML += `<p class="ability-title">Proficiency</p>`;
    exportHTML += `${actorData.system.attributes.prof}`
    exportHTML += `</div>`;
    exportHTML += `</div>`;
    exportHTML += `Senses: ${actorData.system.attributes.senses}, Movement: ${actorData.system.attributes.movement},`
    exportHTML += `</p>`


    exportHTML += `<div class="pagebreak"> </div>`


    //  // CLASSES
    //  let classes = items.filter((e) => e.type == "class");

    //  if (classes && classes.length > 0) {
    //     //  feats = feats.sort((a,b)=>{return a.system.level<b.system.level?-1:0});
    //      exportHTML += `<h2 id="class-header">Classes</h2>`;
    //      exportHTML += `<div id="spell-container" class="spell-container">`;
    //      for (let _class of classes) {
    //          exportHTML += `<div class="item class">`
    //          exportHTML += `<small>${_class.system.level==0?'Cantrip':'Level '+_class.system.level}</small>`
    //          exportHTML += `<div class="item-header expand">`
    //          if (_class.img) {
    //              try {
    //                  let image = await ImageHelper.createThumbnail(_class.img, {
    //                      width: 50,
    //                      height: 50
    //                  });
    //                  exportHTML += `<img class="header-img" src=${image.thumb}></img>`
    //              } catch (e) {
    //                  console.log(e);
    //              }
    //          }
    //          exportHTML += `<h3>${_class.name}</h3>`
    //          exportHTML += `</div>`
    //          exportHTML += `<div class="collapse" style="display:none;">`
    //          exportHTML += `<p>${_class.system.description.value}</p>`
    //          exportHTML += `</div>`

    //          exportHTML += `</div>`
    //      }
    //      exportHTML += `</div>`;
    //  }

    // SPELLS
    let spells = items.filter((e) => e.type == "spell");

    if (spells && spells.length > 0) {
        spells = spells.sort((a, b) => {
            return a.system.level < b.system.level ? -1 : 0
        });
        spells = spells.sort((a, b) => {
            if (a.system.level == b.system.level) {
                return a.name[0] < b.name[0] ? -1 : 0;
            }
            return 0;
        });
        exportHTML += `<h2 id="spells-header">Spells</h2>`;
        exportHTML += `<div id="spell-container" class="spell-container">`;
        for (let spell of spells) {
            exportHTML += `<div class="item spell${(spell.system.preparation.mode=="prepared" || spell.system.preparation.mode=="always") && spell.system.preparation.prepared?' prepared':''}">`
            exportHTML += `<small class="small-head">${spell.system.level==0?'Cantrip':'Level '+spell.system.level} - ${spell.system.activation.cost} ${spell.system.activation.type}</small>`
            exportHTML += `<div class="item-header expand">`
            exportHTML += `<div class="primary-info">`
            if (spell.img) {
                try {
                    let image = await ImageHelper.createThumbnail(spell.img, {
                        width: 50,
                        height: 50
                    });
                    exportHTML += `<img class="header-img" src=${image.thumb}></img>`
                } catch (e) {
                    console.log(e);
                }
            }
            exportHTML += `<h3>${spell.name}${(spell.system.preparation.mode=="prepared" || spell.system.preparation.mode=="always") && spell.system.preparation.prepared?' - Prepared':''} </h3>`
            exportHTML += `</div>`
            exportHTML += `<div class="secondary-info">`
            exportHTML += `<p class="spell-details">Duration: <br>${spell.system.duration.value||''} ${spell.system.duration.units||''}</p>`
            exportHTML += `<p class="spell-details">Range: <br>${spell.system.range.value||''} ${spell.system.range.units||''}</p>`
            exportHTML += `<p class="spell-details">Target: <br>${spell.system.target.value||''} ${spell.system.target.units||''} ${spell.system.target.type||'?'}</p>`
            exportHTML += `</div>`
            exportHTML += `</div>`
            exportHTML += `<div class="collapse" style="display:none;">`
            exportHTML += `<p>${spell.system.description.value||'No Description'}</p>`
            exportHTML += `</div>`

            exportHTML += `</div>`
        }
        exportHTML += `</div>`;
    }


    // Feats
    let feats = items.filter((e) => e.type == "feat");

    if (feats && feats.length > 0) {
        feats = feats.sort((a, b) => {
            return a.system.activation.type && !b.system.activation.type ? -1 : 0
        });
        feats = feats.sort((a, b) => {
            if (a.system.activation.type == b.system.activation.type) {
                return a.name[0] < b.name[0] ? -1 : 0;
            }
            return 0;
        });
        exportHTML += `<div class="pagebreak"> </div>`
        exportHTML += `<h2 id="feats-header">Features</h2>`;
        exportHTML += `<div id="spell-container" class="spell-container">`;
        for (let feat of feats) {
            exportHTML += `<div class="item feat">`
            exportHTML += `<small class="small-head">${feat.system.activation.type?'Active':'Passive'}</small>`
            exportHTML += `<div class="item-header expand">`
            exportHTML += `<div class="primary-info">`
            if (feat.img) {
                try {
                    let image = await ImageHelper.createThumbnail(feat.img, {
                        width: 50,
                        height: 50
                    });
                    exportHTML += `<img class="header-img" src=${image.thumb}></img>`
                } catch (e) {
                    console.log(e);
                }
            }
            exportHTML += `<h3>${feat.name}</h3>`
            exportHTML += `</div>`
            exportHTML += `</div>`
            exportHTML += `<div class="collapse" style="display:none;">`
            exportHTML += `<p>${feat.system.description.value||'No Description'}</p>`
            exportHTML += `</div>`

            exportHTML += `</div>`
        }
        exportHTML += `</div>`;
    }


    // Items/Loot
    let loots = items.filter((e) => e.type == "backpack" || e.type == "tool" || e.type == "loot" || e.type == "consumable" || e.type == "equipment" || e.type == "weapon");

    if (loots && loots.length > 0) {
        loots = loots.sort((a, b) => {
            return a.type[0] > b.type[0] ? -1 : 0
        });
        loots = loots.sort((a, b) => {
            if (a.type[0] == b.type[0]) {
                return a.name[0] > b.name[0] ? -1 : 0;
            }
            return 0;
        })
        exportHTML += `<div class="pagebreak"> </div>`
        exportHTML += `<h2 id="loot-header">Items</h2>`;
        exportHTML += `<div id="spell-container" class="spell-container">`;
        for (let loot of loots) {
            exportHTML += `<div class="item loot${loot.system.equipped?' prepared':''}">`
            exportHTML += `<small class="small-head">${loot.type[0].toUpperCase()+loot.type.substr(1)}${loot.system.equipped?' - Equipped':''}</small>`
            exportHTML += `<div class="item-header expand">`
            exportHTML += `<div class="primary-info">`
            if (loot.img) {
                try {
                    let image = await ImageHelper.createThumbnail(loot.img, {
                        width: 50,
                        height: 50
                    });
                    exportHTML += `<img class="header-img" src=${image.thumb}></img>`
                } catch (e) {
                    console.log(e);
                }
            }
            exportHTML += `<h3>${loot.name} ${loot.system.quantity!=1?`(${loot.system.quantity||0})`:''}</h3>`
            exportHTML += `</div>`
            exportHTML += `</div>`
            exportHTML += `<div class="collapse" style="display:none;">`

            exportHTML += `<p>${loot.system.description.value||'No Description'}</p>`
            exportHTML += `</div>`

            exportHTML += `</div>`
        }
        exportHTML += `</div>`;
    }


    // ---- END

    exportHTML += `</div>
</body>
</html>`

    saveDataToFile(exportHTML, 'html', `${actorData.name}-${date.toISOString()}.html`);
}
