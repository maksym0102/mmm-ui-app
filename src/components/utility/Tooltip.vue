<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-icon v-on="on" color="accent" small>
        mdi-help
      </v-icon>
    </template>
    <span>{{ text }}</span>
  </v-tooltip>
</template>

<script>
  export default {
    name: 'Tooltip',
    props: ['text']
  }
</script>
