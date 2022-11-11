<template>
  <div>
    <v-subheader class="pl-0 justify-space-between">
      <span>{{ label }}</span>
      <slot name="tooltip-component"></slot>
    </v-subheader>

    <v-slider
      v-bind="$attrs"
      v-on:input="$emit('input', $event)"
      class="align-center"
      :min="min"
      color="accent"
      hide-details
      :step="step"
      :max="max"
      dense
    >
      <template v-slot:append>
        <v-text-field
          v-on:input="$emit('input', $event)"
          v-bind="$attrs"
          class="mt-0 pt-0"
          hide-details
          single-line
          type="number"
          style="width: 60px"
          :min="min"
          :max="max"
          :step="step"
          color="accent"
          dense
        ></v-text-field>
      </template>
    </v-slider>
  </div>
</template>

<script>
export default {
  name: "Slider",
  props: ["sliderValue", "label", "step", "max", "min"],
  data: () => ({})
};
</script>
