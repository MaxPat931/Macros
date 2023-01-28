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
      "max": "6",
      "per": "charges",
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
    "consumableType": "potion",
    "illandril": {
      "tooltips": {
        "show": true
      }
    }
  },
  "img": "icons/magic/earth/projectiles-stone-salvo-red.webp",
  "effects": [],
  "flags": {
    "favtab": {
      "isFavorite": true
    },
    "babonus": {
      "bonuses": {
        "HbxGk1Lw2pX4V8iF": {
          "name": "Minute Meatballs",
          "description": "Chuck a Second Meteor at this fucker and add 2d6 fire damage",
          "bonuses": {
            "bonus": "2d6[fire]",
            "criticalBonusDice": "",
            "criticalBonusDamage": ""
          },
          "type": "damage",
          "itemOnly": true,
          "optional": true,
          "consume": {
            "enabled": true,
            "type": "uses",
            "scales": false,
            "value": {
              "min": 1,
              "max": 1
            }
          },
          "aura": {
            "enabled": false,
            "isTemplate": false,
            "range": null,
            "self": false,
            "disposition": 2,
            "blockers": []
          },
          "id": "HbxGk1Lw2pX4V8iF",
          "filters": {
            "itemRequirements": {
              "equipped": null,
              "attuned": null
            },
            "arbitraryComparison": [],
            "statusEffects": [],
            "targetEffects": [],
            "creatureTypes": {
              "needed": [],
              "unfit": []
            },
            "customScripts": null,
            "remainingSpellSlots": {
              "min": null,
              "max": null
            },
            "itemTypes": [],
            "attackTypes": [],
            "damageTypes": [],
            "abilities": [],
            "spellComponents": {
              "types": [],
              "match": null
            },
            "spellLevels": [],
            "spellSchools": [],
            "baseWeapons": [],
            "weaponProperties": {
              "needed": [],
              "unfit": []
            }
          },
          "enabled": true
        }
      }
    }
  }
}])
