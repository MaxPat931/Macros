/// Thanks to Kaelad for the original writeup, and ThatLoenlyBugbear for the udpates
const tokenActor = args[0]?.actor ?? token.actor;

const spells = tokenActor.items
  // Spells
  .filter((i) => i.type === "spell")
  // 1 Action
  .filter((s) => s.system.activation.cost === 1 && s.system.activation.type === "action")
  // 1 target
  .filter(
    (s) => s.system.target.value === 1 && ["enemy", "creature"].includes(s.system.target.type)
  )
  // Prepared or otherwise available to cast
  .filter(
    (s) =>
      s.system.level === 0 ||
      (s.system.preparation.mode === "prepared" && s.system.preparation.prepared) ||
      ["pact", "always", "atwill", "innate"].includes(s.system.preparation.mode)
  );
const content = `<center><b>Available Spells</b></center>
<style>
    #warcaster-dialog .dialog-buttons { display:grid; }
    #warcaster-dialog .dialog-buttons > *{ text-align:left ;}
</style>


`;
const comp = compare(spells)
const buttons = comp.map((s) => ({ label: `${s.labels.level}: ${s.name}` , callback:()=>{return s.id} }));
const spellId = await Dialog.wait({
  buttons,
  title: "Warcaster: AoO",
  content,
  close: () => {return false}
},{id: "warcaster-dialog",width:'auto'});

if (spellId) MidiQOL.completeItemUse(tokenActor.items.get(spellId))

function compare(array){
  array.sort((ar,br) => {
    const a = ar.labels.level.at()
    const b = br.labels.level.at()
    if (!isNaN(Number(a) && !isNaN(Number(b)))) {      
      if (Number(a) > Number(b)) return 1;
      else if(Number(a) < Number(b)) return -1; 
      else return 0;  
    }
    else if (!isNaN(Number(a)) && isNaN(Number(b))) return 1;
    else if (isNaN(Number(a)) && !isNaN(Number(b))) return -1;
    else {
      if(a>b) return -1;
      else if (a<b) return 1;
      else return 0;
    }
  })
  return array;
}
