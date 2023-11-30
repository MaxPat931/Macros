const packData = await game.packs.get("pack_key.pack_name").getDocuments()
        const data = packData.reduce((a, v) => { return a += `${v.name}: ${v.id}\r` }, '')
        const filename = `CompendiumItems.txt`;
        saveDataToFile(data, "text/plain", filename)
