<template>
  <div>
    <input
      :type="type"
      :name="name"
      :id="id"
      :checked="checked"
      @change="(e) => $emit('change', e)"
    />
    <label :for="id">
      <slot></slot>
    </label>
  </div>
</template>

<script>
import { v4 as uuid } from "uuid";

export default {
  name: "SelectedMedia",
  props: {
    name: {
      required: true,
      type: String,
    },
    type: {
      default: "radio",
    },
    id: {
      default: uuid(),
    },
    checked: {
      default: false,
    },
  },
};
</script>

<style lang="css" scoped>
div {
  position: relative;
}

input {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  clip-path: inset(50%);
  width: 1px;
  height: 1px;
}

label {
  display: block;
  border: 4px solid transparent;
  line-height: 0;
}

input:checked + label {
  border-color: #ffe57f;
}
</style>
