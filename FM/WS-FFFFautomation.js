///Populate Combatants automatically on Combat Create
Hooks.on("createCombat", async (combat) => {
    const initiativeTokens = [
    "Kalis Karr",
    "Human Apprentice Mage Init",
    "Human Trickshot Init",
    "Human Guard Init",
    "Lapis Tenebra",
    "Bonecruncher",
    "Ulf the Quick",
    "Revna the Blue"
];

for (const token of canvas.tokens.placeables) {
    const orc = token.actor?.name; 
    if (!orc || !initiativeTokens.includes(orc)) continue;
    let initVal;
    // Set initiative based on the token's name
    switch (orc) {
        case "Kalis Karr":
            initVal = 7;
            break;
        case "Human Apprentice Mage Init":
            initVal = 5;
            break;
        case "Human Trickshot Init":
            initVal = 3;
            break;
        case "Human Guard Init":
            initVal = 1;
            break;
        case "Lapis Tenebra":
        case "Bonecruncher":
        case "Ulf the Quick":
        case "Revna the Blue":
            initVal = 10;
            break;
        default:
            initVal = 0;
            break;
    }

    // Add token to combat tracker if not already there
    if (!token.combatant) {
        await token.toggleCombat();
    }

    // Update initiative
    await token.combatant.update({ initiative: initVal });
}
await combat.activate();
ui.combat.renderPopout();
await game.combat.startCombat();
});

///When a new Round begins, send a message to chat for new initiative rolls
///Display subsequent dialogs to set the new initiative order, should also return to first turn but thats a little iffy for some reason
Hooks.on("updateCombat", async (combat, changes) => {
    if (!foundry.utils.hasProperty(changes, "round")) return;

    ChatMessage.create({
        content: `Top of the round! <p><strong>[[/check dex]]{Roll for Initiative!}</strong></p>`,
    })

    const createGiantInitiativeDialog = async (title, initiative) => {
        const content = `
    <div class="row">
        <div class="column">
      <label><input type="radio" name="choice" value="Bonecruncher" checked> <img style='border: none; height: 150px' src='worlds/feefifofum/assets/HillGiant.png'></label>
      <label><input type="radio" name="choice" value="Lapis Tenebra"> <img style='border: none; height: 150px' src='worlds/feefifofum/assets/ObsidianGiant.webp'></label>
        </div>
        <div class="column">
      <label><input type="radio" name="choice" value="Ulf the Quick"> <img style='border: none; height: 150px' src='modules/flee-mortals/tokens/FrostGiantWindSprinter.png'></label>
      <label><input type="radio" name="choice" value="Revna the Blue"> <img style='border: none; height: 150px' src='worlds/feefifofum/assets/FrostGiantStormHurler.png'></label>
      </div>
      </div>
    `;
        await foundry.applications.api.DialogV2.wait({
            title,
            content,
            buttons: [{
                action: "choice",
                label: "Set Initiative",
                default: true,
                callback: (event, button, dialog) => button.form.elements.choice.value
            }],
            submit: result => {
                updateGiantInitiative(result, initiative);
            }
        });
    };

    const updateGiantInitiative = async (giantName, initiative) => {
        const giant = game.combat.combatants.getName(giantName);
        if (giant) {
            await giant.update({ initiative });
        }
    };

    // Create dialogs with different initiatives
    if (game.user.isGM) {
    await createGiantInitiativeDialog("Giant Initiative 1", 8);
    await createGiantInitiativeDialog("Giant Initiative 2", 6);
    await createGiantInitiativeDialog("Giant Initiative 3", 4);
    await createGiantInitiativeDialog("Giant Initiative 4", 2);

    await game.combat.update({ turn: 0 });
    }
});

//Empowered Patron reminder
Hooks.on("updateCombat", async (combat, updates) => {
  if (game.combat.combatant?.name != "Kalis Karr") return;
  const mages = canvas.tokens.placeables.filter(token => token.actor.name === "Human Apprentice Mage").length;
  let mageHeal = mages * 2;

  ChatMessage.create({
    content: `
     <div class="dnd5e2">
      <div class="fvtt advice" style="background-color: oldlace;">
          <figure class="icon">
              <img src="icons/magic/light/explosion-beam-impact-silhouette.webp" class="round">
          </figure>
          <article>
            <p>At the start of the patron’s turn, the patron gains temporary hit points equal to twice the number of apprentice mages within 60 feet of them who chose them as a patron and can see them.</p>
            <p>[[/healing ${mageHeal} temp]]</p>
          </article>
        </div>
      </div>
    `,
    speaker: { token: "ngvJDil8MmD6ikNE", actor: "ZR4RfvS5QX8hivBV", scene: "p8F6b7M4hwqT2Tm4" }
  })
});

//Guard Reinforcements
Hooks.on("updateCombat", async (combat, updates) => {
  if (game.combat.combatant.name != "Human Guard") return;
  const guard = game.actors.getName("Human Guard")
  const reinforce = guard.items.getName("Reinforcements");
  await reinforce.use({ legacy: false }, { rollMode: CONST.DICE_ROLL_MODES.PRIVATE });
});

