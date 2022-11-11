//import { LiteGraph } from "litegraph.js/build/litegraph";
const JavaDataTypes = require("../nodes/JavaDataTypes");
const JavaObjectMethods = require("../nodes/JavaObjectMethods");
const constants = require("../../assets/data/constants");
let BLOCKS = constants.BLOCKS;
let LiteGraph = {};

module.exports.RegisterNodes = function(lg) {
  LiteGraph = lg;

  // Unregister defaults
  lg.clearRegisteredTypes()
  
  lg.registerNodeType("variable/String", String);
  lg.registerNodeType("variable/Integer", Integer);
  lg.registerNodeType("variable/Float", Float);
  lg.registerNodeType("variable/Boolean", Boolean);
  lg.registerNodeType("variable/Block", Block);
  lg.registerNodeType("variable/DoubleToString", DoubleToString);
  lg.registerNodeType("variable/IntegerToString", IntegerToString);
  lg.registerNodeType("variable/BooleanToString", BooleanToString);
  lg.registerNodeType("math/Arithmetic", Arithmetic);
  lg.registerNodeType("logic/Conditional", Conditional);
  lg.registerNodeType("logic/Comparison", Comparison);
  lg.registerNodeType("logic/ForLoop", ForLoop);
  lg.registerNodeType("item/hurtEnemy", hurtEnemy);
  lg.registerNodeType("item/useOn", useOn);
  lg.registerNodeType("item/onDroppedByPlayer", onDroppedByPlayer);
  lg.registerNodeType("item/onCraftedBy", onCraftedBy);
  lg.registerNodeType("object/GetObjectProperty", GetObjectProperty);
  lg.registerNodeType("object/CallObjectMethod", CallObjectMethod);
  lg.registerNodeType("block/BlockPos", BlockPos);
  //lg.registerNodeType("block/destroy", destroy);
  //lg.registerNodeType("block/playerDestroy", playerDestroy);
  lg.registerNodeType("block/onDestroyedByPlayer", onDestroyedByPlayer);
  lg.registerNodeType("block/stepOn", stepOn);
  lg.registerNodeType("chat/WriteChatMessage", WriteChatMessage);
  lg.registerNodeType("entity/GetPosition", GetPosition);
  lg.registerNodeType("level/GetBlockAtPosition", GetBlockAtPosition);
  lg.registerNodeType("level/PlaceBlockAtPosition", PlaceBlockAtPosition);
  lg.registerNodeType("level/ExplodeAtPosition", ExplodeAtPosition);
};

function onDestroyedByPlayer() {
  this.isEvent = true;
  this.addOutput("connector", LiteGraph.EVENT); 
  this.addOutput("state <BlockState>", "blockstate");
  this.addOutput("level <Level>", "level");
  this.addOutput("pos <BlockPos>", "blockpos");
  this.addOutput("player <Player>", "player");
  this.addOutput("willHarvest <Boolean>", "boolean");
}
onDestroyedByPlayer.prototype.onExecute = function()
{
  this.setOutputData(1, "state");
  this.setOutputData(2, "level");
  this.setOutputData(3, "pos");
  this.setOutputData(4, "player");
  this.setOutputData(5, "willHarvest");
}
onDestroyedByPlayer.title = "onDestroyedByPlayer";
onDestroyedByPlayer.filter = "event";  // This allows the graph to not show this as an option

function stepOn() {
  this.isEvent = true;
  this.addOutput("connector", LiteGraph.EVENT); 
  this.addOutput("level <Level>", "Level");
  this.addOutput("pos <BlockPos>", "BlockPos");
  this.addOutput("state <BlockState>", "BlockState");
  this.addOutput("entity <Entity>", "Entity");
}
stepOn.prototype.onExecute = function()
{
  this.setOutputData(1, "level");
  this.setOutputData(2, "pos");
  this.setOutputData(3, "state");
  this.setOutputData(4, "entity");
}
stepOn.title = "stepOn";
stepOn.filter = "event";

