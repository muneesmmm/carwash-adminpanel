<template>
  <v-card>
    <!-- Invoice content goes here -->
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h1>Invoice</h1>
            <!-- Display dynamic invoice details here -->
            <p>Customer Name: {{ customerName }}</p>
            <p>Date: {{ currentDate }}</p>
            <p>Package: {{ packageName }}</p>
            <!-- Other invoice details -->
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <!-- Button to share invoice through WhatsApp -->
    <v-card-actions>
      <v-btn color="primary" @click="generateAndSharePDF"
        >Share via WhatsApp</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
  
  <script>
import jsPDF from "jspdf";

export default {
  data() {
    return {
      customerName: "John Doe",
      currentDate: new Date().toLocaleDateString(),
      packageName: "Gold Package",
      // Other dynamic data...
    };
  },
  methods: {
    generateAndSharePDF() {
  // Create a new jsPDF instance
  const pdf = new jsPDF();

  // Add content to the PDF
  pdf.text('Invoice', 10, 10);
  pdf.text(`Customer Name: ${this.customerName}`, 10, 20);
  pdf.text(`Date: ${this.currentDate}`, 10, 30);
  pdf.text(`Package: ${this.packageName}`, 10, 40);
  // Add other invoice details...

  // Output the PDF as a Base64 string
  const pdfBase64 = pdf.output('datauristring');

  // Construct WhatsApp share link with PDF data and recipient number
  const recipientNumber = '9645732562';
  const whatsappLink = `https://wa.me/${recipientNumber}?text=Invoice%3A%20${encodeURIComponent(pdfBase64)}`;

  // Open WhatsApp with the pre-filled PDF attached
  window.open(whatsappLink, '_blank');
}
  },
};
</script>
  