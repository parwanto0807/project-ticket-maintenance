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
    asset: Asset; // ✅ Perbaiki di sini, sebelumnya mungkin hanya assetId
    qrCodeUrl: string;
}

const LABEL_WIDTH = 55 * 2.8346; // ≈ 156pt
const LABEL_HEIGHT = 25 * 2.8346; // ≈ 71pt

const styles = StyleSheet.create({
    page: {
        width: LABEL_WIDTH,
        height: LABEL_HEIGHT,
        padding: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid black",
    },
    section: {
        marginLeft: "auto",
        marginRight: "auto",
        padding: 2,
        border: "1px solid black",
        width: "50mm",
        height: "20mm",
        display: "flex",
        flexDirection: "row", // ✅ Susun QR Code & teks sejajar
        alignItems: "center", // ✅ Posisikan elemen sejajar vertikal
        justifyContent: "flex-start", // ✅ QR Code mepet ke kiri
    },
    qrCode: {
        width: "15mm",
        height: "15mm",
    },
    textContainer: {
        display: "flex",
        flexDirection: "column",
        marginLeft: 5, // ✅ Beri jarak antara QR Code dan teks
        maxWidth: "30mm",
    },
    assetNumber: {
        fontSize: 10,
        textAlign: "center",
        fontWeight: "bold", // ✅ Biar lebih jelas
        maxWidth: "30mm", // ✅ Membatasi teks utama
        textWrap: "wrap", // ✅ Memastikan teks turun ke bawah jika panjang
        overflow: "hidden", // ✅ Mencegah teks keluar dari batas
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
            <View style={styles.section}>
                {/* ✅ QR Code di kiri */}
                <Image src={qrCodeUrl} style={styles.qrCode} />

                {/* ✅ Teks di samping QR Code */}
                <View style={styles.textContainer}>
                    <Text style={styles.assetNumber}>{asset.assetNumber}</Text>
                    <Text style={styles.text}>{asset.product.part_number}</Text>
                    <Text style={styles.text}>Location: {asset.location || "Unknown"}</Text>
                    <Text style={styles.text}>User: {asset.employee.name || "-"}</Text>
                    {/* <Text style={styles.text}>Cost: {asset.purchaseCost ? `$${asset.purchaseCost}` : "-"}</Text> */}
                </View>
            </View>
        </Page>
    </Document>
);


export default LabelPDF;
