<template>
  <v-container id="orders" fluid tag="section">
    <v-row>
      <v-col cols="12" md="3" v-for="(item, i) in getTotalAmountByPaymentType()" :key="i">
        <base-material-stats-card
          color="primary"
          icon="mdi-clipboard-outline"
          :title="item.paymentType"
          :value="item.totalAmount"
          sub-icon="mdi-clipboard-outline"
          :sub-text="`Total ` + item.paymentType"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="2">
        <!-- <v-text-field
          placeholder="Search Vehicle..."
          v-model="search"
          append-icon="mdi-magnify"
          clearable
          hide-details
          dense
          solo
        /> -->
        <v-autocomplete
          dense
          solo
          multiple
          clearable
          label="Select Staff"
          item-text="name"
          item-value="_id"
          :items="staffData"
          v-model="selectedStaff"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          dense
          solo
          clearable
          label="Payment Status"
          :items="['CASH', 'BANK', 'PAY_LATER']"
          v-model="paymentStatus"
        ></v-select>
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
              clearable
              label="Start Date"
              readonly
              dense
              solo
              hide-details
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
              clearable
              label="End Date"
              readonly
              hide-details
              append-icon="mdi-calendar"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="endDate" scrollable></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end">
        <v-btn small color="primary" @click="exportToPDF"
          ><v-icon class="mr-1">mdi-file-download-outline</v-icon>Export to
          PDF</v-btn
        >
        <v-btn small color="primary" @click="exportToExcel"
          ><v-icon class="mr-1">mdi-file-download-outline</v-icon>Export to
          Excel</v-btn
        >
      </v-col>
    </v-row>
    <base-material-card icon="mdi-clipboard-text" title="Manage Orders">
      <v-data-table :headers="headers" :items="filteredItems">
        <!-- Item slot templates -->
        <template v-slot:[`item._id`]="{ item, index }">
          <span v-if="item">{{ index + 1 }}</span>
        </template>
        <template v-slot:[`item.orderDate`]="{ item }">
          <span v-if="item.orderDate">{{ getDate(item.orderDate) }}</span>
        </template>
        <template v-slot:[`item.vehicles`]="{ item }">
          <span v-if="item.customer">
            <span v-for="(vehicle, i) in item.customer.vehicles" :key="i"
              >{{ vehicle.vehicleNumber }},</span
            >
          </span>
        </template>
        <template v-slot:[`item.staff.name`]="{ item }">
          <span v-if="item.staff">{{ item.staff.name }}</span>
        </template>
        <template v-slot:[`item.customer.paymentType`]="{ item }">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-chip
                v-bind="attrs"
                v-on="on"
                outlined
                :color="getChipColor(item.customer.paymentType)"
              >
                {{ item.customer.paymentType }}
              </v-chip>
            </template>
            <v-list>
              <v-list-item
                v-for="type in paymentTypes"
                :key="type"
                @click="updatePaymentType(item.customer, type)"
              >
                <v-list-item-title>{{ type }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template v-slot:[`item.plan`]="{ item }">
          <span v-if="item.package">{{ item.package?.plan?.name }}</span>
        </template>
        <template v-slot:[`item.amount`]="{ item }">
          <span v-if="item.package">₹{{ item.package?.plan?.price }}</span>
        </template>

        <!-- Footer to display total amount -->
        <template v-slot:footer>
          <div class="text-center mt-5">
            <span class="font-weight-bold"
              >Total Amount : {{ getTotalAmount() }}</span
            >
          </div>
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
  name: "OrdersView",
  data() {
    return {
      headers: [
        { text: "ID", value: "_id" },
        { text: "Date", value: "orderDate" },
        { text: "Vehicles", value: "vehicles" },
        { text: "Staff Name", value: "staff.name" },
        { text: "Selected Plan", value: "plan" },
        { text: "Amount", value: "amount" },
        { text: "Payment Type", value: "customer.paymentType" },
      ],
      orders: [],
      search: "",
      startDate: null,
      endDate: null,
      menuStart: false,
      menuEnd: false,
      staffData: [],
      selectedStaff: "",
      paymentStatus: "",
      paymentTypes: ["CASH", "BANK", "PAY_LATER"], // Define payment types
      totalData: [],
    };
  },
  computed: {
    filteredItems() {
      // Filter based on search term
      let filtered = this.orders;
      // if (this.search) {
      //   const searchTerm = this.search.toLowerCase();
      //   filtered = filtered.filter((item) => {
      //     return Object.values(item).some((val) => {
      //       if (typeof val === "object" && val !== null) {
      //         return Object.values(val).some((innerVal) => {
      //           if (typeof innerVal === "string") {
      //             return innerVal.toLowerCase().includes(searchTerm);
      //           }
      //           return false;
      //         });
      //       } else if (typeof val === "string") {
      //         return val.toLowerCase().includes(searchTerm);
      //       }
      //       return false;
      //     });
      //   });
      // }
      if (this.selectedStaff && this.selectedStaff.length > 0) {
        filtered = filtered.filter((item) => {
          return this.selectedStaff.includes(item.staff._id);
        });
      }
      if (this.paymentStatus) {
        filtered = filtered.filter((item) => {
          return item.customer.paymentType == this.paymentStatus;
        });
      }
      // Filter based on date range
      if (this.startDate && this.endDate) {
        const startDate = new Date(this.startDate);
        const endDate = new Date(this.endDate);
        filtered = filtered.filter((item) => {
          const orderDate = new Date(item.orderDate);
          return orderDate >= startDate && orderDate <= endDate;
        });
      }

      return filtered;
    },
    formattedStartDate() {
      return this.startDate ? this.getDate(this.startDate) : "";
    },
    formattedEndDate() {
      return this.endDate ? this.getDate(this.endDate) : "";
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.post("/get-orders", {
          headers: {
            "Content-Type": "application/json",
            // Add any other headers if needed
          },
        });

        // Ensure the request was successful (status code 2xx)
        if (!response.data) {
          throw new Error("Failed to fetch data");
        }
        this.orders = await response.data.data;
        // Parse the JSON response
      } catch (e) {
        console.error("Error fetching user data:", e);
      } finally {
        // Code to be executed after the request, if needed
      }
    },
    async fetchStaff() {
      try {
        const response = await axios.post("/get-users", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.status) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        this.staffData = response.data.user;
        this.staffData = this.staffData.filter((item) => item.role === "staff");
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        // Code to be executed after the request, if needed
      }
    },
    async fetchTotal() {
      try {
        const response = await axios.post("/total-amount", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.status) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        this.totalData = response.data.totalAmounts;
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        // Code to be executed after the request, if needed
      }
    },
    getWashTime(item) {
      return moment(item).format("h:mm A");
    },
    getDate(val) {
      return moment(val).format("Do MMM YYYY,h:mm A");
    },
    getTotalAmount() {
      let total = 0;
      this.filteredItems.forEach((item) => {
        if (item.package && item.package.plan && item.package.plan.price) {
          total += item.package.plan.price;
        }
      });
      return "₹" + total;
    },
    getTotalAmountByPaymentType() {
      const totalByPaymentType = {};

      this.filteredItems.forEach((item) => {
        const paymentType = item.customer.paymentType;

        if (item.package && item.package.plan && item.package.plan.price) {
          const amount = item.package.plan.price;

          if (totalByPaymentType[paymentType]) {
            totalByPaymentType[paymentType] += amount;
          } else {
            totalByPaymentType[paymentType] = amount;
          }
        }
      });

      // Format the total amount by payment type
      const formattedTotalByPaymentType = Object.entries(
        totalByPaymentType
      ).map(([paymentType, total]) => ({
        paymentType,
        totalAmount: "₹" + total,
      }));

      return formattedTotalByPaymentType;
    },
    exportToPDF() {
      const doc = new jsPDF();
      const header = this.headers.map((column) => column.text);
      let total = 0; // Initialize total amount
      const data = this.filteredItems.map((item, index) => {
        const staffName = item.staff ? item.staff.name : "";
        const vehicle = [];
        item.customer.vehicles.forEach((item) => {
          vehicle.push(item.vehicleNumber);
        });
        const orderDate = this.getDate(item.orderDate);
        const amount = item.package.plan.price; // Extract the price from item
        total += amount; // Accumulate the total amount
        return [
          index + 1,
          orderDate,
          vehicle.join(", "), // Join vehicles with comma
          staffName, // Use conditional staffName variable
          item.customer.paymentType,
          item.package.plan.name,
          amount, // Add amount
        ];
      });

      // Add total amount to the last row of the data array
      data.push(["", "", "", "", "", "Total:", total]);

      doc.autoTable({
        head: [header],
        body: data,
      });

      doc.save("exported_file.pdf");
    },

    exportToExcel() {
      const header = this.headers.map((column) => column.text);
      let total = 0; // Initialize total amount
      const data = this.filteredItems.map((item, index) => {
        const staffName = item.staff ? item.staff.name : "";
        const vehicle = [];
        item.customer.vehicles.forEach((item) => {
          vehicle.push(item.vehicleNumber);
        });
        const orderDate = this.getDate(item.orderDate);
        const amount = item.package.plan.price; // Extract the price from item
        total += amount; // Accumulate the total amount
        return [
          index + 1,
          orderDate,
          vehicle.join(", "), // Join vehicles with comma
          staffName, // Use conditional staffName variable
          item.customer.paymentType,
          item.package.plan.name,
          amount, // Add amount
        ];
      });

      // Add total amount to the last row of the data array
      data.push(["", "", "", "", "", "Total:", total]);

      const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "exported_file.xlsx");
    },
    async updatePaymentType(customer, type) {
      let data = {
        _id: customer._id,
        paymentType: type,
      };
      console.log(data);
      try {
        const response = await axios.post("/update-payment-status", data);

        // Ensure the request was successful (status code 2xx)
        if (!response.data) {
          throw new Error("Failed to fetch data");
        }
        if (response.data) {
          this.fetchData();
        }
        // Parse the JSON response
      } catch (e) {
        console.error("Error fetching user data:", e);
      } finally {
        // Code to be executed after the request, if needed
      }
    },
    getChipColor(paymentType) {
      return paymentType === "PAY_LATER" ? "red" : "primary";
    },
  },
  mounted() {
    this.fetchData();
    this.fetchStaff();
    this.fetchTotal();
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
  height: 48px;
  font-weight: 800;
}
</style>
