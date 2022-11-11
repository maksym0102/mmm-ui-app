<template>
  <div class="litegraph" ref="canvasContainerRef">
    <canvas
      ref="canvasElementRef"
      :width="width"
      :height="height"
      style="border: 1px solid"
    >
    </canvas>
  </div>
</template>

<script>
import { throttle } from "../helpers/throttle";
import { LGraph, LiteGraph, LGraphCanvas } from "litegraph.js";
import NodeUtilities from "../modules/nodes/NodeUtilities";

const CANVAS_ASPECT_RATIO = 0.7031;
const CANVAS_DEFAULT_WIDTH = 100;
const NODE_BG_COLOR = "#420612";
const NODE_COLOR = "#2c040c";
const NODE_DEFAULT_POS = 200;
const SPACE_BETWEEN_NODES = 50;

export default {
  name: "ElementNodes",
  props: {
    projectName: {
      type: String,
      required: true,
    },
    arrayName: {
      type: String,
      required: true,
    },
    entryName: {
      type: String,
      required: true,
    },
    defaultNodes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      width: CANVAS_DEFAULT_WIDTH,
      height: CANVAS_DEFAULT_WIDTH * CANVAS_ASPECT_RATIO,
      graph: null,
    };
  },
  methods: {
    setCanvasWidth() {
      const container = this.$refs.canvasContainerRef;
      if (!container) return;
      this.width = container.clientWidth;
      this.height = Math.round(container.clientWidth * CANVAS_ASPECT_RATIO);
    },
    handleResize() {
      this.setCanvasWidth();
    },
    async initializeLitegraph() {
      const args = {
        projectName: this.projectName,
        arrayName: this.arrayName,
        entryName: this.entryName,
      };

      const { nodes, error } = await window.ipc.invoke("database", {
        func: "getNodesArrayEntry",
        data: args,
      });

      this.graph = new LGraph();

      //this.graph.filter = "event";

      // Performs a breadth-first search on the nodes, starting with event nodes
      // assign the event (parent) node to each node, for later reference
      this.graph.getNodeDictionary = function() {
        let nodeDict = {};
        this.outputCodeDict = {};
        this.runStep(1);
        for (let node of this._nodes) {
          if (node.isEvent) {
            nodeDict[node.id] = this.getNodeDictionaryInner(node, node.id);
          }
        }
        this.nodeDict = nodeDict;
        this.javaImports = [];
      };

      this.graph.getNodeDictionaryInner = function(node, parentId, outputId) {
        let currentOutputId = (outputId === undefined) ? 0 : outputId;
        let queue = [];
        let result = [];

        if (node.id !== parentId) {
          node.parentNodeId = parentId;
        }
        
        // Check all output connections for this node
        if (node.outputs) {
            if (node.outputs[currentOutputId]) {
              if (node.outputs[currentOutputId].links)
                for (let link of node.outputs[currentOutputId].links) {
                  let outputLink = this.links[link];
                  let nextNode = this.getNodeById(outputLink.target_id);
                  if (nextNode.id !== parentId) {
                    nextNode.parentNodeId = parentId;
                  }
                  //console.log(nextNode)
                  queue.push(nextNode);
                  if (nextNode.title !== "Comparison" && nextNode.title !== "For Loop") {
                    result.push(nextNode.outputCode);
                  }
                }
            }
        }

        while (queue.length > 0) {
          let child = queue.shift();
          if (child.title === "Comparison") {
            if (child.outputs[0].links) { // this line unecessary?
              //child.trueActions.push(this.getNodeDictionaryInner(child, parentId, 0));
              let trueActions = this.getNodeDictionaryInner(child, parentId, 0);
              let trueActionsString = trueActions.join("\r\n");
              result.push(
                `if (${child.outputCode}) { ${trueActionsString} }`
              )
            }
            if (child.outputs[1].links) {
              //child.falseActions.push(this.getNodeDictionaryInner(child, parentId, 1));
              let falseActions = this.getNodeDictionaryInner(child, parentId, 1);
              let falseActionsString = falseActions.join("\r\n");
              result.push(
                `else { ${falseActionsString} }`
              )
            }
          }
          else if (child.title === "For Loop") {
            let loopBodyActions = this.getNodeDictionaryInner(child, parentId, 0);
            let loopBodyActionsString = loopBodyActions.join("\r\n");
            result.push(
                `for (${child.outputCode}) { ${loopBodyActionsString} }`
            )
            let loopDoneActions = this.getNodeDictionaryInner(child, parentId, 2);
            let loopDoneActionsString = loopDoneActions.join("\r\n");
            result.push(loopDoneActionsString);
          }
          else {
            if (child.outputs) {
              if (child.outputs[0]) {
                if (child.outputs[0].links)
                  for (let link of child.outputs[0].links) {
                    let outputLink = this.links[link];
                    let nextNode = this.getNodeById(outputLink.target_id);
                    if (nextNode.id !== parentId) {
                      nextNode.parentNodeId = parentId;
                    }
                    queue.push(nextNode);
                    if (nextNode.title !== "Comparison" && nextNode.title !== "For Loop") {
                      result.push(nextNode.outputCode);
                    }
                  }
              }
            }
          }
        }
        console.log(result)
        return result;
      }

      // Serialize the node dict into a usable format for the templator
      this.graph.serializeNodeDictionary = function() {
        let serialized = {};
        for (const [key, value] of Object.entries(this.nodeDict)) {
          serialized[this.getNodeById(key).title] = value.join("\r\n");
        }
        return serialized;
      };

      NodeUtilities.RegisterNodes(LiteGraph);

      if (nodes && JSON.stringify(nodes) !== "{}") {
        this.graph.configure(JSON.parse(nodes));
      } else {
        this.defaultNodes.forEach((nodeKey, index) => {
          const node = LiteGraph.createNode(nodeKey);
          node.bgcolor = NODE_BG_COLOR;
          node.color = NODE_COLOR;
          node.pos = [
            NODE_DEFAULT_POS,
            NODE_DEFAULT_POS * index + SPACE_BETWEEN_NODES,
          ];
          this.graph.add(node);
        });
      }

      new LGraphCanvas(this.$refs.canvasElementRef, this.graph);

      this.$emit("ready", this.graph);
    },
  },
  async mounted() {
    this.handleResize = throttle(this.handleResize.bind(this));

    window.addEventListener("resize", this.handleResize);

    await this.$nextTick();

    this.setCanvasWidth();

    this.initializeLitegraph();
  },
  beforeDestroy() {
    this.graph.stop();
    this.graph = null;
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>
