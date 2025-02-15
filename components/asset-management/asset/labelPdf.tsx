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
        part_number: string
    }
    employee: {
        name: string
    }
}

interface LabelPDFProps {
    asset: Asset; 
    qrCodeUrl: string;
}

const LABEL_WIDTH = 60 * 2.8346; // ≈ 156pt
const LABEL_HEIGHT = 30 * 2.8346; // ≈ 71pt

const styles = StyleSheet.create({
    page: {
        width: LABEL_WIDTH,
        height: LABEL_HEIGHT,
        padding: 2, // Kurangi padding agar tidak overflow
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid black",
        position: "relative", // Pastikan elemen tetap di dalam satu halaman
    },
    headerText: {
        fontSize: 7, // Kecilkan font agar muat
        fontWeight: "bold",
        textAlign: "center",
        width: "100%",
        position: "absolute", // Pastikan tetap di dalam halaman
        top: 2, // Geser ke atas agar tidak bentrok
    },
    section: {
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: 2,
        paddingRight: 2,
        paddingBottom: 2,
        paddingTop:0,
        border: "1px solid black",
        width: "55mm",
        height: "24mm",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 5, // Beri jarak agar teks atas tidak menambah halaman
    },
    qrCode: {
        width: "20mm",
        height: "20mm",
    },
    textContainer: {
        display: "flex",
        flexDirection: "column",
        marginLeft: 3,
        maxWidth: "35mm",
    },
    assetNumber: {
        fontSize: 8,
        textAlign: "center",
        fontWeight: "bold",
        maxWidth: "54mm",
        textWrap: "wrap",
        overflow: "hidden",
    },
    text: {
        fontSize: 8,
        textAlign: "left",
        textWrap: "wrap",
        overflow: "hidden",
    },
});

const LabelPDF: React.FC<LabelPDFProps> = ({ asset, qrCodeUrl }: LabelPDFProps) => (
    <Document>
        <Page size={{ width: LABEL_WIDTH, height: LABEL_HEIGHT }} style={styles.page}>
            
            {/* ✅ Header tidak menambah halaman */}
            <Text style={styles.headerText}>Asset milik PT. Grafindo Mitrasemesta</Text>

            <View style={styles.section}>
                <Image src={qrCodeUrl} style={styles.qrCode} />

                <View style={styles.textContainer}>
                    <Text style={styles.assetNumber}>{asset.assetNumber}</Text>
                    <Text style={styles.text}>{asset.product.part_number}</Text>
                    <Text style={styles.text}>{asset.location || "Unknown"}</Text>
                    <Text style={styles.text}>User: {asset.employee.name || "-"}</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default LabelPDF;
