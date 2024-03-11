<template>
  <v-row justify="center">
    <v-dialog
      v-model="internalDialog"
      @click:outside="cancelCustomer"
      max-width="600px"
    >
      <v-card>
        <v-card-title class="font-weight-bold text-h3">
          Customer Details</v-card-title
        >
        <v-card-text>
          <!-- <v-text-field
            v-if="planName"
            v-model="planName"
            label="Package"
          ></v-text-field> -->
          <v-card class="d-flex px-3 py-3" v-if="userData">
            <span class="font-weight-bold">Package :</span>
            <v-spacer></v-spacer>
            <span class="font-weight-bold">{{
              userData.planName ? userData.planName : "No Plans"
            }}</span>
          </v-card>
          <v-card v-if="userData" class="d-flex px-3 py-3">
            <span class="font-weight-bold">Duration :</span>
            <v-spacer></v-spacer>
            <span class="font-weight-bold">{{ userData.duration }}</span>
          </v-card>
          <v-card v-if="userData" class="d-flex px-3 py-3">
            <span class="font-weight-bold">Remaining Interios :</span>
            <v-spacer></v-spacer>
            <span class="font-weight-bold">{{ userData.remainingInteriors }}</span>
          </v-card>
          <v-card v-if="userData" class="d-flex px-3 py-3">
            <span class="font-weight-bold">Remaining Washes :</span>
            <v-spacer></v-spacer>
            <span class="font-weight-bold">{{ userData.remainingWashes }}</span>
          </v-card>
          <v-card class="d-flex px-3 py-3" v-if="userData">
            <span class="font-weight-bold">Phone :</span>
            <v-spacer></v-spacer>
            <span class="font-weight-bold">{{ userData.phone }}</span>
          </v-card>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="cancelCustomer">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: Boolean,
    customerData: Object,
  },
  data() {
    return {
      userData: this.customerData,
      internalDialog:false
    };
  },
  methods:{
    cancelCustomer() {
      // Emit an event to notify the parent component about the cancel action
      this.$emit("cancel");
    },
  },
  watch: {
    dialog: {
      handler() {
        // Update internalDialog state based on changes to the dialog prop
        this.internalDialog = this.dialog;
      },
    },
    customerData: {
      handler(newValue) {
        // Update userData when customerData prop changes
        this.userData = newValue;
      },
      immediate: true, // Trigger the handler immediately on component mount
    },
  },
};
</script>