//#region hurtEnemy
function hurtEnemy() {
  this.isEvent = true;
  this.addOutput("connector", LiteGraph.EVENT); 
  this.addOutput("pItem <Item>", "Item");
  this.addOutput("pTarget <Entity>", "Entity");
  this.addOutput("pAttacker <Entity>", "Entity");
}
hurtEnemy.prototype.onExecute = function()
{
  this.setOutputData(1, "pItem");
  this.setOutputData(2, "pTarget");
  this.setOutputData(3, "pAttacker");
}
hurtEnemy.title = "hurtEnemy";
hurtEnemy.filter = "event";

function useOn() {
  this.isEvent = true;
  this.addOutput("connector", LiteGraph.EVENT); 
  this.addOutput("x <Integer>", "Integer");
  this.addOutput("y <Integer>", "Integer");
  this.addOutput("z <Integer>", "Integer");
  this.addOutput("player <Entity>", "Entity");
  this.addOutput("level <Level>", "Level");
  this.addOutput("pos <BlockPos>", "BlockPos");
  this.addOutput("block <Block>", "Block");
}
useOn.prototype.onExecute = function()
{
  this.setOutputData(1, "x");
  this.setOutputData(2, "y");
  this.setOutputData(3, "z");
  this.setOutputData(4, "player");
  this.setOutputData(5, "level");
  this.setOutputData(6, "pos");
  this.setOutputData(7, "block");
}
useOn.title = "useOn";
useOn.filter = "event";
//#endregion

//#region onDroppedByPlayer
function onDroppedByPlayer() {
  this.isEvent = true;
  this.addOutput("connector", LiteGraph.EVENT);
  this.addOutput("item <ItemStack>", "Item");
  this.addOutput("player <Entity>", "Entity");
}
onDroppedByPlayer.prototype.onExecute = function()
{
  this.setOutputData(1, "item");
  this.setOutputData(2, "player");
}
onDroppedByPlayer.title = "onDroppedByPlayer";
onDroppedByPlayer.filter = "event";
//#endregion

//#region onCraftedBy
function onCraftedBy() {
  this.isEvent = true;
  this.addOutput("connector", LiteGraph.EVENT);
  this.addOutput("item <ItemStack>", "Item");
  this.addOutput("player <Entity>", "Entity");
  this.addOutput("level <Level>", "Level");
}
onCraftedBy.prototype.onExecute = function()
{
  this.setOutputData(1, "item");
  this.setOutputData(2, "player");
  this.setOutputData(3, "level");
}
onCraftedBy.title = "onCraftedBy";
onCraftedBy.filter = "event";
//#endregion

//#region destroy
function destroy() {
  this.addOutput("pLevel <LevelAccessor>", "LevelAccessor");
  this.addOutput("pPos <BlockPos>", "BlockPos");
  this.addOutput("pState <BlockState>", "BlockState");
}
destroy.title = "destroy";
//#endregion

//#region destroy
function playerDestroy() {
  this.addOutput("pLevel <LevelAccessor>", "LevelAccessor");
  this.addOutput("pPlayer <Player>", "Player");
  this.addOutput("pPos <BlockPos>", "BlockPos");
  this.addOutput("pState <BlockState>", "BlockState");
  this.addOutput("pBlockEntity <BlockEntity>", "BlockEntity");
  this.addOutput("pTool <ItemStack>", "ItemStack");
}
playerDestroy.title = "playerDestroy";
//#endregion

