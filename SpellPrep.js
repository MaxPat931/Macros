if (args[0]) token = canvas.tokens.placeables.filter(t=>t.actor?.uuid===args[0].replaceAll('_','.'))[0];
token.control({releaseOthers:true});
let w_id = token.actor.uuid.replace('.','_') + "-spells";
let spells = token.actor.itemTypes.spell.sort((a, b)=> (a.system.level > b.system.level) ? 1 : (a.system.level === b.system.level) ? ((a.name > b.name) ? 1 : -1) : -1  );
let level = -1;
let list = ``;//<div  style="display:grid; grid-template-columns: repeat(4, 200px)" >`;
let unprepared = 'rgba(150,150,150,1) !important';
for (const spell of spells){
  if (spell.system.level !== level){
    level ++;
    if (level>=0) list +=`</div>`;
    list +=`<h2>Level ${level}</h2><div  style="display:grid; grid-template-columns: repeat(4, 220px)" >`;
  }
  let style = 'color: #fff !important';
  if (spell.system.preparation?.mode === 'prepared' && !spell.system.preparation.prepared) style = `color: ${unprepared}`;
  if (spell.system.level === 0) style = 'color: #fff !important';
  if (spell.system.preparation?.mode === 'innate') style = 'color: #8ff !important';//level = 'Innate';
  if (spell.system.preparation?.mode === 'pact') style = 'color: #fD3 !important';
  list += `
  <div id="${spell.id}" >
  <img src="${spell.img}" height="14" style="background: url(../ui/denim075.png) repeat;"/>
  <span><a id="spell-name-${spell.id}" style="${style}" name="${spell.id}"> ${spell.name}</a> 
  </span></div>`;
}//<a id="spell-delete-${spell.id}" name="${spell.id}" style="float:right;"><i class="fa fa-times"></i></a>
list += `</div>`;
let d = new Dialog({
  title: `${token.actor.name} Spells Prepared: `,
  content:  list,
  render: ()=>{
    let header = `${token.actor.name} Spells Prepared:
    ${token.actor.itemTypes.spell.filter(spell=>spell.system.preparation.mode === 'prepared' && spell.system.preparation?.prepared).length} / ${token.actor.system.abilities.int.mod + token.actor.system.details.level}`;
    $(`#${w_id} > header > h4`).html(header);
    
    console.log($(`#${w_id}`).css('height', (parseInt($(`#${w_id}`).css('height').split('p')[0])+5))+"px")
    
    $("input#myspellInput").focus();
    $("a[id^=spell-name]").contextmenu(async function(e){
        let spell = token.actor.items.get(this.name);
        console.log(spell);
        spell.sheet.render(true);
    });
    $("a[id^=spell-name]").click(async function(){
      let spell = token.actor.items.get(this.name);
        if (spell.system.preparation.mode !== 'prepared') 
          return ui.notifications.warn(`${spell.name} is not a preparable spell`);
        await  spell.update({"data.preparation.prepared":!spell.system.preparation.prepared})
        console.log(spell.system.preparation.prepared, spell.system.preparation.mode) ;
        console.log($(this))
        if (spell.system.preparation.prepared) 
          $(this).attr('style', ``);
        else 
          $(this).attr('style', `color : ${unprepared}`);
        
        let header = `${token.actor.name} Spells Prepared: 
        ${token.actor.itemTypes.spell.filter(spell=>spell.system.preparation.mode === 'prepared' && spell.system.preparation?.prepared).length} / ${token.actor.system.abilities.int.mod + token.actor.system.details.level}`;
        $(`#${w_id} > header > h4`).html(header);
        
    });
    $("a[id^=spell-delete]").click(async function(){
        let spell = token.actor.spells.get(this.name);
        await spell.delete();
        $(this).parent().remove();
    });
    $("input#myspellInput").keyup(function(){
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById('myspellInput');
        filter = input.value.toUpperCase();
        ul = document.getElementById("spellsUL");
        li = ul.getElementsByTagName('p'); 
        
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("span")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    });  
  },
  buttons: {},
  close:   html => {
      return}
},{width: 900, id: w_id}
);
d.render(true);
