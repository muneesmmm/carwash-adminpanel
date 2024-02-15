<template>
  <v-container id="dashboard" fluid tag="section">
    <!-- <v-row>
      <v-col cols="12" md="4" sm="6">
        <v-card> Total Users</v-card>
      </v-col>
      <v-col cols="12" md="4" sm="6">
        <v-card> Total Users</v-card>
      </v-col>
      <v-col cols="12" md="4" sm="6">
        <v-card> Total Users</v-card>
      </v-col>
    </v-row> -->
    <base-material-card
      icon="mdi-clipboard-text"
      title="Manage Customers"
      class="px-5 py-3"
    >
      <v-data-table :headers="headers" :items="userData">
        <template v-slot:[`item._id`]="{ item, index }">
          <span v-if="item">{{ index + 1 }}</span>
        </template>
        <template v-slot:[`item.vehicleNumber`]="{ item }">
          <span v-for="(val, i) in item.vehicles" :key="i">
            <v-card class="text-capitalize font-weight-bold px-2 py-2 text-center">{{ val.vehicleNumber }}</v-card>
          </span>
        </template>
        <template v-slot:[`item.vehicles`]="{ item }">
          <v-Chip color="success" size="small" class="text-capitalize">
            {{ totalVehicles(item.vehicles) }}
          </v-Chip>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-btn small @click="viewCustomerDetails(item)">View</v-btn>
        </template>
      </v-data-table>
      <!-- <v-simple-table>
          <thead>
            <tr>
              <th
                v-for="(header, index) in headers"
                :key="index"
                class="primary--text"
              >
                {{ header.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in userData" :key="index">
              <td v-for="(header, keyIndex) in headers" :key="keyIndex">
                {{ item[header.key] }}
              </td>
            </tr>
          </tbody>
        </v-simple-table> -->
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
        { text: "vehicle Number", value: "vehicleNumber" },
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
        const response = await fetch("http://52.91.198.151:8080/get-customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any other headers if needed
          },
          // Add your request body if you need to send data in the request
          // body: JSON.stringify({ key: 'value' }),
        });

        // Ensure the request was successful (status code 2xx)
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        // Parse the JSON response
        const data = await response.json();

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
