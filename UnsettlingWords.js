///Unsettling Words
///Roll the Bardic Inspiration die (1d6). The creature must subtract the number rolled from the next saving throw it makes before the start of your next turn.
    const [target] = game.users.get("UuekFluYwLytJLyF").targets; ///replace UUID with your bard

    let bardicDie = await new Roll(`-1d8`).toMessage();
    let rollvalue = bardicDie.roll.total; ///Complains this should be rolls, but then it dont work

    let effectData = {
        label: "Unsettled",
        icon: "icons/creatures/eyes/humanoid-single-blue.webp",
        duration: { rounds: 1 },
        flags: {
            "core": {
              "statusId": ""
            },
            "dae": {
              "stackable": "none",
              "durationExpression": "",
              "macroRepeat": "none",
              "specialDuration": [
                "isSave"
              ],
              "transfer": false
            }
          },
        changes: [
            {
                "key": "system.bonuses.abilities.save",
                "mode": CONST.ACTIVE_EFFECT_MODES.ADD,
                "value": rollvalue,
                "priority": 20,
            },
            {
                "key": "flags.adv-reminder.message.ability.save.all",
                "mode": CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                "value": "<b>Unsettled</b>: Reduced saving throw by Bardic Die Roll",
                "priority": 20,
            }
        ]
    };
    await target.actor.createEmbeddedDocuments("ActiveEffect", [effectData])
