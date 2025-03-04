/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

interface Asset {
  id: string;
  assetNumber: string;
  status: string;
  location?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  residualValue?: number;
  usefulLife?: number;
  assetTypeId: string;
  departmentId: string;
  productId: string;
  employeeId?: string;
  assetImage1?: string;
  product: {
    part_number: string;
  };
  employee: {
    name: string;
  };
  department: {
    dept_name: string;
  };
}

interface LabelPDFProps {
  asset: Asset;
  barcodeUrl: string;
}

const LABEL_WIDTH = 78 * 2.8346;  // 78 mm
const LABEL_HEIGHT = 60 * 2.8346; // 60 mm

const styles = StyleSheet.create({
  page: {
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    paddingTop: 5,
    padding: 10,
    borderRadius: 4,
    border: "1px solid #000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
    paddingBottom: 2,
  },
  barcodeContainer: {
    width: "100%",
    height: 20 * 2.3346, // sekitar 20 mm
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 2,
  },
  barcode: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 4,
  },
  textRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  textLabel: {
    fontSize: 8,
    width: "28%",
    fontWeight: "bold",
  },
  textValue: {
    fontSize: 8,
    width: "73%",
  },
  footer: {
    borderTopWidth: 0.5,
    borderTopColor: "#000",
    paddingTop: 2,
  },
  footerText: {
    fontSize: 7,
    textAlign: "left",
  },
});

const LabelPDF: React.FC<LabelPDFProps> = ({ asset, barcodeUrl }) => (
  <Document>
    <Page size={{ width: LABEL_WIDTH, height: LABEL_HEIGHT }} style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text>Asset milik PT. Grafindo Mitrasemesta</Text>
      </View>

      {/* Barcode 1D Full Lebar */}
      <View style={styles.barcodeContainer}>
        {barcodeUrl ? (
          <Image src={barcodeUrl} style={styles.barcode} />
        ) : (
          <Text style={{ fontSize: 8 }}>Barcode tidak tersedia</Text>
        )}
      </View>

      {/* Informasi Asset dengan tampilan kolom */}
      <View style={styles.textContainer}>
        <View style={styles.textRow}>
          <Text style={styles.textLabel}>Asset Number</Text>
          <Text style={styles.textValue}>: {asset.assetNumber}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.textLabel}>Asset Name</Text>
          <Text style={styles.textValue}>: {asset.product.part_number}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.textLabel}>Location</Text>
          <Text style={styles.textValue}>: {asset.location || "Unknown"}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.textLabel}>User</Text>
          <Text style={styles.textValue}>: {asset.employee.name || "-"}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.textLabel}>Dept</Text>
          <Text style={styles.textValue}>: {asset.department.dept_name || "-"}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>- Aset Perusahaan – Tidak Untuk Dijual</Text>
        <Text style={styles.footerText}>- Harap Kembalikan ke Perusahaan Jika Tidak Digunakan</Text>
      </View>
    </Page>
  </Document>
);

export default LabelPDF;


// /* eslint-disable jsx-a11y/alt-text */
// import React from "react";
// import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

// interface Asset {
//   id: string;
//   assetNumber: string;
//   status: string;
//   location?: string;
//   purchaseDate?: string;
//   purchaseCost?: number;
//   residualValue?: number;
//   usefulLife?: number;
//   assetTypeId: string;
//   departmentId: string;
//   productId: string;
//   employeeId?: string;
//   assetImage1?: string;
//   product: {
//     part_number: string;
//   };
//   employee: {
//     name: string;
//   };
//   department: {
//     dept_name: string;
//   };
// }

// interface LabelPDFProps {
//   asset: Asset;
//   qrCodeUrl: string;
// }

// const LABEL_WIDTH = 78 * 2.8346;  // 78 mm
// const LABEL_HEIGHT = 60 * 2.8346; // 60 mm

// const styles = StyleSheet.create({
//   page: {
//     width: LABEL_WIDTH,
//     height: LABEL_HEIGHT,
//     padding: 4,
//     borderRadius: 4,
//     border: "1px solid #000",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//   },
//   header: {
//     fontSize: 8,
//     fontWeight: "bold",
//     textAlign: "center",
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#000",
//     paddingBottom: 2,
//   },
//   content: {
//     flex: 1,
//     flexDirection: "row",
//     marginTop: 4,
//     marginBottom: 4,
//   },
//   qrCodeContainer: {
//     width: 60,
//     height: 60,
//     border: "1px solid #000",
//     borderRadius: 3,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   qrCode: {
//     width: 59,
//     height: 59,
//   },
//   textContainer: {
//     marginLeft: 8,
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-around",
//     flexGrow: 1,
//   },
//   assetNumber: {
//     fontSize: 9,
//     fontWeight: "bold",
//     marginBottom: 1,
//   },
//   product: {
//     fontSize: 8,
//     marginBottom: 1,
//   },
//   location: {
//     fontSize: 8,
//     marginBottom: 1,
//   },
//   employee: {
//     fontSize: 8,
//   },
//   footer: {
//     borderTopWidth: 0.5,
//     borderTopColor: "#000",
//     paddingTop: 2,
//   },
//   footerText: {
//     fontSize: 7,
//     textAlign: "center",
//   },
// });

// const LabelPDF: React.FC<LabelPDFProps> = ({ asset, qrCodeUrl }) => (
//   <Document>
//     <Page size={{ width: LABEL_WIDTH, height: LABEL_HEIGHT }} style={styles.page}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text>Asset milik PT. Grafindo Mitrasemesta</Text>
//       </View>

//       {/* Konten Utama: QR Code dan Detail Asset */}
//       <View style={styles.content}>
//         <View style={styles.qrCodeContainer}>
//           <Image src={qrCodeUrl} style={styles.qrCode} />
//         </View>
//         <View style={styles.textContainer}>
//           <Text style={styles.assetNumber}>{asset.assetNumber}</Text>
//           <Text style={styles.product}>{asset.product.part_number}</Text>
//           <Text style={styles.location}>{asset.location || "Unknown"}</Text>
//           <Text style={styles.employee}>User: {asset.employee.name || "-"}</Text>
//         </View>
//       </View>

//       {/* Footer: Menampilkan Dept dan ketentuan standar */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>
//           Dept: {asset.department.dept_name} - Ketentuan standar untuk asset perusahaan
//         </Text>
//       </View>
//     </Page>
//   </Document>
// );

// export default LabelPDF;