//#region GetObjectProperty
function GetObjectProperty()
{
  this.addOutput("value","any");
  this.addInput("object");
  this.properties = {
    names: [""],
    types: [],
    type: null,
    oldname: "",
    name: "",
  };
  this.comboWidget = this.addWidget("combo","Property", "", { property: "name", values: this.properties.names });
  this.serialize_widgets = true;
}
GetObjectProperty.title = "Get Object Property";
GetObjectProperty.prototype.onConnectInput = function(target_slot, output_type, output, source_node, slot)
{
  console.log("connected " + output_type)
  this.properties.names = [];
  this.properties.types = [];
  this.properties.type = output_type;
  for (const property of JavaDataTypes.Types[output_type].properties) {
    this.properties.names.push(property.name);
    this.properties.types.push(property.type);
  }
  this.comboWidget.options.values = this.properties.names;
  this.comboWidget.value = this.properties.names[0];
  this.outputs[0].name = this.properties.names[0] + " <" + this.properties.types[0] + ">";
  this.outputs[0].type = this.properties.types[0];
  console.log(this.properties)
}
GetObjectProperty.prototype.onPropertyChanged = function(name, value) {
  if (name === "name" && typeof(value) === "string" && value.trim() !== "") {
    if (value !== this.properties.oldname) {
      let output_type = JavaDataTypes.Types[this.properties.type].properties.find(t => t.name === value);
      this.outputs[0].name = value + " <" + output_type.type + ">";
      this.outputs[0].type = output_type.type;
    }
  }
  this.properties.oldname = this.properties.name;
  console.log(this.properties)
}
GetObjectProperty.prototype.onExecute = function() {
  console.log(this.widgets[0].value)
  let inputObject = this.getInputData(0);
  let propertyName = this.widgets[0].value;//this.properties.name;
  let outputCode = `${inputObject}.${propertyName}`
  this.setOutputData(0, outputCode)
}
GetObjectProperty.prototype.onConfigure = function(o) {
  this.comboWidget.options.values = this.properties.names;
}
//#endregion

//#region CallObjectMethod
function CallObjectMethod()
{
  this.addOutput("connector", LiteGraph.EVENT); 
  this.addOutput("value","any");
  this.addInput("connector", LiteGraph.ACTION); 
  this.addInput("object");
  this.properties = {
    oldname: "",
    names: [""],
    types: [],
    type: null,
    maps: {},
    name: ""
  };
  this.comboWidget = this.addWidget("combo","Method", "", { property: "name", values: this.properties.names });
}
CallObjectMethod.title = "Call Object Method";
CallObjectMethod.prototype.onConnectInput = function(target_slot, output_type, output, source_node, slot)
{
  // If this is the object input slot
  if (target_slot === 1) {
    console.log(output_type)
    this.properties.names = [];
    this.properties.types = [];
    this.properties.type = output_type;
    for (const method of JavaObjectMethods.Methods[output_type].methods) {
      this.properties.names.push(method.name);
      this.properties.types.push(method.type);
      this.properties.maps[method.name] = {type: method.type, arguments: method.arguments};
    }
    this.comboWidget.options.values = this.properties.names;
    this.comboWidget.value = this.properties.names[0];
    this.outputs[1].name = this.properties.names[0] + " <" + this.properties.types[0] + ">";
    this.outputs[1].type = this.properties.types[0];
    console.log(this.properties.maps[this.properties.names[0]])
    for (let i = 2; i < this.inputs.length; i++) {
      this.removeInput(i);
    }
    for (const arg of this.properties.maps[this.properties.names[0]].arguments) {
      this.addInput(arg.name, arg.type);
    }
  }
  
}
CallObjectMethod.prototype.onPropertyChanged = function(name, value) {
  if (name === "name" && typeof(value) === "string" && value.trim() !== "") {
    if (value !== this.properties.oldname) {
      let output_type = this.properties.maps[value].type;
      this.outputs[1].name = value + " <" + output_type + ">";
      this.outputs[1].type = output_type;
      for (let i = 2; i < this.inputs.length; i++) {
        this.removeInput(i);
      }
      for (const arg of this.properties.maps[value].arguments) {
        this.addInput(arg.name, arg.type);
      }
    }
    this.properties.oldname = this.properties.name;
  }
}
CallObjectMethod.prototype.onConfigure = function(o) {
  this.comboWidget.options.values = this.properties.names;
}
CallObjectMethod.prototype.onExecute = function() {
  let object = this.getInputData(1);
  //let int = this.getInputData(2);
  let argumentsToPass = [];
  for (let i = 0; i < this.properties.maps[this.properties.name].arguments.length; i++) {
    argumentsToPass.push(this.getInputData(i+2));
  }
  let args = argumentsToPass.join(",")
  let outputVar = this.properties.type + this.id;
  console.log(object)
  let outputVariableType = this.properties.maps[this.properties.name].type;
  let outputCode = `${outputVariableType} ${outputVar}${this.id} = ${object}.${this.properties.name}(${args});`;
  this.outputCode = outputCode;
  this.setOutputData(1, `${outputVar}${this.id}`)
}
//#endregion

