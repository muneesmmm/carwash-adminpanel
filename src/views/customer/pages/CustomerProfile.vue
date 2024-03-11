<template>
  <v-container id="customer-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Profile</div>
          </template>
          <v-card-text class="text-left">
            <h6 class="display-2 font-weight-black mb-1 black--text">
              {{ userData.name }}
            </h6>

            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{ userData.role }}
            </h4>
            <h6 class="display-1 mb-1 grey--text">
              {{ userData.email }}
            </h6>
            <h6 class="display-1 mb-1 grey--text">
              {{ userData.phone }}
            </h6>
            <!-- <v-btn
              color="success"
              rounded
              small
              outlined
              class="mr-0 mt-3"
              @click="isUpdate = !isUpdate"
            >
            <v-icon>mdi-square-edit-outline</v-icon>
              Edit Profile
            </v-btn> -->
            <div class="text-center">
              <v-divider class="my-2" />
              <div class="d-flex justify-space-between">
                <span class="font-weight-bold h3">Vehicles</span>
                <span class="font-weight-bold h3"
                  >: {{ userData.vehicles?.length }}</span
                >
              </div>
              <v-divider class="my-2" />
              <v-card
                light
                outlined
                class="px-3 py-3 d-flex justify-space-between font-weight-bold"
                v-for="(item, i) in userData.vehicles"
                :key="i"
              >
                <span>{{ item.vehicleNumber }}</span>
                <span>{{ item.type }}</span>
              </v-card>
            </div>
            <h5 v-if="selectedPlan" class="text-left">
              Current Plan : {{ selectedPlan }}
            </h5>
            <v-btn small class="mt-3" @click="isUpdate=!isUpdate">{{isUpdate?'Close':'Update Plan'}}</v-btn>
            <v-row class="mt-4 align-items-center" v-if="isUpdate">
              <v-select
                dense
                solo
                v-model="selectedPlanId"
                :items="plans"
                item-value="_id"
                item-text="name"
                label="Select Plan"
              >
                <template v-slot:item="{ item }">
                  <div>
                    <span>{{ item.name }}</span>
                    <span>-  ₹{{ item.price }}</span>
                  </div>
                </template>
              </v-select>
              <v-btn color="primary" @click="updatePlan" small style="height: 38px;">Update</v-btn>
            </v-row>
          </v-card-text>
        </base-material-card>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Packages</div>
          </template>
          <v-card-text class="text-center">
            <v-data-table :headers="packageHeaders" :items="packages">
              <template v-slot:[`item.status`]="{ item }">
                {{ packageStatus(item) }}
              </template>
            </v-data-table>
          </v-card-text>
        </base-material-card>
      </v-col>
      <v-col cols="12" md="6">
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Wash History</div>

            <div class="subtitle-1 font-weight-light">
              Total Completed Washes
            </div>
          </template>
          <v-card v-if="userData">
            <!-- Container for tabs -->
            <v-tabs v-model="selectedVehicle" background-color="primary">
              <!-- Iterate over vehicle numbers to create tabs -->
              <v-tab
                v-for="vehicle in userData.vehicles"
                :key="vehicle._id"
                :value="vehicle._id"
              >
                {{ vehicle.vehicleNumber }}
              </v-tab>
            </v-tabs>
          </v-card>
          <v-row>
            <v-col cols="12" md="12" class="d-flex justify-end">
              <v-btn small color="primary" @click="exportToPDF"
                ><v-icon class="mr-1">mdi-file-download-outline</v-icon>Export
                to PDF</v-btn
              >
              <v-btn small color="primary" @click="exportToExcel"
                ><v-icon class="mr-1">mdi-file-download-outline</v-icon>Export
                to Excel</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-menu
                v-model="menuStart"
                :close-on-content-click="true"
                transition="scale-transition"
                offset-y
                max-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="startDate"
                    label="Start Date"
                    readonly
                    solo
                    dense
                    v-on="on"
                    append-icon="mdi-calendar"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="startDate" scrollable></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="6">
              <v-menu
                v-model="menuEnd"
                :close-on-content-click="true"
                transition="scale-transition"
                offset-y
                max-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="endDate"
                    solo
                    label="End Date"
                    readonly
                    dense
                    append-icon="mdi-calendar"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="endDate" scrollable></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-data-table :headers="headers" :items="filteredItems">
            <template v-slot:[`item._id`]="{ item, index }">
              <span v-if="item">{{ index + 1 }}</span>
            </template>
            <template v-slot:[`item.vehicle`]="{ item }">
              {{ item.vehicle?.vehicleNumber }}
            </template>
            <template v-slot:[`item.type`]="{ item }">
              {{ item.vehicle?.type }}
            </template>
            <template v-slot:[`item.time`]="{ item }">
              {{ getWashTime(item.washDate) }}
            </template>
            <template v-slot:[`item.date`]="{ item }">
              {{ getDate(item.washDate) }}
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <v-btn color="success" @click="viewDetails(item._id)">view</v-btn>
              <v-btn color="red">Delete</v-btn>
            </template>
          </v-data-table>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
