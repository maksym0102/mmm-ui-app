<template>
<v-sheet outlined color="accent" rounded>
<v-card
    outlined
    color="componentmain"
    rounded
    class="text-left"
>
    <v-card-title class="text-h6">
              Tip:
    </v-card-title>
    <v-card-text>
        {{ displayedTip }}
    </v-card-text>
</v-card>
</v-sheet>
</template>

<script>
  export default {
    name: 'TipCard',
    props: ['text'],
    data: () => ({
     tips: [
         "Use the filter in the lefthand menu to quickly find mod elements in the list.",
         "Join our Discord server here: https://discord.gg/eUeXB6SGCC. You can chat with other mod makers, ask for help with the app, or just hang out.",
         "You can use the settings menu at the top left to toggle between light and dark mode."
     ]
    }),
    computed: {
        displayedTip: function() {
            if (this.text) {
                return this.text;
            }
            else {
                let random = Math.floor(Math.random() * this.tips.length);
                return this.tips[random];
            }
        }
    }
  }
</script>
