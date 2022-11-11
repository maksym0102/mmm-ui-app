module.exports.Methods = {
    BlockPos: {
        methods: [
            {
                "name": "above",
                "type": "BlockPos",
                "arguments": [
                    {
                        "name": "pDistance",
                        "type": "integer"
                    }
                ]
            },
            {
                "name": "below",
                "type": "BlockPos",
                "arguments": [
                    {
                        "name": "pDistance",
                        "type": "integer"
                    }
                ]
            },
            {
                "name": "north",
                "type": "BlockPos",
                "arguments": [
                    {
                        "name": "pDistance",
                        "type": "integer"
                    }
                ]
            },
            {
                "name": "south",
                "type": "BlockPos",
                "arguments": [
                    {
                        "name": "pDistance",
                        "type": "integer"
                    }
                ]
            },
            {
                "name": "west",
                "type": "BlockPos",
                "arguments": [
                    {
                        "name": "pDistance",
                        "type": "integer"
                    }
                ]
            },
            {
                "name": "east",
                "type": "BlockPos",
                "arguments": [
                    {
                        "name": "pDistance",
                        "type": "integer"
                    }
                ]
            },
            {
                "name": "getX",
                "type": "Integer",
                "arguments": []
            },
            {
                "name": "getY",
                "type": "Integer",
                "arguments": []
            },
            {
                "name": "getZ",
                "type": "Integer",
                "arguments": []
            },
        ]
      },
      useoncontext: {
          methods: [
            {
                "name": "getPlayer",
                "type": "Player",
                "arguments": []
            },
            {
                "name": "getClickedPos",
                "type": "BlockPos",
                "arguments": []
            },
          ]
      },
      Block: {
        methods: [
          {
              "name": "getDescriptionId",
              "type": "String",
              "arguments": []
          }
        ]
    }
}