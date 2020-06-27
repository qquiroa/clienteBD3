<template>
  <q-page class="flex flex-center">
    <q-card flat bordered class="my-card">
      <q-card-section>
        <div class="text-h6">Iniciar Sesión</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input filled v-model="user" label="Usuario" />

          <q-input filled v-model="pwd" type="password" label="Contraseña" />

          <div>
            <center>
              <q-btn label="Aceptar" :loading="loading" type="submit" color="primary" />
            </center>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      user: "",
      pwd: "",
      loading: false
    };
  },
  methods: {
    onSubmit() {
      this.loading = true;
      this.$axios
        .post(this.policiaURL + "/Login", { user: this.user, pwd: this.pwd })
        .then(response => {
          if (response.data["message"] == "OK") {
            sessionStorage.tokenPolicia = response.data["token"];
            //LOGIN INTO BANK
            this.$axios
              .post(this.bancoURL + "/Login", {
                user: this.user,
                pwd: this.pwd
              })
              .then(response1 => {
                if (response1.data["message"] == "OK") {
                  sessionStorage.tokenBanco = response1.data["token"];
                  this.$router.push("/");
                } else {
                  sessionStorage.clear();
                  alert("DATOS INVALIDOS");
                }
              })
              .catch(e => {});
          } else {
            alert("DATOS INVALIDOS");
          }
          this.loading = false;
        })
        .catch(e => {});
    }
  },
  computed: {
    policiaURL() {
      return this.$store.getters.policiaURL;
    },
    bancoURL() {
      return this.$store.getters.bancoURL;
    }
  }
};
</script>