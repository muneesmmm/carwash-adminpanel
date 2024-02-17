<template>
  <v-container id="dashboard" fluid tag="section">
    <base-material-card
      icon="mdi-clipboard-text"
      title="Manage Customers"
      class="px-5 py-5"
    >
      <v-data-table :headers="headers" :items="userData">
        <template v-slot:[`item._id`]="{ item, index }">
          <span v-if="item">{{ index + 1 }}</span>
        </template>
        <template v-slot:[`item.vehicleNumber`]="{ item }">
          <span v-for="(val, i) in item.vehicles" :key="i">
            <v-card
              class="text-capitalize font-weight-bold px-2 py-2 text-center"
              >{{ val.vehicleNumber }}</v-card
            >
          </span>
        </template>
        <template v-slot:[`item.vehicles`]="{ item }">
          <v-Chip color="success" size="small" class="text-capitalize">
            {{ totalVehicles(item.vehicles) }}
          </v-Chip>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-btn color="primary" small @click="viewCustomerDetails(item)">View</v-btn>
        </template>
      </v-data-table>
    </base-material-card>
    <view-profile
      v-if="selectedUser"
      :dialog="customerDialog"
      :selectedUser="selectedUser"
      @cancel="closeDialog"
    />
  </v-container>
</template>

<script>
import ViewProfile from "./components/ViewProfile.vue";
import axios from 'axios';

export default {
  components: { ViewProfile },
  name: "DashboardDashboard",

  data() {
    return {
      // headers: [
      //   {
      //     title: "Customers",
      //     key: "name",
      //   },
      //   {
      //     title: "Email",
      //     key: "email",
      //   },
      //   {
      //     title: "Phone",
      //     key: "phone",
      //   },
      //   {
      //     title: "No. of vehicles",
      //     key: "vehicles",
      //   },
      // ],
      headers: [
        { text: "ID", value: "_id" },
        { text: "Name", value: "name" },
        { text: "Vehicles Number", value: "vehicleNumber" },
        { text: "Phone", value: "phone" },
        { text: "Vehicles", value: "vehicles" },
        { text: "Action", value: "action" },
      ],
      userData: [],
      customerDialog: false,
      selectedUser: {},
    };
  },
  methods: {
    totalVehicles(item) {
      return item.length;
    },
    viewCustomerDetails(item) {
      this.selectedUser = item;
      this.customerDialog = true;
    },
    closeDialog() {
      this.customerDialog = false;
      this.selectedUser = null;
    },
    async fetchData() {
      try {
        const response = await axios.post(
          "/get-customers",
          {
            // Add your request body if you need to send data in the request
            // data: { key: 'value' }
          },
          {
            headers: {
              "Content-Type": "application/json",
              // Add any other headers if needed
            },
          }
        );

        // Ensure the request was successful (status code 2xx)
        if (response.customer) {
          throw new Error("Failed to fetch data");
        }

        // Parse the JSON response
        const data = await response.data;

        // Assuming your server responds with a property named 'customer'
        this.userData = data.customer;
        console.log(this.userData);
      } catch (e) {
        console.error("Error fetching user data:", e);
      } finally {
        // Code to be executed after the request, if needed
      }
    },
  },
  mounted() {
    this.fetchData();
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
