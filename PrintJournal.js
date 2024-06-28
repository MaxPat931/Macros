//Original credits: @Xaukael, @radyclyfe, & @ghost in #macro-polo

new Dialog({
  title: 'Print Journals',
  content: game.folders.filter(f=> f.type === 'JournalEntry').reduce((acc,f)=>acc+=`<option value="${f.id}">${f.name}</option>`,`<select class="folder-select" style="width: 100%"><option value="" selected>root</option>`)+`</select><select class="journal-select" style="width: 100%"></select>`,
  
  render: (html)=>{
    html.find(`.journal-select`).html($(
    game.journal.filter(j=>(j.folder?.id||'')==html.find(`.folder-select`).val()).map(f=>`<option value="${f.id}">${f.name}</option>`).join('')
    ))
    html.find(`.folder-select`).change(function(){
      html.find(`.journal-select`).html($(
        game.journal.filter(j=>(j.folder?.id||'')==$(this).val()).map(f=>`<option value="${f.id}">${f.name}</option>`).join('')
      ))
    })
     
  },
  buttons: {
    print: {
      icon: `<i class="fas fa-print"></i>`,
      label: `Print`,
callback: async (html) => {
    let newWin = window.open("");
    let head = $('head').clone();
    head.find('script').remove();
    let j = game.journal.get(html.find(`.journal-select`).val());
    
    let body = await j.pages.contents
        .sort((a, b) => a.sort - b.sort)
        .reduce(async (accPromise, page) => {
            let acc = await accPromise;
            let enrichedHTML = await TextEditor.enrichHTML(`<h1 style="page-break-before: always; font-family: var(--dnd5e-font-modesto);">${page.name}</h1><div>${page.text.content}</div>`);
            return acc + enrichedHTML;
        }, Promise.resolve(`${head[0].outerHTML}<body style="background: url(../ui/parchment.jpg) repeat; 
            position: unset !important;
            width: unset;
            height: unset;
            margin: 1em;
            overflow: unset;
            box-shadow: unset">`))
        + `</body>`;

    body = `<div class="dnd5e2">${body}</div>`;

    newWin.document.write(body);
}
    }
  },
  default: 'print',
  close: ()=>{return}
},{width: 300}).render(true)
