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
  if (game.combat.combatant.actorId != "ZR4RfvS5QX8hivBV") return;
  const item = await fromUuid("Scene.qqBD4pLWlW1XYqgv.Token.66uwMAsN3hWayjeX.Actor.ZR4RfvS5QX8hivBV.Item.JB4apst2Q4lFMOFK");
  await item.use({}, {rollMode: CONST.DICE_ROLL_MODES.PRIVATE});
});

//Guard Reinforcements
Hooks.on("updateCombat", async (combat, updates) => {
  if (game.combat.combatant.actorId != "ZU6CkvHO7Zlm4YkS") return;
  const item = await fromUuid("Actor.hxHroWAlPrv9yECt.Item.iR58gsCKJWuhBXvw");
  await item.use({}, {rollMode: CONST.DICE_ROLL_MODES.PRIVATE});
});