import axios from "axios";
// import ViewCarwashes from '../components/ViewCarwashes.vue';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
export default {
  // components: { ViewCarwashes },
  data() {
    return {
      packageHeaders: [
        // { text: "ID", value: "_id" },
        { text: "Name", value: "plan.name" },
        { text: "Duration", value: "plan.duration" },
        { text: "Remaining Wash", value: "remainingWashes" },
        { text: "Remaining Interior", value: "remainingInteriors" },
        { text: "Status", value: "status" },
      ],
      headers: [
        { text: "ID", value: "_id" },
        { text: "Vehicle", value: "vehicle" },
        { text: "Car  Type", value: "type" },
        { text: "Wash Date", value: "date" },
        { text: "Wash Time", value: "time" },
      ],
      userData: [],
      todayWashes: [],
      washHistory: [], // Initialize userData as an empty array
      isUpdate: false,
      newPassword: "",
      search: "",
      startDate: null,
      endDate: null,
      menuStart: false,
      menuEnd: false,
      selectedVehicle: null,
      packages: [],
      selectedPlan: "",
      plans: [],
      selectedPlanId:null,
      selectedPackageId:null,
    };
  },
  created() {
    // Call the function to fetch user data when the component is created
    this.fetchPlans();
    this.fetchUserData();
    this.fetchPackageData();
  },
  computed: {
    filteredItems() {
      // Filter based on search term
      let filtered = this.washHistory;
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
  },
  watch: {
    selectedVehicle: {
      handler() {
        this.fetchTotalData(this.selectedVehicle);
      },
    },
  },
  methods: {
    async fetchUserData() {
      try {
        const id = this.$route.params.id;
        const response = await axios.post(`/customer/${id}`, {
          id,
        });

        if (!response.status) {
          throw new Error("Failed to fetch user data");
        }

        // Set userData to the received data
        this.userData = response.data.customer;
        this.selectedPlan = this.userData?.selectedPackage?.plan.name;
        this.selectedPackageId = this.userData?.selectedPackage._id;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async fetchPackageData() {
      try {
        const id = this.$route.params.id;
        const response = await axios.post(
          `/get-customer-packages/${id}`, // No request body needed
          {
            headers: {
              "Content-Type": "application/json", // Specify content type
            },
          }
        );

        if (!response) {
          throw new Error("Failed to fetch user data");
        }

        // Set todayWashes to the received data
        this.packages = response.data.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async fetchTotalData(val) {
      try {
        const response = await axios.post(
          `/get-vehicle-washes/${this.userData.vehicles[val]._id}`, // No request body needed
          {
            headers: {
              "Content-Type": "application/json", // Specify content type
            },
          }
        );

        if (!response.status) {
          throw new Error("Failed to fetch user data");
        }

        // Set todayWashes to the received data
        this.washHistory = response.data.data;
        return this.washHistory;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    getWashTime(item) {
      return moment(item).format("h:mm A");
    },
    getDate(val) {
      return moment(val).format("Do MMM YYYY");
    },
    exportToPDF() {
      const doc = new jsPDF();
      const header = this.headers.map((column) => column.text);
      const data = this.filteredItems.map((item, index) => {
        const washDate = this.getDate(item.washDate);
        const washTime = this.getWashTime(item.washDate);
        return [
          index + 1,
          item.vehicle.vehicleNumber,
          item.vehicle.type,
          washDate,
          washTime,
        ];
      });
      doc.setFontSize(16); // Adjust font size if needed
      doc.text(
        "Car Wash Details of " + this.userData.name + this.getDate(new Date()),
        10,
        10
      );
      doc.autoTable({
        head: [header],
        body: data,
      });

      doc.save(this.userData.name + "_" + this.getDate(new Date()) + ".pdf");
    },

    exportToExcel() {
      const header = this.headers.map((column) => column.text);
      const data = this.filteredItems.map((item, index) => {
        const washDate = this.getDate(item.washDate);
        const washTime = this.getWashTime(item.washDate);
        return [
          index + 1,
          item.vehicle.vehicleNumber,
          item.vehicle.type,
          washDate,
          washTime,
        ];
      });

      const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(
        wb,
        this.userData.name + "_" + this.getDate(new Date()) + ".xlsx"
      );
    },
    packageStatus(item) {
      const currentDate = new Date();
      const endDate = new Date(item.endDate);
      if (
        currentDate > endDate ||
        item.remainingWashes === 0 ||
        item.remainingInteriors === 0
      ) {
        return "Expired";
      } else {
        return "Active";
      }
    },
    async fetchPlans() {
      try {
        const response = await axios.post("/get-plans", {
          headers: {
            "Content-Type": "application/json",
            // Add any other headers if needed
          },
        });

        // Ensure the request was successful (status code 2xx)
        if (!response.data) {
          throw new Error("Failed to fetch data");
        }
        this.plans = await response.data.data;
        // Parse the JSON response
      } catch (e) {
        console.error("Error fetching user data:", e);
      } finally {
        // Code to be executed after the request, if needed
      }
    },
    async updatePlan() {
      let data ={
        packageId:this.selectedPackageId,
        newPlanId:this.selectedPlanId
      }
      // console.log(data);
      try {
        const response = await axios.post("/update-selected-plan", data);

          if (!response.data) {
          throw new Error("Failed to fetch data");
        }
        if(response.data){
          this.fetchUserData();
          this.isUpdate=false
        }
        
      } catch (e) {
        console.error("Error fetching user data:", e);
      }
    },
  },
};
</script>
