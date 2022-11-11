module.exports.Types = {
    Item: {
        properties: [
          {
            name: "rarity",
            type: "Rarity"
          },
          {
            name: "maxStackSize",
            type: "int"
          },
          {
            name: "maxDamage",
            type: "int"
          },
          {
            name: "isFireResistant",
            type: "boolean"
          },
          {
            name: "craftingRemainingItem",
            type: "Item"
          }
        ]
      },
    LivingEntity: {
        properties: [
            {
                name: "swinging",
                type: "boolean"
            },
            {
                name: "discardFriction",
                type: "boolean"
            },
            {
                name: "swingingArm",
                type: "InteractionHand"
            },
        ]
    },
    Block: {
      properties: [
          {
              name: "descriptionId",
              type: "String"
          }
      ]
  },
}