//#region WriteChatMessage
function WriteChatMessage() {
  this.addInput("connector", LiteGraph.ACTION); 
  this.addInput("message <String>", "string");
  this.addInput("player <Player>", "entity,player,livingentity");
  this.addOutput("connector", LiteGraph.EVENT); 
}
WriteChatMessage.prototype.onExecute = function()
{
  let message = this.getInputData(1);
  let player = this.getInputData(2);
  if (message) {
    let outputCode = `${player}.sendMessage(new net.minecraft.network.chat.TextComponent(${message}), null);`;
    console.log(this.parentNodeId)
    // let outputCodeObject = {};
    // outputCodeObject[this.id] = outputCode;
    // this.graph.outputCodeDict[this.parentNodeId][this.id] = outputCode;
    this.outputCode = outputCode;
  }
}
WriteChatMessage.title = "Write Client Chat Message";
//#endregion

//#region GetPosition
function GetPosition() {
  this.addInput("connector", LiteGraph.ACTION); 
  this.addInput("entity <Entity>", "entity,player,livingentity");
  this.addOutput("connector", LiteGraph.EVENT); 
  this.addOutput("x <Double>", "double");
  this.addOutput("y <Double>", "double");
  this.addOutput("z <Double>", "double");
}
GetPosition.prototype.onExecute = function()
{
  let entity = this.getInputInfo(1);
  if (entity) {
    let entityName = this.getInputData(1);

    let x = "x" + this.id;
    let y = "y" + this.id;
    let z = "z" + this.id;
    let pos = "pos" + this.id;

    let outputCode = `Vec3 ${pos} = ${entityName}.getPosition(0); Double ${x} = ${pos}.x; Double ${y} = ${pos}.y; Double ${z} = ${pos}.z;`;
    console.log(outputCode);
    this.outputCode = outputCode;
    this.setOutputData(1, x);
    this.setOutputData(2, y);
    this.setOutputData(3, z);

    this.graph.javaImports.push("net.minecraft.world.phys.Vec3");
  }
}
GetPosition.title = "Get position"
//#endregion

//#region level


//#endregion

//#region variable
function Boolean() {
  this.properties = {
    boolean: true
  }
  this.serialize_widgets = true;
  this.addOutput("boolean <Boolean>", "boolean");
  this.addWidget(
    "toggle", 
    "Boolean", 
    this.properties.boolean,
    { property: 'boolean' }
  );
}
Boolean.title = "Boolean variable"
Boolean.prototype.onExecute = function() {
  this.setOutputData(0, `${this.properties.boolean}`);
}

function Float() {
  this.properties = {
    float: 1
  }
  this.serialize_widgets = true;
  this.addOutput("float <Float>", "float");
  this.addWidget(
    "number", 
    "Float", 
    this.properties.float,
    { property: 'float' }
  );
}
Float.title = "Float variable"
Float.prototype.onExecute = function() {
  this.setOutputData(0, `${this.properties.float}F`);
}

