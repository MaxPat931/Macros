const tableName = game.tables.getName("Table Name Here");
const rollResults = (await tableName.draw({ displayChat: false })).results;
if (!rollResults || rollResults.length === 0) return;
let allContent = [];
for (let rollResult of rollResults) {
    const packId = rollResult.type === "pack" ? `Compendium.${rollResult.documentCollection}` : `Item`;
    const rollId = rollResult.documentId;
    const item = await fromUuid(`${packId}.${rollId}`);
    const content = `
        <div class="dnd5e2">
            <div class="fvtt advice">
                <figure class="icon">
                    <img src="${item.img}" class="round">
                </figure>
                <article>
                    @UUID[${item.uuid}] ${item.system.description.value}
                </article>
            </div>
        </div>`;
    allContent.push(content);
}
const combinedContent = allContent.join('');
await ChatMessage.create({
    content: combinedContent,
    speaker: { token: "", actor: "", scene: "", alias: "Roll Table Results" }
});
