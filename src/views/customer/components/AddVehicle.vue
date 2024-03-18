<template>
  <v-row justify="center">
    <v-dialog
      v-model="internalDialog"
      @click:outside="closeDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title class="font-weight-bold text-h3">
          Vehicle Details</v-card-title
        >
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="vehicle.vehicleNumber"
              label="Vehicle Number"
              :rules="[rules.required]"
            ></v-text-field>
            <v-select
              :items="['sedan', 'suv']"
              v-model="vehicle.type"
              label="Type"
              :rules="[rules.required]"
            ></v-select>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn color="red" @click="closeDialog">Close</v-btn>
          <v-btn color="primary" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: Boolean,
  },
  data() {
    return {
      valid: false,
      rules: {
        required: (value) => !!value || "Field is required.",
      },
      vehicle: {
        type:'',
        vehicleNumber:''
      },
      internalDialog: false,
    };
  },
  methods: {
    closeDialog() {
      // Emit an event to notify the parent component about the cancel action
      this.$emit("cancel");
    },
    save() {
      if (this.$refs.form.validate()) {
        this.$emit("save", this.vehicle);
        this.$refs.form.reset();
      }
    },
  },
  watch: {
    dialog: {
      handler() {
        // Update internalDialog state based on changes to the dialog prop
        this.internalDialog = this.dialog;
      },
    },
  },
};
</script>