function Integer() {
  this.properties = {
    integer: 1
  }
  this.serialize_widgets = true;
  this.addOutput("integer <Integer>", "integer");
  this.addWidget(
    "number", 
    "Integer", 
    this.properties.integer,
    function (value, widget, node) {
      node.properties.integer = parseInt(value);
      node.widgets[0].value = parseInt(value);
    },
    { min: 0, max: Infinity, step: 10 }
  );
}
Integer.prototype.onExecute = function() {
  this.setOutputData(0, `${this.properties.integer}`);
}
Integer.title = "Integer variable"

function String() {
  this.properties = {
    value: ""
  };
  this.serialize_widgets = true
  this.addOutput("string <String>", "string");
  this.widget = this.addWidget("text","value","","value");
}
String.prototype.onExecute = function()
{
  let outputCode = "String str" + this.id + " = \"" + this.properties.value + "\";";
  this.setOutputData(0, `"${this.properties.value}"`);
}
String.title = "String Variable";

function Block() {
  this.properties = {
    value: ""
  };
  this.serialize_widgets = true
  this.addOutput("block <Block>", "Block");
  this.addWidget("combo","Combo", "", { property: "value", values: BLOCKS } );
}
Block.prototype.onExecute = function()
{
  let outputCode = "net.minecraft.world.level.block.Blocks." + this.properties.value;
  this.setOutputData(0, outputCode);
}
Block.title = "Block Variable";

function DoubleToString() {
  this.addInput("double <Double>", "double");
  this.addOutput("string <String>", "string");
}
DoubleToString.prototype.onExecute = function() {
  let double = this.getInputData(0);
  let outputCode = `Double.toString(${double})`;
  this.setOutputData(0, outputCode);
}
DoubleToString.title = "Double to String";

function IntegerToString() {
  this.addInput("integer <Integer>", "Integer");
  this.addOutput("string <String>", "String");
}
IntegerToString.prototype.onExecute = function() {
  let Integer = this.getInputData(0);
  let outputCode = `Integer.toString(${Integer})`;
  this.setOutputData(0, outputCode);
}
IntegerToString.title = "Integer to String";

function BooleanToString() {
  this.addInput("boolean <Boolean>", "Boolean");
  this.addOutput("string <String>", "String");
}
BooleanToString.prototype.onExecute = function() {
  let boolean = this.getInputData(0);
  let outputCode = `Boolean.toString(${boolean})`;
  this.setOutputData(0, outputCode);
}
BooleanToString.title = "Boolean to String";
//#endregion

function BlockPos() {
  this.addInput("x <Integer>", "Integer");
  this.addInput("y <Integer>", "Integer");
  this.addInput("z <Integer>", "Integer");
  this.addOutput("pos <BlockPos>", "BlockPos");
}
BlockPos.prototype.onExecute = function() {
  let x = this.getInputData(0);
  let y = this.getInputData(1);
  let z = this.getInputData(2);
  let outputCode = `new net.minecraft.core.BlockPos(${x}, ${y}, ${z})`;
  this.setOutputData(0, outputCode);
}
BlockPos.title = "BlockPos";

//#region block
function GetBlockAtPosition() {
  this.addInput("connector", LiteGraph.ACTION); 
  this.addInput("level <Level>", "Level");
  this.addInput("pos <BlockPos>", "BlockPos");
  this.addOutput("connector", LiteGraph.EVENT); 
  this.addOutput("block <Block>", "Block");
}
GetBlockAtPosition.prototype.onExecute = function() {
  let level = this.getInputData(1);
  let pos = this.getInputData(2);
  let outputCode = `${level}.getBlockState(${pos}).getBlock()`;
  this.setOutputData(1, outputCode);
}
GetBlockAtPosition.title = "Get Block at Position";

function PlaceBlockAtPosition() {
  this.addInput("connector", LiteGraph.ACTION); 
  this.addInput("level <Level>", "Level");
  this.addInput("pos <BlockPos>", "BlockPos");
  this.addInput("block <Block>", "Block");
  this.addOutput("connector", LiteGraph.EVENT); 
}
PlaceBlockAtPosition.prototype.onExecute = function() {
  let level = this.getInputData(1);
  let pos = this.getInputData(2);
  let block = this.getInputData(3);
  let outputCode = `${level}.setBlock(${pos}, ${block}.defaultBlockState(), 1);`;
  this.outputCode = outputCode;
}
PlaceBlockAtPosition.title = "Place Block at Position";

