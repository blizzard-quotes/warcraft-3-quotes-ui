<template>
  <v-app-bar flat app>
    <router-link
      to="/blizzardquotes"
      style="color: inherit; text-decoration: inherit;"
    >
      <v-toolbar-title id="title" class="text-uppercase title">
        <span class="font-weight-light">Blizzard</span>
        <span class="font-weight-medium">Quotes</span>
      </v-toolbar-title>
    </router-link>

    <v-spacer></v-spacer>

    <v-btn
      id="button-github"
      href="https://github.com/blizzard-quotes"
      target="_blank"
      text
    >
      <span class="mr-2">GitHub Org</span>
      <v-icon>mdi-open-in-new</v-icon>
    </v-btn>
  </v-app-bar>
</template>
