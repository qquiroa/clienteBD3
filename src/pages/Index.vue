<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">DATOS DEL SOLICITANTE</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="SendData">
            <q-input
              v-model="cui"
              label="CUI"
              mask="#### ##### ####"
              unmasked-value
              style=" width: 400px;"
            />
            <br />
            <q-separator />
            <br />
            <center>
              <q-btn type="submit" color="primary">Verificar</q-btn>
            </center>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
export default {
  data() {
    return {
      cui: ""
    };
  },
  methods: {
    SendData() {
      this.$axios
        .get(this.policiaURI + "/" + this.cui)
        .then(response => {
          var data = response.data,
            ants = [],
            cantidad = Object.keys(response.data).length;

          for (var i = 0; i < cantidad; i++) {
            ants.push([
              data[i.toString()]["TipoDelito"],
              data[i.toString()]["fechaDelitoCometido"],
              data[i.toString()]["fechaAprension"],
              data[i.toString()]["tiempoPreventivo"],
              "Q" + data[i.toString()]["multa"]
            ]);
          }

          const doc = new jsPDF();

          if (cantidad > 0) {
            //doc.addPage();
            doc.autoTable({
              head: [
                ["Delito", "Cometido", "Aprension", "Preventivo", "Multa"]
              ],
              body: ants
            });
          }

          window.open(doc.output("bloburl"), "_blank");
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  computed: {
    policiaURI() {
      return this.$store.getters.policiaURI;
    }
  }
};
</script>