function ExplodeAtPosition() {
  this.addInput("connector", LiteGraph.ACTION); 
  this.addInput("level <Level>", "Level");
  this.addInput("x <Double>", "Double,Integer");
  this.addInput("y <Double>", "Double,Integer");
  this.addInput("z <Double>", "Double,Integer");
  this.addInput("radius <Float>", "Float,Integer");
  this.addOutput("connector", LiteGraph.EVENT); 
}
ExplodeAtPosition.prototype.onExecute = function() {
  let level = this.getInputData(1);
  let x = this.getInputData(2);
  let y = this.getInputData(3);
  let z = this.getInputData(4);
  let radius = this.getInputData(5);
  let outputCode = `${level}.explode(null, ${x}, ${y}, ${z}, ${radius}, net.minecraft.world.level.Explosion.BlockInteraction.BREAK);`;
  this.outputCode = outputCode;
}
ExplodeAtPosition.title = "Explode at Position";
//#endregion

function Conditional() {
  this.addInput("A");
  this.addInput("B");
  this.addOutput("A == B", "Boolean");
}
Conditional.title = "Conditional"
Conditional.prototype.onExecute = function() {
  let a = this.getInputData(0);
  let b = this.getInputData(1);
  let outputCode = `(${a} == ${b})`;
  this.setOutputData(0, outputCode);
}


function Comparison() {
  this.properties = {
    operators: [
      "==",
      ">",
      "<",
      ">=",
      "<="
    ],
    operator: "=="
  };
  this.addInput("connector", LiteGraph.ACTION);
  this.addInput("A");
  this.addInput("B");
  this.addOutput("True", LiteGraph.EVENT);
  this.addOutput("False", LiteGraph.EVENT);
  this.comboWidget = this.addWidget("combo","Operator", "", { property: "operator", values: this.properties.operators });
  this.serialize_widgets = true;
}
Comparison.title = "Comparison"
Comparison.prototype.onExecute = function() {
  let a = this.getInputData(1);
  let b = this.getInputData(2);

  let outputCode = `(${a} ${this.widgets[0].value} ${b})`;
  this.outputCode = outputCode;
}

function ForLoop() {
  this.addInput("connector", LiteGraph.ACTION);
  this.addInput("First index <Integer>", "integer");
  this.addInput("Last index <Integer>", "integer");
  this.addOutput("Loop body", LiteGraph.EVENT);
  this.addOutput("Loop index <Integer>", "Integer");
  this.addOutput("Loop finished", LiteGraph.EVENT);
  this.serialize_widgets = true;
}
ForLoop.prototype.onExecute = function() {
  let firstIndex = this.getInputData(1);
  let secondIndex = this.getInputData(2);

  let outputCode = `int i = ${firstIndex}; i <= ${secondIndex}; i++`;
  this.outputCode = outputCode;

  this.setOutputData(1, 'i');
}
ForLoop.title = "For Loop";

function Arithmetic() {
  this.properties = {
    operators: [
      "+",
      "-",
      "*",
      "/"
    ],
    operator: "+"
  };
  this.addInput("A");
  this.addInput("B");
  this.addOutput("result");
  this.comboWidget = this.addWidget("combo","Operator", "", { property: "operator", values: this.properties.operators });
  this.serialize_widgets = true;
}
Arithmetic.title = "Arithmetic"
Arithmetic.prototype.onExecute = function() {
  let a = this.getInputData(0);
  let b = this.getInputData(1);

  let outputCode = `(${a} ${this.widgets[0].value} ${b})`;
  this.setOutputData(0, outputCode);
}

function computeNodeDict(graph) {
  for (let node in graph._nodes) {
    console.log(node);
  }
}