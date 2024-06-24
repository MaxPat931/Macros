const tableName = game.tables.getName("Table Name Here");
const rollResult = (await tableName.draw({ displayChat: false })).results[0];
if (!rollResult) return;
const packId = rollResult.type === "pack" ? `Compendium.${rollResult.documentCollection}` : `Item`;
const rollId = rollResult.documentId;
const item = await fromUuid(`${packId}.${rollId}`);

await ChatMessage.create({
    content: `
        <div class="dnd5e2">
            <div class="fvtt advice">
                <figure class="icon">
                    <img src="${item.img}" class="round">
                </figure>
                <article>
                    @UUID[${item.uuid}] ${item.system.description.value}
                </article>
            </div>
        </div>`
});