//Change EXP levels for Point tracking
Hooks.once("init", () => {
  CONFIG.DND5E.CHARACTER_EXP_LEVELS = [0, 0, 0, 0, 0, 70, 0, 0, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
});

///Automatically process token updates and item usage on 0 HP for buildings
const createMessageContent = (imageSrc, xpAmount, description) => {
  return `
      <div class="dnd5e2">
          <div class="fvtt advice" style="background-color: oldlace;">
              <figure class="icon">
                  <img src="${imageSrc}" class="round">
              </figure>
              <article>
                  <p>${description}</p>
                  <p>[[/award ${xpAmount}xp]]</p>
              </article>
          </div>
      </div>
  `;
};

Hooks.on("updateActor", async (tokenDoc, updates) => {
  const hpValue = updates?.system?.attributes?.hp?.value;

  if (hpValue !== undefined && hpValue <= 0) {

    if (tokenDoc.prototypeToken.name == "Building") {
      const token = tokenDoc.token;
      await token.update({ alpha: Number(!token.alpha) });
    }

    const tokenImage = tokenDoc.img;
    let xpAmount = 0;
    let description = '';
    let lootItemName = '';

    switch (tokenDoc.name) {
      case "The Keep":
        const light = canvas.scene.lights.get("YajTcW2DV5QsBOj5");
        if (light) await light.update({ hidden: !light.hidden });
        const wizard = canvas.tokens.placeables.find(t => t.actor.name === "Kalis Karr");
        await wizard.document.update({ light: { bright: 0 } });

        xpAmount = 15;
        description = "The Keep has Fallen! Kalis Karr's protection has disappeared!";
        break;

      case "Inn":
        xpAmount = 10;
        description = `${tokenDoc.name} Destroyed!`;
        lootItemName = "Bandit Screams";
        break;

      case "Farm House":
        xpAmount = 5;
        description = `${tokenDoc.name} Destroyed!`;
        lootItemName = "Loot the Ruins!";
        break;

      case "Alchemist Shop":
        xpAmount = 5;
        description = `${tokenDoc.name} Destroyed!`;
        lootItemName = "Invisible";
        break;

      case "Blacksmith":
        xpAmount = 5;
        description = `${tokenDoc.name} Destroyed!`;
        lootItemName = "Craft a Helmet";
        break;

      case "General Store":
        xpAmount = 5;
        description = `${tokenDoc.name} Destroyed!`;
        lootItemName = "Magic Rations";
        break;

      case "Apple Orchard":
        xpAmount = 2;
        description = "Applesauce: Earned for eating the orchard. A giant can devour all the apple trees to regain 50 hit points.";
        break;

      case "Lake":
        xpAmount = 4;
        description = "Soil the Lake: Earned for soiling the lake when a giant fully submerges themselves in the water.";
        break;

      case "Vineyard":
        xpAmount = 4;
        description = "Red, Red Wine: Earned for eating the vineyard and regaining 100 hit points.";
        break;

      case "Human Trickshot":
        xpAmount = 5;
        description = "Slightly-Less-Puny Human: Earned for killing a human trickshot.";
        break;

      case "Kalis Karr":
        xpAmount = 10;
        description = "Kinda-Not-Puny Human: Earned for killing Kalis Karr.";
        break;
    }

    if (xpAmount > 0 && description) {
      const messageContent = createMessageContent(tokenImage, xpAmount, description);
      await ChatMessage.create({
        content: messageContent
      });
    }

    if (lootItemName) {
      const lootItem = tokenDoc.items.getName(lootItemName);
      if (lootItem) {
        await lootItem.use({ legacy: false });
      }
    }
  }
});

// Swap Tree Actor summons with Tiles
Hooks.on("dnd5e.postSummon", (activity, _, spawn) => {
  if (activity.item.name == "Pluck a Tree") {
    const tree = [];
    tree.push(spawn[0]._id);
    TileDocument.create({
      x: spawn[0].x,
      y: spawn[0].y,
      width: 110,
      height: 110,
      "texture.src": spawn[0].texture.src
    }, { parent: canvas.scene });

    canvas.scene.deleteEmbeddedDocuments("Token", tree);
  }
})

/// Count Trees when Combat is ended
Hooks.on("deleteCombat", async (combat) => {
    const giantValues = ["Lapis Tenebra", "Bonecruncher", "Revna the Blue", "Ulf the Quick"];

    const giantCount = {};

    canvas.scene.tiles.forEach(tile => {
        const giantValue = tile.flags?.summoner?.giant;

        if (giantValues.includes(giantValue)) {
            if (!giantCount[giantValue]) {
                giantCount[giantValue] = 0;
            }
            giantCount[giantValue]++;
        }
    });

    const sortedGiantCount = Object.entries(giantCount)
        .sort((a, b) => b[1] - a[1]);

    const topCount = sortedGiantCount[0][1];

    const topGiants = sortedGiantCount.filter(([giant, count]) => count === topCount);

    let messageContent = `
        <div class="dnd5e2">
            <div class="fvtt advice" style="background-color: oldlace;">
                <figure class="icon">
                    <img src="icons/environment/wilderness/tree-ash.webp" class="round">
                </figure>
            <article>
    `;

    if (topGiants.length > 1) {
        const topGiantNames = topGiants.map(([giant]) => giant).join(", and ");
        messageContent += `<p><strong>${topGiantNames}</strong> plucked the most trees with <strong>${topCount}</strong> earning</p><p>[[/award 5xp]]</p>`;
    } else {
        messageContent += `<p><strong>${topGiants[0][0]}</strong> plucked the most trees with <strong>${topCount}</strong> earning [[/award 5xp]]</p>`;
    }

    sortedGiantCount.forEach(([giant, count]) => {
        if (count !== topCount) {
            messageContent += `<p>${giant} plucked <strong>${count}</strong> trees</p>`;
        }
    });

    messageContent += `
      </article>
      </div>
  </div>`;

    await ChatMessage.create({
        content: messageContent,
        speaker: { token: "qt37GzPtkrZt7fvy", actor: "hxHroWAlPrv9yECt", scene: "qqBD4pLWlW1XYqgv", alias: "Paul Bunyon" }
    });
})
