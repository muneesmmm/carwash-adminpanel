<template>
  <v-row justify="center">
    <v-dialog
      v-model="internalDialog"
      @click:outside="cancelCustomer"
      max-width="600px"
    >
      <v-card>
        <v-form ref="form" v-model="valid">
          <v-card-title class="font-weight-bold text-h3">
            Edit Plan</v-card-title
          >
          <v-card-text>
            <v-text-field
              v-if="plan"
              disabled  
              v-model="plan.name"
              label="Plan Name"
            ></v-text-field>
            <v-text-field
              v-if="plan"
              v-model="plan.duration"
              label="Plan Duration (Days)"
            ></v-text-field>
            <v-text-field
              v-if="plan"
              v-model="plan.totalWashes"
              label="Total Washes"
            ></v-text-field>
            <v-text-field
              v-if="plan"
              v-model="plan.totalInteriors"
              label="Total Interiors"
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" @click="cancelCustomer">Close</v-btn>
            <v-btn color="primary" @click="updateCustomer">Update</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: Boolean,
    selectedPlan: Object,
  },
  data() {
    return {
      valid: true,
      internalDialog: this.dialog,
      plan: this.selectedUser,
    };
  },
  watch: {
    dialog: {
      handler() {
        // Update internalDialog state based on changes to the dialog prop
        this.internalDialog = this.dialog;
      },
    },
    selectedPlan: {
      handler() {
        // Update internalDialog state based on changes to the dialog prop
        this.plan = this.selectedPlan;
      },
    },
  },
  methods: {
    updateCustomer() {
      if (this.$refs.form.validate()) {
        this.plan.duration = parseInt(this.plan.duration) 
        this.plan.totalWashes = parseInt(this.plan.totalWashes) 
        this.plan.totalInteriors = parseInt(this.plan.totalInteriors) 
        this.$emit("save", this.plan);
        this.$refs.form.reset();
      }
    },
    cancelCustomer() {
      // Emit an event to notify the parent component about the cancel action
      this.$emit("cancel");
    },
    calculateDuration(numberOfDays) {
      if (numberOfDays !== null && !isNaN(numberOfDays)) {
        const diffMonths = Math.floor(numberOfDays / 30); // Assuming a month has 30 days
        this.plan.duration = diffMonths;
      } else {
        this.plan.duration = null;
      }
    }
  },
};
</script>
