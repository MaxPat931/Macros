///When a new Round begins, send a message to chat for new initiative rolls
///Display subsequent dialogs to set the new initiative order, should also return to first turn but thats a little iffy for some reason

Hooks.on("updateCombat", async (combat, changes) => {
  if (!foundry.utils.hasProperty(changes, "round")) return;

  ChatMessage.create({
    content: `Top of the round! <p><strong>[[/check dex]]{Roll for Initiative!}</strong></p>`,
    })

  const createGiantInitiativeDialog = async (title, initiative) => {
    const buttons = {
      one: {
        label: "Bonecrusher <img style='border: none;' src='worlds/feefifofum/assets/HillGiant.png'>",
        callback: () => updateGiantInitiative("Bonecrusher", initiative),
      },
      two: {
        label: "Ulf the Quick <img style='border: none;' src='modules/flee-mortals/tokens/FrostGiantWindSprinter.png'>",
        callback: () => updateGiantInitiative("Ulf the Quick", initiative),
      },
      three: {
        label: "Revna the Blue <img style='border: none;' src='worlds/feefifofum/assets/FrostGiantStormHurler.png'>",
        callback: () => updateGiantInitiative("Revna the Blue", initiative),
      },
      four: {
        label: "Lapis Tenebra <img style='border: none;' src='worlds/feefifofum/assets/ObsidianGiant.webp'>",
        callback: () => updateGiantInitiative("Lapis Tenebra", initiative),
      },
    };

    await Dialog.wait({
      title,
      buttons,
    });
  };

  const updateGiantInitiative = async (giantName, initiative) => {
    const giant = game.combat.combatants.getName(giantName);
    if (giant) {
      await giant.update({ initiative });
    }
  };

  // Create dialogs with different initiatives
  await createGiantInitiativeDialog("Giant Initiative 1", 8);
  await createGiantInitiativeDialog("Giant Initiative 2", 6);
  await createGiantInitiativeDialog("Giant Initiative 3", 4);
  await createGiantInitiativeDialog("Giant Initiative 4", 2);

  await game.combat.update({ turn: 0 });
});

//Empowered Patron reminder
Hooks.on("updateCombat", async (combat, updates) => {
  if (game.combat.combatant.name != "Kalis Karr") return;
  const wizard = game.actors.getName("Kalis Karr")
  const patron = wizard.items.getName("Empowered Patron");
  await patron.use({legacy: false}, {rollMode: CONST.DICE_ROLL_MODES.PRIVATE});
});

//Guard Reinforcements
Hooks.on("updateCombat", async (combat, updates) => {
  if (game.combat.combatant.name != "Human Guard") return;
  const guard = game.actors.getName("Human Guard")
  const reinforce = guard.items.getName("Reinforcements");
  await reinforce.use({legacy: false}, {rollMode: CONST.DICE_ROLL_MODES.PRIVATE});
});

//Change EXP levels for Point tracking
Hooks.once("init", () => {
     CONFIG.DND5E.CHARACTER_EXP_LEVELS = [0,0,0,0,0,70,0,0,70,0,0,0,0,0,0,0,0,0,0,0]
});

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
  if (updates.system.attributes?.hp?.value > 0) return;

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
});

// Swap Tree Actor summons with Tiles
Hooks.on("dnd5e.postSummon", (activity, _, spawn) => {
  if (activity.item.name == "Pluck a Tree") {
      const tree = [];
      tree.push(spawn[0]._id);
      TileDocument.create({
          x: spawn[0].x,
          y: spawn[0].y,
          width: 100,
          height: 100,
          "texture.src": spawn[0].texture.src
      }, { parent: canvas.scene });

      canvas.scene.deleteEmbeddedDocuments("Token", tree);
  }
})
