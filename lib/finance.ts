export type DepreciationStatusCategory =
    | "habis"       // Masa manfaat habis
    | "kritis"      // Sisa < 3 bulan
    | "waspada"     // Sisa 3-6 bulan
    | "normal"      // Sisa > 6 bulan
    | "data_error"; // Perlu validasi (data tidak lengkap/inkonsisten)

export interface DepreciationResult {
    purchaseCost: number;
    residualValue: number;
    usefulLife: number; // in months
    monthsElapsed: number;
    monthsRemaining: number; // usefulLife - monthsElapsed (bisa negatif jika expired)
    totalMonths: number;
    monthlyDepreciation: number;
    accumulatedDepreciation: number;
    bookValue: number;
    percentRemaining: number;
    isExpired: boolean;
    isNearingEndOfLife: boolean;
    isValid: boolean;
    statusCategory: DepreciationStatusCategory;
}

export const FINANCE_CONSTANTS = {
    FALLBACK_TEXT: "N/A",
    MIN_VALUE: 0,
    ROUNDING_DECIMALS: 2,
};

/**
 * Calculates the straight-line depreciation for an asset.
 * 
 * Formula:
 * Annual Depreciation = (Purchase Cost - Residual Value) / Useful Life
 * Monthly Depreciation = Annual Depreciation / 12
 * Accumulated Depreciation = Monthly Depreciation * Months Elapsed
 * Book Value = Purchase Cost - Accumulated Depreciation
 */
export function calculateAssetDepreciation(
    purchaseCost: number | null | undefined,
    purchaseDate: Date | string | null | undefined,
    usefulLife: number | null | undefined, // in months
    residualValue: number | null | undefined = 0
): DepreciationResult {
    const result: DepreciationResult = {
        purchaseCost: purchaseCost || 0,
        residualValue: residualValue || 0,
        usefulLife: usefulLife || 0,
        monthsElapsed: 0,
        monthsRemaining: usefulLife || 0,
        totalMonths: usefulLife || 0,
        monthlyDepreciation: 0,
        accumulatedDepreciation: 0,
        bookValue: purchaseCost || 0,
        percentRemaining: 100,
        isExpired: false,
        isNearingEndOfLife: false,
        isValid: false,
        statusCategory: "data_error",
    };

    // 1. Validation: Ensure we have the minimum requirements
    if (!purchaseCost || !purchaseDate || !usefulLife || usefulLife <= 0) {
        if (purchaseCost) result.bookValue = purchaseCost;
        result.statusCategory = "data_error";
        return result;
    }

    result.isValid = true;

    // Improved date parsing to be more robust
    const pDate = typeof purchaseDate === 'string' ? new Date(purchaseDate) : purchaseDate;
    const now = new Date();

    if (isNaN(pDate.getTime())) {
        result.isValid = false;
        result.statusCategory = "data_error";
        return result;
    }

    // 2. Handle future dates
    if (pDate > now) {
        result.statusCategory = "normal";
        return result; // Future asset: monthsElapsed = 0, full bookValue
    }

    // 3. Calculate months elapsed
    const yearsDiff = now.getFullYear() - pDate.getFullYear();
    const monthsDiff = now.getMonth() - pDate.getMonth();
    let totalMonthsElapsed = (yearsDiff * 12) + monthsDiff;

    // Standard accounting usually counts full months.
    if (totalMonthsElapsed < 0) totalMonthsElapsed = 0;

    result.monthsElapsed = totalMonthsElapsed;

    // 4. Depreciation Calculation
    const totalDepreciableAmount = Math.max(0, result.purchaseCost - result.residualValue);
    const monthlyDepRate = totalDepreciableAmount / result.usefulLife;
    result.monthlyDepreciation = Number(monthlyDepRate.toFixed(FINANCE_CONSTANTS.ROUNDING_DECIMALS));

    const accumulated = Math.min(totalDepreciableAmount, monthlyDepRate * totalMonthsElapsed);
    result.accumulatedDepreciation = Number(accumulated.toFixed(FINANCE_CONSTANTS.ROUNDING_DECIMALS));

    // 5. Book Value Calculation
    const currentBookValue = Math.max(result.residualValue, result.purchaseCost - result.accumulatedDepreciation);
    result.bookValue = Number(currentBookValue.toFixed(FINANCE_CONSTANTS.ROUNDING_DECIMALS));

    // 6. Final state
    const monthsRemaining = result.usefulLife - totalMonthsElapsed;
    result.monthsRemaining = monthsRemaining;
    result.isExpired = totalMonthsElapsed >= result.usefulLife;
    result.isNearingEndOfLife = !result.isExpired && monthsRemaining <= 3 && monthsRemaining >= 0;

    if (result.purchaseCost > 0) {
        result.percentRemaining = Math.max(0, Math.min(100, (result.bookValue / result.purchaseCost) * 100));
    } else {
        result.percentRemaining = 0;
    }

    // Pastikan nilai buku tidak melebihi harga beli (data integrity)
    if (result.bookValue > result.purchaseCost) {
        result.bookValue = result.purchaseCost;
    }

    // Kategori status untuk UI: Habis / Kritis (<3 bln) / Waspada (3-6 bln) / Normal (>6 bln)
    if (result.isExpired) {
        result.statusCategory = "habis";
    } else if (monthsRemaining <= 0) {
        result.statusCategory = "habis";
    } else if (monthsRemaining <= 3) {
        result.statusCategory = "kritis";
    } else if (monthsRemaining <= 6) {
        result.statusCategory = "waspada";
    } else {
        result.statusCategory = "normal";
    }

    return result;
}

