import { db } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

const ITEMS_PER_PAGE_CUSTOMER = 10;

export async function fetchDeliveryById(id: string) {
    noStore();
    try {
        const deliveryFindById = await db.delivery_Customer.findMany({
            where: {
                idCustomer: id
            }
        });
        //console.log(deliveryById);
        return deliveryFindById;
    } catch (error) {
        console.error("Error fetching pic data:", error);
        throw new Error("Failed to fetch pic data");
    }
}

export async function fetchDelivery() {
    noStore();
    try {
        const deliveryFind = await db.delivery_Customer.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        //console.log(deliveryById);
        return deliveryFind;
    } catch (error) {
        console.error("Error fetching pic data:", error);
        throw new Error("Failed to fetch pic data");
    }
}

export async function fetchDeliveryByUserId(id: string) {
    noStore();
    try {
        const deliveryFindById = await db.delivery_Customer.findUnique({
            where: {
                id: id
            }
        });
        //console.log(deliveryById);
        return deliveryFindById;
    } catch (error) {
        console.error("Error fetching pic data:", error);
        throw new Error("Failed to fetch pic data");
    }
}

export async function fetchPicById(id: string) {
    noStore();
    try {
        const picFindById = await db.pic_Customer.findMany({
            where: {
                idCustomer: id
            }
        });
        //console.log(picFindById);
        return picFindById;
    } catch (error) {
        console.error("Error fetching pic data:", error);
        throw new Error("Failed to fetch pic data");
    }
}
export async function fetchPicData() {
    noStore();
    try {
        const picFindById = await db.pic_Customer.findMany({
        });
        //console.log(picFindById);
        return picFindById;
    } catch (error) {
        console.error("Error fetching pic data:", error);
        throw new Error("Failed to fetch pic data");
    }
}

export const fetchCustomerById = async (id: string) => {
    noStore();
    try {
        const customerFindById = await db.customer.findUnique({
            where: { id }
        })
        return customerFindById;
    } catch  {
        console.error("Can't Find Data Customer")
    }
}

export async function fetchCustomer(query: string, currentPage: number) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_CUSTOMER
    try {
        const customersFind = await db.customer.findMany({
            skip: offset,
            take: ITEMS_PER_PAGE_CUSTOMER,
            include: {
                pic_customer: true,
                delivery_customer: true,
            },
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive', // Case-insensitive search
                        }
                    },
                    {
                        address: {
                            contains: query,
                            mode: 'insensitive', // Case-insensitive search
                        }
                    },
                ]
            },
            orderBy: {
                updatedAt: "desc"
            }
        });
        // console.log(customersFind)
        return customersFind;
    } catch {
        console.error("Can't Find Data Customer")
    }

}
export async function fetchCustomerData() {
    noStore();
    try {
        const customersFind = await db.customer.findMany({
            include: {
                pic_customer: true,
                delivery_customer:true
            },
            orderBy: {
                name: "asc"
            }
        });
        // console.log(customersFind)
        return customersFind;
    } catch  {
        console.error("Can't Find Data Customer")
    }

}

export async function fetchCustomersPages(query: string) {
    noStore();
    try {
        const customersFindPages = await db.customer.count({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive', // Case-insensitive search
                        }
                    },
                    {
                        address: {
                            contains: query,
                            mode: 'insensitive', // Case-insensitive search
                        }
                    },
                ]
            }
        });

        const totalPagesCustomers = Math.ceil(Number(customersFindPages) / ITEMS_PER_PAGE_CUSTOMER)
        //console.log(customersFindPages)
        return totalPagesCustomers;
    } catch {
        console.error('Error Fetching Customers')
        throw new Error('Filed to Fetching Customers')
    }
}


