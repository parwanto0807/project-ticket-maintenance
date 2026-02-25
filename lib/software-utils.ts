// Utility functions for software management
export const softwareUtils = {
    // Format license expiry date
    formatExpiryDate: (dateInput: Date | string | null | undefined): string => {
        if (!dateInput) return "Tidak ada tanggal";

        try {
            const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
            const now = new Date();
            const diffTime = date.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                return `Kadaluarsa ${Math.abs(diffDays)} hari yang lalu`;
            } else if (diffDays === 0) {
                return "Kadaluarsa hari ini";
            } else {
                return `${diffDays} hari lagi`;
            }
        } catch (error) {
            console.error("Error formatting expiry date:", error);
            return "Format tanggal tidak valid";
        }
    },

    // Get license status
    getLicenseStatus: (
        expiryDate: Date | string | null | undefined
    ): "active" | "expiring" | "expired" => {
        if (!expiryDate) return "active";

        try {
            const expiry =
                expiryDate instanceof Date ? expiryDate : new Date(expiryDate);
            const now = new Date();
            const diffTime = expiry.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) return "expired";
            if (diffDays <= 30) return "expiring";
            return "active";
        } catch (error) {
            console.error("Error calculating license status:", error);
            return "active";
        }
    },

    // Calculate expiry date from installation date
    calculateExpiryDate: (
        installDate: Date | string,
        defaultExpiryMonths?: number
    ): Date | null => {
        if (!defaultExpiryMonths) return null;

        try {
            const install =
                installDate instanceof Date ? installDate : new Date(installDate);
            install.setMonth(install.getMonth() + defaultExpiryMonths);
            return install;
        } catch (error) {
            console.error("Error calculating expiry date:", error);
            return null;
        }
    },

    // Get license status color
    getLicenseStatusColor: (
        status: "active" | "expiring" | "expired"
    ): string => {
        switch (status) {
            case "active":
                return "green";
            case "expiring":
                return "orange";
            case "expired":
                return "red";
            default:
                return "gray";
        }
    },

    // Convert Date to string for display
    formatDateForDisplay: (date: Date | null | undefined): string => {
        if (!date) return "-";
        return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    },

    // Convert Date to ISO string for forms
    formatDateForInput: (date: Date | null | undefined): string => {
        if (!date) return "";
        return date.toISOString().split("T")[0];
    },
};