/**
 * Last day of the given month (year 1-9999, month 1-12). Exported for overview period filter.
 */
export function getEndOfMonth(year: number, month: number): Date {
    const d = new Date(year, month, 0); // day 0 of next month = last day of this month
    d.setHours(23, 59, 59, 999);
    return d;
}

/**
 * Calculates depreciation as of a specific date (e.g. end of a month).
 * Use this for "nilai buku / akumulasi sampai akhir bulan X".
 */
export function calculateAssetDepreciationAsOf(
    purchaseCost: number | null | undefined,
    purchaseDate: Date | string | null | undefined,
    usefulLife: number | null | undefined,
    residualValue: number | null | undefined = 0,
    asOfDate: Date
): DepreciationResult {
    const result: DepreciationResult = {
        purchaseCost: purchaseCost || 0,
        residualValue: residualValue || 0,
        usefulLife: usefulLife || 0,
        monthsElapsed: 0,
        monthsRemaining: usefulLife || 0,
        totalMonths: usefulLife || 0,
        monthlyDepreciation: 0,
        accumulatedDepreciation: 0,
        bookValue: purchaseCost || 0,
        percentRemaining: 100,
        isExpired: false,
        isNearingEndOfLife: false,
        isValid: false,
        statusCategory: "data_error",
    };

    if (!purchaseCost || !purchaseDate || !usefulLife || usefulLife <= 0) {
        if (purchaseCost) result.bookValue = purchaseCost;
        result.statusCategory = "data_error";
        return result;
    }

    result.isValid = true;
    const pDate = typeof purchaseDate === "string" ? new Date(purchaseDate) : purchaseDate;
    if (isNaN(pDate.getTime())) {
        result.isValid = false;
        result.statusCategory = "data_error";
        return result;
    }

    if (pDate > asOfDate) {
        result.statusCategory = "normal";
        return result;
    }

    const yearsDiff = asOfDate.getFullYear() - pDate.getFullYear();
    const monthsDiff = asOfDate.getMonth() - pDate.getMonth();
    let totalMonthsElapsed = yearsDiff * 12 + monthsDiff;
    if (totalMonthsElapsed < 0) totalMonthsElapsed = 0;

    result.monthsElapsed = totalMonthsElapsed;
    const totalDepreciableAmount = Math.max(0, result.purchaseCost - result.residualValue);
    const monthlyDepRate = totalDepreciableAmount / result.usefulLife;
    result.monthlyDepreciation = Number(monthlyDepRate.toFixed(FINANCE_CONSTANTS.ROUNDING_DECIMALS));

    const accumulated = Math.min(totalDepreciableAmount, monthlyDepRate * totalMonthsElapsed);
    result.accumulatedDepreciation = Number(accumulated.toFixed(FINANCE_CONSTANTS.ROUNDING_DECIMALS));

    const currentBookValue = Math.max(
        result.residualValue,
        result.purchaseCost - result.accumulatedDepreciation
    );
    result.bookValue = Number(currentBookValue.toFixed(FINANCE_CONSTANTS.ROUNDING_DECIMALS));

    const monthsRemaining = result.usefulLife - totalMonthsElapsed;
    result.monthsRemaining = monthsRemaining;
    result.isExpired = totalMonthsElapsed >= result.usefulLife;
    result.isNearingEndOfLife = !result.isExpired && monthsRemaining <= 3 && monthsRemaining >= 0;

    if (result.purchaseCost > 0) {
        result.percentRemaining = Math.max(
            0,
            Math.min(100, (result.bookValue / result.purchaseCost) * 100)
        );
    } else {
        result.percentRemaining = 0;
    }

    if (result.bookValue > result.purchaseCost) {
        result.bookValue = result.purchaseCost;
    }

    if (result.isExpired) {
        result.statusCategory = "habis";
    } else if (monthsRemaining <= 0) {
        result.statusCategory = "habis";
    } else if (monthsRemaining <= 3) {
        result.statusCategory = "kritis";
    } else if (monthsRemaining <= 6) {
        result.statusCategory = "waspada";
    } else {
        result.statusCategory = "normal";
    }

    return result;
}

/**
 * Returns the depreciation expense for a single calendar month.
 * year: full year (e.g. 2026), month: 1-12.
 * If the month is within the asset's useful life, returns monthlyDepreciation; otherwise 0.
 */
export function getMonthlyDepreciationExpense(
    purchaseCost: number | null | undefined,
    purchaseDate: Date | string | null | undefined,
    usefulLife: number | null | undefined,
    residualValue: number | null | undefined = 0,
    year: number,
    month: number // 1-12
): number {
    if (!purchaseCost || !purchaseDate || !usefulLife || usefulLife <= 0) return 0;
    const pDate = typeof purchaseDate === "string" ? new Date(purchaseDate) : purchaseDate;
    if (isNaN(pDate.getTime())) return 0;

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = getEndOfMonth(year, month);

    if (pDate > lastDayOfMonth) return 0; // Asset not yet purchased
    const endOfLife = new Date(pDate);
    endOfLife.setMonth(endOfLife.getMonth() + usefulLife);
    if (firstDayOfMonth > endOfLife) return 0; // Asset already fully depreciated

    const totalDepreciable = Math.max(0, purchaseCost - (residualValue || 0));
    const monthlyExpense = totalDepreciable / usefulLife;
    return Number(monthlyExpense.toFixed(FINANCE_CONSTANTS.ROUNDING_DECIMALS));
}
