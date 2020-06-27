<template>
  <div>
    <q-btn label="REPORTE" color="primary" @click="peticion" />
  </div>
</template>
<script>
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import $ from "jquery";
import moment from "moment";
export default {
  data() {
    return {};
  },
  methods: {
    peticion() {
      this.$axios
        .post("http://localhost:5000/pagos/5045242193620", {
          token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoidXN1YXJpb19yZW5hcCIsImV4cCI6MTU5MzIxODI5OH0.mDOmyGxAC7qZLXZpC6X2_4slnlymUolJkcPPwAD2OB4"
        })
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>