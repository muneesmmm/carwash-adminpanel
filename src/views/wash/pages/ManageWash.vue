<template>
  <v-container id="wash" fluid tag="section">
    <v-row justify="end">
      <v-btn color="primary" @click="exportToPDF">Export to PDF</v-btn>
    <v-btn color="primary" @click="exportToExcel">Export to Excel</v-btn>
    </v-row>
    <base-material-card
      icon="mdi-clipboard-text"
      title="Manage Wash"
      class="px-5 py-3"
    >
      <v-data-table :headers="headers" :items="washHistory">
        <template v-slot:[`item._id`]="{ item, index }">
          <span v-if="item">{{ index + 1 }}</span>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>
<script>
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default {
  name: "WashDashboard",

  data() {
    return {
      headers: [
        { text: "ID", value: "_id" },
        { text: "Vehicle", value: "vehicle.vehicleNumber" },
        { text: "Customer Name", value: "vehicle.owner.name" },
        { text: "Phone", value: "vehicle.owner.phone" },
        { text: "Staff Name", value: "staff.name" },
        { text: "Time", value: "formattedTime" },
      ],
      washHistory: [],
    };
  },

  methods: {
    async totalWashes() {
      try {
        const response = await axios.post("/get-washes", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.status) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        this.washHistory = response.data.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },

    exportToPDF() {
      const doc = new jsPDF();
      const header = this.headers.map((column) => column.text);
      const data = this.washHistory.map((item, index) => {
        const staffName = item.staff ? item.staff.name : "";
        const owner = item.vehicle ? item.vehicle.owner.name : "";
        return [
          index + 1,
          item.vehicle.vehicleNumber,
          owner,
          item.vehicle.owner.phone,
          staffName, // Use conditional staffName variable
          item.formattedTime,
        ];
      });

      doc.autoTable({
        head: [header],
        body: data,
      });

      doc.save("exported_file.pdf");
    },

    exportToExcel() {
      const header = this.headers.map((column) => column.text);
      const data = this.washHistory.map((item, index) => {
        const staffName = item.staff ? item.staff.name : "";
        const owner = item.vehicle ? item.vehicle.owner.name : "";
        return [
          index + 1,
          item.vehicle.vehicleNumber,
          owner,
          item.vehicle.owner.phone,
          staffName, // Use conditional staffName variable
          item.formattedTime,
        ];
      });

      const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "exported_file.xlsx");
    },
  },

  mounted() {
    this.totalWashes();
  },
};
</script>

<style>
.v-data-table > .v-data-table__wrapper > table > thead > tr > th,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-size: 1rem;
  heigh: 48px;
  font-weight: 800;
}
</style>
