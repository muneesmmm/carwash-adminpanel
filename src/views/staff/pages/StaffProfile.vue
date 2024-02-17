<template>
  <v-container id="staff-profile" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
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
                <v-col cols="12" md="6">
                  <v-text-field class="purple-input" v-model="userData.name" label="User Name" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="Email Address" v-model="userData.email" class="purple-input" />
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
                    v-model="newPassword"
                    label="New Password"
                    type="password"
                  />
                </v-col>
                <v-col cols="12" class="text-right">
                  <v-btn @click="isUpdate=!isUpdate" color="error" class="mr-2"> Cancel </v-btn>
                  <v-btn @click="updateCustomer" color="primary" class="mr-0"> Update Profile </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">Wash History</div>

            <div class="subtitle-1 font-weight-light">
              Total Completed Washes
            </div>
          </template>
          <v-data-table :headers="headers" :items="washHistory">
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

      <v-col cols="12" md="4">
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
            <v-btn
              color="success"
              rounded
              class="mr-0 mt-3"
              @click="isUpdate =!isUpdate"
            >
              Edit Profile
            </v-btn>
          </v-card-text>
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
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
import axios from 'axios';
export default {
  data() {
    return {
      headers: [
        { text: "ID", value: "_id" },
        { text: "vehicle", value: "vehicle" },
        { text: "car  type", value: "type" },
        { text: "date", value: "date" },
        { text: "time", value: "time" },
      ],
      userData: [],
      todayWashes: [],
      washHistory: [], // Initialize userData as an empty array
      isUpdate:false,
      newPassword:''
    };
  },
  created() {
    // Call the function to fetch user data when the component is created
    this.fetchUserData();
    this.fetchTodayData();
    this.fetchTotalData();
  },
  methods: {
    async updateCustomer() {
      try {
        if(this.newPassword){
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
        console.log(updatedUserData);
        this.fetchData();
        this.updateCustomerDialog = false;
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
      const dateObject = new Date(item);
      let hours = dateObject.getHours();
      const minutes = dateObject.getMinutes();
      const seconds = dateObject.getSeconds();
      const amOrPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes}:${seconds} ${amOrPm}`;
    },
    getDate(val) {
      return moment(val).format("Do MMM YYYY");
    },
  },
};
</script>
