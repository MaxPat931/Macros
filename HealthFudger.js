new Dialog({
  title: `Fudging DM`,
  content:`<center ><p style="margin-top: -2px;">${token.name}</p></center><input id="hp-change-${token.id}" type="text" style="text-align: center; margin-bottom: 2px;"></input>`,
  render: (content) => {
    $(`#hp-change-${token.id}`).focus();
    $(`#hp-dialog-${token.id} > section > div.dialog-buttons > button`).hide();
    },
  buttons: { 
      apply: {
        icon: "<i class='fas fa-check'></i>",
        label: `Apply`,
        callback: async (html) => {
          let actor = token.actor;
          let input = $(`#hp-change-${token.id}`).val()
          const hpVAL = parseInt(actor.system.attributes.hp.value);
          const hpMAX = parseInt(actor.system.attributes.hp.max);
          let value = parseInt(input)
          if(input.at(0) === '+') return await actor.update({'system.attributes.hp.value': Math.min(hpVAL + value, hpMAX)});
          if(input.at(0) === '-') return await actor.update({'system.attributes.hp.value': Math.max(hpVAL + value, 0)});
          return await actor.update({'system.attributes.hp.value': input});
        }
      }
  },
  default: 'apply',
  close:   html => {
      return}
},{ width: 200, top: token.children[0].transform.worldTransform.ty + canvas.grid.size*1.1 , left: token.children[0].transform.worldTransform.tx - canvas.grid.size*.5 ,  id:`hp-dialog-${token.id}` }
).render(true);
