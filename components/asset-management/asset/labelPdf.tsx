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
}

interface LabelPDFProps {
  asset: Asset;
  qrCodeUrl: string;
}

// Konversi 78 mm × 30 mm ke poin (1 mm ≈ 2.8346 pt):
const LABEL_WIDTH = 78 * 2.8346;  // ~221 pt
const LABEL_HEIGHT = 30 * 2.8346; // ~85 pt

const styles = StyleSheet.create({
  page: {
    width: LABEL_WIDTH,
    height: LABEL_HEIGHT,
    padding: 4,
    borderRadius: 4,
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  // Header dengan posisi absolut di atas
  header: {
    position: "absolute",
    top: 3,
    left: 3,
    right: 3,
    backgroundColor: "#0a74da",
    color: "#fff",
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 2,
    borderRadius: 3,
  },
  content: {
    // Area utama untuk QR dan teks
    marginTop: 8, // Jeda dari header
    width: "100%",
    paddingHorizontal: 4,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  qrCodeContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qrCode: {
    width: 45,
    height: 45,
  },
  textContainer: {
    marginLeft: 8,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
  },
  assetNumber: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 1,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 2,
  },
  product: {
    fontSize: 7,
    color: "#555",
    marginBottom: 1,
  },
  location: {
    fontSize: 7,
    color: "#555",
    marginBottom: 1,
  },
  employee: {
    fontSize: 7,
    color: "#555",
  },
});

const LabelPDF: React.FC<LabelPDFProps> = ({ asset, qrCodeUrl }) => (
  <Document>
    <Page size={{ width: LABEL_WIDTH, height: LABEL_HEIGHT }} style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>Asset milik PT. Grafindo Mitrasemesta</Text>

      <View style={styles.content}>
        {/* QR Code */}
        <View style={styles.qrCodeContainer}>
          <Image src={qrCodeUrl} style={styles.qrCode} />
        </View>

        {/* Informasi Asset */}
        <View style={styles.textContainer}>
          <Text style={styles.assetNumber}>{asset.assetNumber}</Text>
          <View style={styles.divider} />
          <Text style={styles.product}>{asset.product.part_number}</Text>
          <Text style={styles.location}>{asset.location || "Unknown"}</Text>
          <Text style={styles.employee}>User: {asset.employee.name || "-"}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default LabelPDF;



// /* eslint-disable jsx-a11y/alt-text */

// import React from "react";
// import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

// interface Asset {
//     id: string;
//     assetNumber: string;
//     status: string;
//     location?: string;
//     purchaseDate?: string;
//     purchaseCost?: number;
//     residualValue?: number;
//     usefulLife?: number;
//     assetTypeId: string;
//     departmentId: string;
//     productId: string;
//     employeeId?: string;
//     assetImage1?: string;
//     product: {
//         part_number: string
//     }
//     employee: {
//         name: string
//     }
// }

// interface LabelPDFProps {
//     asset: Asset; 
//     qrCodeUrl: string;
// }

// const LABEL_WIDTH = 60 * 2.8346; // ≈ 156pt
// const LABEL_HEIGHT = 30 * 2.8346; // ≈ 71pt

// const styles = StyleSheet.create({
//     page: {
//         width: LABEL_WIDTH,
//         height: LABEL_HEIGHT,
//         padding: 2, // Kurangi padding agar tidak overflow
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         border: "1px solid black",
//         position: "relative", // Pastikan elemen tetap di dalam satu halaman
//     },
//     headerText: {
//         fontSize: 7, // Kecilkan font agar muat
//         fontWeight: "bold",
//         textAlign: "center",
//         width: "100%",
//         position: "absolute", // Pastikan tetap di dalam halaman
//         top: 2, // Geser ke atas agar tidak bentrok
//     },
//     section: {
//         marginLeft: "auto",
//         marginRight: "auto",
//         paddingLeft: 2,
//         paddingRight: 2,
//         paddingBottom: 2,
//         paddingTop:0,
//         border: "1px solid black",
//         width: "55mm",
//         height: "24mm",
//         display: "flex",
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "flex-start",
//         marginTop: 5, // Beri jarak agar teks atas tidak menambah halaman
//     },
//     qrCode: {
//         width: "20mm",
//         height: "20mm",
//     },
//     textContainer: {
//         display: "flex",
//         flexDirection: "column",
//         marginLeft: 3,
//         maxWidth: "35mm",
//     },
//     assetNumber: {
//         fontSize: 8,
//         textAlign: "center",
//         fontWeight: "bold",
//         maxWidth: "54mm",
//         textWrap: "wrap",
//         overflow: "hidden",
//     },
//     text: {
//         fontSize: 8,
//         textAlign: "left",
//         textWrap: "wrap",
//         overflow: "hidden",
//     },
// });

// const LabelPDF: React.FC<LabelPDFProps> = ({ asset, qrCodeUrl }: LabelPDFProps) => (
//     <Document>
//         <Page size={{ width: LABEL_WIDTH, height: LABEL_HEIGHT }} style={styles.page}>
            
//             {/* ✅ Header tidak menambah halaman */}
//             <Text style={styles.headerText}>Asset milik PT. Grafindo Mitrasemesta</Text>

//             <View style={styles.section}>
//                 <Image src={qrCodeUrl} style={styles.qrCode} />

//                 <View style={styles.textContainer}>
//                     <Text style={styles.assetNumber}>{asset.assetNumber}</Text>
//                     <Text style={styles.text}>{asset.product.part_number}</Text>
//                     <Text style={styles.text}>{asset.location || "Unknown"}</Text>
//                     <Text style={styles.text}>User: {asset.employee.name || "-"}</Text>
//                 </View>
//             </View>
//         </Page>
//     </Document>
// );

// export default LabelPDF;
