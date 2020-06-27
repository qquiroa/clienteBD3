<template>
  <q-layout view="lHh Lpr lFf" :key="this.token">
    <div v-if="this.token">
      <q-header elevated>
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />

          <q-toolbar-title>Partidas de Nacimiento</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
        <q-list>
          <q-item-label header class="text-grey-8">Menú</q-item-label>
          <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        </q-list>
      </q-drawer>
    </div>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink";

export default {
  name: "MainLayout",

  components: {
    EssentialLink
  },

  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: "Inicio",
          caption: "Página de Inicio",
          icon: "home",
          link: "/"
        }
      ]
    };
  },
  computed: {
    token(){
      var token = sessionStorage.tokenPolicia ? true : false
      return token 
    }
  }
};
</script>
