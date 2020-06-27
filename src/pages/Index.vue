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
              <q-btn type="submit" :loading="loading" color="primary">Verificar</q-btn>
            </center>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
    <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">INFORMACIÓN</div>
        </q-card-section>

        <q-card-section class="q-pt-none">{{message}}</q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
export default {
  data() {
    return {
      cui: "",
      loading: false,
      persistent: false,
      message: ""
    };
  },
  methods: {
    SendData() {
      this.loading = true;
      this.$axios
        .get(this.renapURL + "/partida/" + this.cui)
        .then(response_renap => {
          var dataRenap = response_renap.data[0];
          if (dataRenap) {
            //SI EXISTE EL DPI
            this.$axios
              .post(this.bancoURL + "/pagos/" + this.cui, {
                //Verifica que se haya realizado el pago
                token: sessionStorage.tokenBanco
              })
              .then(response1 => {
                var data = response1.data;
                if (data["paid"]) {
                  //Si hizo el pago
                  this.$axios
                    .post(
                      this.policiaURL + "/delicuente/antecedentes/" + this.cui,
                      {
                        token: sessionStorage.tokenPolicia
                      }
                    )
                    .then(response => {
                      var data = response.data,
                        ants = [],
                        cantidad = Object.keys(response.data).length;

                      if (this.alert(data["message"])) {
                        for (var i = 0; i < cantidad - 1; i++) {
                          ants.push([
                            data[i.toString()]["TipoDelito"],
                            data[i.toString()]["fechaDelitoCometido"],
                            data[i.toString()]["fechaAprension"],
                            data[i.toString()]["tiempoPreventivo"],
                            "Q" + data[i.toString()]["multa"]
                          ]);
                        }

                        //PARTIDA
                        var encabezado = {
                          cellWidth: 30,
                          halign: "center",
                          fontStyle: "bold",
                          fillColor: [163, 175, 185],
                          textColor: 0
                        };
                        data = dataRenap;
                        var y = 75;
                        const doc = new jsPDF();
                        doc.setFont("arial");
                        doc.setFontSize(28);
                        doc.setFontType("bold");
                        doc.text(48, 20 + y, "ACTA DE NACIMIENTO");
                        doc.autoTable({
                          body: [
                            [
                              "NOMBRES",
                              data["NOMBRES"],
                              "APELLIDOS",
                              data["APELLIDOS"],
                              "CUI",
                              data["CUI"]
                            ]
                          ],
                          startY: 30 + y,
                          bodyStyles: {
                            margin: 10,
                            fontSize: 10,
                            lineWidth: 0.2,
                            lineColor: [0, 0, 0]
                          },
                          columnStyles: {
                            0: encabezado,
                            1: {
                              cellWidth: 30,
                              halign: "center",
                              fillColor: [255, 252, 169]
                            },
                            2: encabezado,
                            3: {
                              cellWidth: 30,
                              halign: "center",
                              fillColor: [255, 252, 169]
                            },
                            4: encabezado,
                            5: { cellWidth: 30, fillColor: [255, 252, 169] }
                          }
                        });
                        const fechaNac = moment(data["FECHA_NACIMIENTO"])
                          .utc()
                          .format("DD/MM/YYYY");
                        doc.autoTable({
                          body: [
                            [
                              "FECHA DE NACIMIENTO",
                              fechaNac,
                              "LUGAR DE NACIMIENTO",
                              data["MUNICIPIO"] + ", " + data["DEPARTAMENTO"]
                            ]
                          ],
                          startY: 37 + y,
                          bodyStyles: {
                            margin: 10,
                            fontSize: 10,
                            lineWidth: 0.2,
                            lineColor: [0, 0, 0]
                          },
                          columnStyles: {
                            0: {
                              cellWidth: 45,
                              halign: "center",
                              fontStyle: "bold",
                              fillColor: [163, 175, 185],
                              textColor: 0
                            },
                            1: {
                              cellWidth: 30,
                              halign: "center",
                              fillColor: [255, 252, 169]
                            },
                            2: {
                              cellWidth: 45,
                              halign: "center",
                              fontStyle: "bold",
                              fillColor: [163, 175, 185],
                              textColor: 0
                            },
                            3: {
                              cellWidth: 60,
                              halign: "center",
                              fillColor: [255, 252, 169]
                            }
                          }
                        });
                        doc.setFontSize(20);
                        doc.text(60, 60 + y, "DATOS DE LOS PADRES");
                        doc.setFontType("normal");
                        doc.setFontSize(14);
                        doc.text(15, 70 + y, "DATOS DE LA MADRE");
                        doc.autoTable({
                          body: [
                            [
                              "NOMBRES",
                              data["NOMBRES_MADRE"],
                              "APELLIDOS",
                              data["APELLIDOS_MADRE"],
                              "CUI",
                              data["CUI_MADRE"]
                            ]
                          ],
                          startY: 75 + y,
                          bodyStyles: {
                            margin: 10,
                            fontSize: 10,
                            lineWidth: 0.2,
                            lineColor: [0, 0, 0]
                          },
                          columnStyles: {
                            0: encabezado,
                            1: {
                              cellWidth: 30,
                              halign: "center",
                              fillColor: [255, 252, 169]
                            },
                            2: encabezado,
                            3: {
                              cellWidth: 30,
                              halign: "center",
                              fillColor: [255, 252, 169]
                            },
                            4: encabezado,
                            5: { cellWidth: 30, fillColor: [255, 252, 169] }
                          }
                        });

                        doc.text(15, 95 + y, "DATOS DEL PADRE");
                        doc.autoTable({
                          body: [
                            [
                              "NOMBRES",
                              data["NOMBRES_PADRE"],
                              "APELLIDOS",
                              data["APELLIDOS_PADRE"],
                              "CUI",
                              data["CUI_PADRE"]
                            ]
                          ],
                          startY: 100 + y,
                          bodyStyles: {
                            margin: 10,
                            fontSize: 10,
                            lineWidth: 0.2,
                            lineColor: [0, 0, 0]
                          },
                          columnStyles: {
                            0: encabezado,
                            1: {
                              cellWidth: 30,
                              halign: "center",
                              fillColor: [255, 252, 169]
                            },
                            2: encabezado,
                            3: {
                              cellWidth: 30,
                              halign: "center",
                              fillColor: [255, 252, 169]
                            },
                            4: encabezado,
                            5: { cellWidth: 30, fillColor: [255, 252, 169] }
                          }
                        });
                        if (cantidad > 1) {
                          doc.addPage();
                          doc.autoTable({
                            head: [
                              [
                                "Delito",
                                "Cometido",
                                "Aprension",
                                "Preventivo",
                                "Multa"
                              ]
                            ],
                            body: ants
                          });
                        }
                        this.loading = false;
                        window.open(doc.output("bloburl"), "_blank");
                      }
                    })
                    .catch(e => {
                      this.loading = false;
                      console.log(e);
                    });
                } else {
                  this.message = "No ha realizado el pago.";
                  this.persistent = true;
                  this.loading = false;
                }
              })
              .catch(e => {
                this.loading = false;
              });
          } else {
            this.message = "No existe registro del CUI ingresado.";
            this.persistent = true;
            this.loading = false;
          }
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
        });
    },
    alert(message) {
      var value = true;
      if (message != "OK") {
        alert("ERROR DE CREDENCIALES");
        sessionStorage.clear();
        location.reload();
        value = false;
      }
      return value;
    }
  },
  computed: {
    policiaURL() {
      return this.$store.getters.policiaURL;
    },
    bancoURL() {
      return this.$store.getters.bancoURL;
    },
    renapURL() {
      return this.$store.getters.renapURL;
    }
  },
  beforeCreate() {
    if (!sessionStorage.tokenPolicia) {
      this.$router.push("/Login");
    } else {
      if (!sessionStorage.logged) {
        sessionStorage.logged = true;
        location.reload();
      }
    }
  }
};
</script>
