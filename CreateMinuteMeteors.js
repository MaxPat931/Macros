await actor.createEmbeddedDocuments("Item",
[{
    "name": "Minute Meteors",
    "type": "consumable",
    "system": {
      "description": {
        "value": "<p>Pelt a rock at someones head</p>",
        "chat": "",
        "unidentified": ""
      },
      "source": "",
      "quantity": 1,
      "weight": 0,
      "price": 0,
      "attunement": 0,
      "equipped": true,
      "rarity": "",
      "identified": true,
      "activation": {
        "type": "bonus",
        "cost": 1,
        "condition": ""
      },
      "duration": {
        "value": null,
        "units": ""
      },
      "target": {
        "value": 5,
        "width": null,
        "units": "ft",
        "type": "sphere"
      },
      "range": {
        "value": 120,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": 6,
        "max": 6,
        "per": "sr",
        "recovery": "",
        "autoDestroy": true
      },
      "consume": {
        "type": "",
        "target": "",
        "amount": null
      },
      "ability": "",
      "actionType": "save",
      "attackBonus": "0",
      "chatFlavor": "",
      "critical": {
        "threshold": null,
        "damage": ""
      },
      "damage": {
        "parts": [
          [
            "2d6",
            "fire"
          ]
        ],
        "versatile": ""
      },
      "formula": "",
      "save": {
        "ability": "dex",
        "dc": null,
        "scaling": "spell"
      },
      "consumableType": "ammo",
        "illandril": {
          "tooltips": {
            "show": true
          }
        }
    },
    "img": "icons/magic/earth/projectiles-stone-salvo-red.webp",
    "effects": [
      {
        "label": "Minute Meteors",
        "icon": "icons/magic/earth/projectiles-stone-salvo-red.webp",
        "origin": "Actor.iQCx82X6qJ0UyPiC.Item.iCiPodTZfLmhCBCa",
        "duration": {
          "startTime": null,
          "seconds": null,
          "combat": null,
          "rounds": null,
          "turns": null,
          "startRound": null,
          "startTurn": null
        },
        "disabled": false,
        "_id": "bpzvwUmRJcmVg0Dv",
        "changes": [
          {
            "key": "flags.adv-reminder.message.damage.all",
            "mode": 0,
            "value": "<b>Minute Meteors</b> - Chuck a @Macro[Second Meteor] at this fucker and add [[/r 2d6[fire]]]",
            "priority": 20
          }
        ],
        "tint": null,
        "transfer": true,
        "flags": {
          "dae": {
            "selfTarget": false,
            "selfTargetAlways": false,
            "stackable": "none",
            "durationExpression": "",
            "macroRepeat": "none",
            "specialDuration": []
          },
          "core": {
            "statusId": "y"
          }
        }
}],
"flags": {
    "favtab": {
      "isFavorite": true
    }
  }
}])
