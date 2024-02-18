<template>
  <v-container id="wash" fluid tag="section">
    <v-row>
      <v-col cols="12" md="3">
        <router-link :to="{ path: '/pages/customer' }" class="no-decoration">
        <base-material-stats-card
          color="primary"
          icon="mdi-account"
          title="User"
          :value="dashboard.customerCount"
          sub-icon="mdi-account"
          sub-text="Total registered Customer"
        />
        </router-link>
      </v-col>
      <v-col cols="12" md="3">
        <router-link :to="{ path: '/pages/customer' }" class="no-decoration">
        <base-material-stats-card
          color="primary"
          icon="mdi-car"
          title="Vehicles"
          :value="dashboard.vehicleCount"
          sub-icon="mdi-car"
          sub-text="Total registered Vehicles"
        />
      </router-link>
      </v-col>
      <v-col cols="12" md="3">
        <router-link :to="{ path: '/pages/staff' }" class="no-decoration">
        <base-material-stats-card
          color="primary"
          icon="mdi-account"
          title="Staff"
          :value="dashboard.userCount-1"
          sub-icon="mdi-account"
          sub-text="Total Staff"
        />
        </router-link>
      </v-col>
      <v-col cols="12" md="3">
        <base-material-stats-card
          color="primary"
          icon="mdi-car-wash"
          title="Total Washes"
          :value="dashboard.washHistoryCount"
          sub-icon="mdi-car-wash"
          sub-text="Total washes"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="3">
        <v-text-field
          placeholder="Search Vehicle..."
          v-model="search"
          append-icon="mdi-magnify"
          clearable
          dense
          solo
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-menu
          v-model="menuStart"
          :close-on-content-click="true"
          transition="scale-transition"
          offset-y
          max-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="formattedStartDate"
              label="Start Date"
              readonly
              dense
              solo
              v-on="on"
              class="mt-0"
              append-icon="mdi-calendar"
            ></v-text-field>
          </template>
          <v-date-picker v-model="startDate" scrollable></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="2">
        <!-- End Date Picker -->
        <v-menu
          v-model="menuEnd"
          :close-on-content-click="true"
          transition="scale-transition"
          offset-y
          max-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="formattedEndDate"
              solo
              dense
              label="End Date"
              readonly
              append-icon="mdi-calendar"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="endDate" scrollable></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="5" class="d-flex justify-end">
        <v-btn small color="primary" @click="exportToPDF"><v-icon class="mr-1">mdi-file-download-outline</v-icon>Export to PDF</v-btn>
        <v-btn small color="primary" @click="exportToExcel"><v-icon class="mr-1">mdi-file-download-outline</v-icon>Export to Excel</v-btn>
      </v-col>
    </v-row>
    <base-material-card
      icon="mdi-clipboard-text"
      title="Manage Wash"
      class="px-5 py-3"
    >
      <v-data-table :headers="headers" :items="filteredItems">
        <template v-slot:[`item._id`]="{ item, index }">
          <span v-if="item">{{ index + 1 }}</span>
        </template>
        <template v-slot:[`item.washDate`]="{ item }">
          <span v-if="item">{{ getDate(item.washDate) }}</span>
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
import moment from "moment";
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
        { text: "Date", value: "washDate" },
        { text: "Time", value: "formattedTime" },
      ],
      washHistory: [],
      search: "",
      startDate: null,
      endDate: null,
      menuStart: false,
      menuEnd: false,
      dashboard:null
    };
  },
  computed: {
    filteredItems() {
      // Filter based on search term
      let filtered = this.washHistory;
      if (this.search) {
        const searchTerm = this.search.toLowerCase();
        filtered = filtered.filter((item) => {
          return Object.values(item).some((val) => {
            if (typeof val === "object" && val !== null) {
              return Object.values(val).some((innerVal) => {
                if (typeof innerVal === "string") {
                  return innerVal.toLowerCase().includes(searchTerm);
                }
                return false;
              });
            } else if (typeof val === "string") {
              return val.toLowerCase().includes(searchTerm);
            }
            return false;
          });
        });
      }

      // Filter based on date range
      if (this.startDate && this.endDate) {
        const startDate = new Date(this.startDate);
        const endDate = new Date(this.endDate);
        filtered = filtered.filter((item) => {
          const washDate = new Date(item.washDate);
          return washDate >= startDate && washDate <= endDate;
        });
      }

      return filtered;
    },
    formattedStartDate() {
      return this.startDate?this.getDate(this.startDate):'';
    },
    formattedEndDate() {
      return this.endDate?this.getDate(this.endDate):'';
    }
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
    async dashboardData() {
      try {
        const response = await axios.post("/dashboardData", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.status) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        this.dashboard = response.data.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },

    exportToPDF() {
      const doc = new jsPDF();
      const header = this.headers.map((column) => column.text);
      const data = this.filteredItems.map((item, index) => {
        const staffName = item.staff ? item.staff.name : "";
        const owner = item.vehicle ? item.vehicle.owner.name : "";
        const washDate = this.getDate(item.washDate);
        return [
          index + 1,
          item.vehicle.vehicleNumber,
          owner,
          item.vehicle.owner.phone,
          staffName, // Use conditional staffName variable
          washDate,
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
      const data = this.filteredItems.map((item, index) => {
        const staffName = item.staff ? item.staff.name : "";
        const owner = item.vehicle ? item.vehicle.owner.name : "";
        const washDate = this.getDate(item.washDate);
        return [
          index + 1,
          item.vehicle.vehicleNumber,
          owner,
          item.vehicle.owner.phone,
          staffName, // Use conditional staffName variable
          washDate,
          item.formattedTime,
        ];
      });

      const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "exported_file.xlsx");
    },
    getDate(val) {
      return moment(val).format("Do MMM YYYY");
    },
  },
  mounted() {
    this.totalWashes();
    this.dashboardData()
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
.no-decoration {
  text-decoration: none;
}
</style>
