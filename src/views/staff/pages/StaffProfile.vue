<template>
  <v-container id="staff-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="4">
        <base-material-card v-if="!isUpdate">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Profile</div>
            <div class="subtitle-1 font-weight-light">
              {{ userData.staffId }}
            </div>
          </template>
          <v-card-text class="text-left">
            <div class="d-flex justify-space-between">
              <h6 class="display-2 font-weight-black mb-1 black--text">
              {{ userData.name }}
            </h6>
              <h6 class="display-1 font-weight-bold mb-1 black--text">
              {{ userData.staffId }}
            </h6>

            </div>

            <!-- <h4 class="display-1 font-weight-bold mb-3 black--text">
              role: {{ userData.role }}
            </h4> -->
            <h5 v-if="userData.location" class="display-1 font-weight-bold mb-3 black--text">
              Current Site: {{ userData.location }}
            </h5>
            <h6 class="display-1 mb-1 grey--text">
              {{ userData.email }}
            </h6>
            <h6 class="display-1 mb-1 grey--text">
              {{ userData.phone }}
            </h6>
            <v-btn
              color="success"
              rounded
              small
              outlined
              class="mr-0 mt-3"
              @click="isUpdate = !isUpdate"
            >
            <v-icon>mdi-square-edit-outline</v-icon>
              Edit Profile
            </v-btn>
          </v-card-text>
        </base-material-card>
        <base-material-card v-if="isUpdate">
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Edit Profile</div>

            <div class="subtitle-1 font-weight-light">
              Complete your profile
            </div>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                    class="purple-input"
                    v-model="userData.staffId"
                    label="Staff Id"
                  />
                  <v-text-field
                    class="purple-input"
                    v-model="userData.username"
                    label="Username"
                  />
                  <v-text-field
                    class="purple-input"
                    v-model="userData.name"
                    label="Name"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="Email Address"
                    v-model="userData.email"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    class="purple-input"
                    v-model="userData.phone"
                    label="Phone"
                    type="number"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    class="purple-input"
                    v-model="userData.location"
                    label="Staff Site"
                    type="text"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    class="purple-input"
                    v-model="newPassword"
                    label="New Password"
                    type="password"
                  />
                </v-col>
                <v-col cols="12" class="text-right">
                  <v-btn
                    @click="isUpdate = !isUpdate"
                    color="error"
                    class="mr-2"
                  >
                    Cancel
                  </v-btn>
                  <v-btn @click="updateCustomer" color="primary" class="mr-0">
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Today Washes</div>
          </template>
          <v-card-text class="text-center">
            <v-card>
              <v-row class="font-weight-bold">
                <v-col>Vehicle Number</v-col>
                <v-col>Type</v-col>
                <v-col>Time</v-col>
              </v-row>
            </v-card>
            <v-card v-for="(item, index) in todayWashes" :key="index">
              <v-row>
                <v-col>{{ item?.vehicle?.vehicleNumber }}</v-col>
                <v-col>{{ item?.washType }}</v-col>
                <v-col>{{ getWashTime(item.washDate) }}</v-col>
              </v-row>
            </v-card>
          </v-card-text>
        </base-material-card>
      </v-col>
      <v-col cols="12" md="8">
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Wash History</div>

            <div class="subtitle-1 font-weight-light">
              Total Completed Washes
            </div>
          </template>
          <v-row>
            <v-col cols="12" md="12" class="d-flex justify-end">
              <v-btn small color="primary" @click="exportToPDF"><v-icon class="mr-1">mdi-file-download-outline</v-icon>Export to PDF</v-btn>
        <v-btn small color="primary" @click="exportToExcel"><v-icon class="mr-1">mdi-file-download-outline</v-icon>Export to Excel</v-btn>

            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                placeholder="Search Vehicle..."
                v-model="search"
                append-icon="mdi-magnify"
                clearable
                dense
                solo
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-menu
                v-model="menuStart"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="formattedStartDate"
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
            <v-col cols="12" md="4">
              <!-- End Date Picker -->
              <v-menu
                v-model="menuEnd"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="formattedEndtDate"
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
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
export default {
  data() {
    return {
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
      formattedEndtDate:''
    };
  },
  created() {
    // Call the function to fetch user data when the component is created
    this.fetchUserData();
    this.fetchTodayData();
    this.fetchTotalData();
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
    async updateCustomer() {
      try {
        if (this.newPassword) {
          this.userData.password = this.newPassword;
        }
        const response = await axios.post(
          `/update/${this.userData._id}`,
          this.userData
        );

        if (!response.status) {
          throw new Error(`Failed to update user: ${response.statusText}`);
        }
        const updatedUserData = response.data;
        this.isUpdate = !this.isUpdate;

        console.log(updatedUserData);
        this.fetchData();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
    async fetchUserData() {
      try {
        const id = this.$route.params.id;
        const response = await axios.post("/getuser", {
          id,
        });

        if (!response.status) {
          throw new Error("Failed to fetch user data");
        }

        // Set userData to the received data
        this.userData = response.data.user;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async fetchTodayData() {
      try {
        const id = this.$route.params.id;
        const response = await axios.post(
          `/today-washes/${id}`, // No request body needed
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
        this.todayWashes = response.data.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async fetchTotalData() {
      try {
        const id = this.$route.params.id;
        const response = await axios.post(
          `/get-washes/${id}`, // No request body needed
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
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    getWashTime(item) {
      return moment(item).format('h:mm A');
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
      doc.text("Car Wash Details of "+this.userData.name+this.getDate(new Date()), 10, 10);
      doc.autoTable({
        head: [header],
        body: data,
      });

      doc.save(this.userData.name+"_"+this.getDate(new Date())+".pdf");
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
      XLSX.writeFile(wb, this.userData.name+"_"+this.getDate(new Date())+".xlsx");
    },
  },
};
</script>
