<template></template>

<script>
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
export default {
  data() {
    return {};
  },
  mounted() {
    const doc = new jsPDF();


    doc.autoTable({
      head: [["Name", "Email", "Country"]],
      body: [
        ["David", "david@example.com", "Sweden"],
        ["Castille", "castille@example.com", "Spain"]
      ]
    });
    window.open(doc.output('bloburl'), '_blank')
  }
};
</script>