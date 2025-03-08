import { db } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

const ITEMS_PER_PAGE_TICKET = 15;
const ITEMS_PER_PAGE_TICKET_USER = 10;

export async function generateTicketNumber() {
    noStore();
    try {
        // Dapatkan tanggal saat ini
        const now = new Date();
        const year = String(now.getFullYear()).slice(-2); // Ambil 2 digit terakhir tahun
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Bulan (dari 1-12)

        // Cari tiket terakhir berdasarkan tahun & bulan yang sama
        const lastTicket = await db.ticketMaintenance.findFirst({
            where: {
                ticketNumber: {
                    startsWith: `T-${year}${month}`, // Cari yang formatnya sama
                },
            },
            orderBy: { countNumber: "desc" }, // Ambil nomor urut terbesar
            select: { countNumber: true },
        });

        console.log("Last Ticket:", lastTicket);

        // Jika ada tiket sebelumnya, tingkatkan nomornya
        const newIdNumber = lastTicket ? lastTicket.countNumber + 1 : 1;

        // Format nomor tiket (misal: T-250200001)
        const newTicketNumber = `T-${year}${month}${String(newIdNumber).padStart(4, "0")}`;

        return { ticketNumber: newTicketNumber, countNumber: newIdNumber };
    } catch (error) {
        console.error("Failed to generate ticket number", error);
        throw new Error("Failed to generate ticket number");
    }
}
export const fetchTicketListAssign = async (query: string, currentPage: number) => {
    noStore()
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_TICKET;
    try {
        const ticketFind = await db.ticketMaintenance.findMany({
            skip: offset,
            take: ITEMS_PER_PAGE_TICKET,
            include: {
                employee: true,
                technician: true,
                asset: {
                    include: {
                        product: true
                    }
                },
            },
            orderBy: {
                updatedAt: 'desc'
            },
            where: {
                AND: [
                    {
                        OR: [
                            { ticketNumber: { contains: query, mode: 'insensitive' } },
                            { analisaDescription: { contains: query, mode: 'insensitive' } },
                            { troubleUser: { contains: query, mode: 'insensitive' } },
                            { actionDescription: { contains: query, mode: 'insensitive' } },
                        ]
                    },
                    {
                        NOT: { status: { in: ["Completed", "Canceled"] } }
                    }
                ]
            }
        })
        return ticketFind;
    } catch (error) {
        console.error("Filed fetch ticket list", error)
        throw new Error("Files fetch ticket list")
    }
}

export const fetchTicketListSchedule = async (query: string, currentPage: number) => {
    noStore()
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_TICKET;
    try {
        const ticketFind = await db.ticketMaintenance.findMany({
            skip: offset,
            take: ITEMS_PER_PAGE_TICKET,
            include: {
                employee: true,
                technician: true,
                asset: {
                    include: {
                        product: true
                    }
                },
            },
            orderBy: {
                updatedAt: 'desc'
            },
            where: {
                AND: [
                    {
                        OR: [
                            { ticketNumber: { contains: query, mode: 'insensitive' } },
                            { analisaDescription: { contains: query, mode: 'insensitive' } },
                            { troubleUser: { contains: query, mode: 'insensitive' } },
                            { actionDescription: { contains: query, mode: 'insensitive' } },
                        ]
                    },
                    {
                        NOT: { status: { in: ["Pending", "Completed", "Canceled"] } }
                    }
                ]
            }
        })
        return ticketFind;
    } catch (error) {
        console.error("Filed fetch ticket list", error)
        throw new Error("Files fetch ticket list")
    }
}
export const fetchTicketListHistory = async (query: string, currentPage: number) => {
    noStore()
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_TICKET;
    try {
        const ticketFind = await db.ticketMaintenance.findMany({
            skip: offset,
            take: ITEMS_PER_PAGE_TICKET,
            include: {
                employee: true,
                technician: true,
                asset: {
                    include: {
                        product: true
                    }
                },
            },
            orderBy: {
                updatedAt: 'desc'
            },
            where: {
                AND: [
                    {
                        OR: [
                            { ticketNumber: { contains: query, mode: 'insensitive' } },
                            { analisaDescription: { contains: query, mode: 'insensitive' } },
                            { troubleUser: { contains: query, mode: 'insensitive' } },
                            { actionDescription: { contains: query, mode: 'insensitive' } },
                        ]
                    },
                    {
                        NOT: { status: { in: ["Pending", "Assigned", "In_Progress"] } }
                    }
                ]
            }
        })
        return ticketFind;
    } catch (error) {
        console.error("Filed fetch ticket list", error)
        throw new Error("Files fetch ticket list")
    }
}

export const fetchTicketList = async (query: string, currentPage: number, email: string) => {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_TICKET_USER;
    try {
        const ticketFind = await db.ticketMaintenance.findMany({
            skip: offset,
            take: ITEMS_PER_PAGE_TICKET_USER,
            include: {
                employee: true,
                technician: true,
                asset: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
            where: {
                AND: [
                    { employee: { email: email } },
                    {
                        OR: [
                            { ticketNumber: { contains: query, mode: 'insensitive' } },
                            { analisaDescription: { contains: query, mode: 'insensitive' } },
                            { troubleUser: { contains: query, mode: 'insensitive' } },
                            { actionDescription: { contains: query, mode: 'insensitive' } },
                        ],
                    },
                ],
            },
        });
        return ticketFind;
    } catch (error) {
        console.error("Failed fetch ticket list", error);
        throw new Error("Failed fetch ticket list");
    }
}

export const fetchTicketListPagesUser = async (query: string) => {
    noStore();

    try {
        const ticketCount = await db.ticketMaintenance.count({
            where: {
                OR: [

                    { ticketNumber: { contains: query, mode: 'insensitive' } },
                    { analisaDescription: { contains: query, mode: 'insensitive' } },
                    { troubleUser: { contains: query, mode: 'insensitive' } },
                    { actionDescription: { contains: query, mode: 'insensitive' } },
                ]
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        // const totalPagesTicket = Math.ceil(ticketCount / ITEMS_PER_PAGE_TICKET);
        const totalPagesTicket = Math.min(1, Math.ceil(ticketCount / ITEMS_PER_PAGE_TICKET));
        return totalPagesTicket;
    } catch (error) {
        console.error('Error fetching ticket', error)
        throw new Error('Error fetching ticket');
    }
}

export const fetchTicketListPages = async (query: string) => {
    noStore();

    try {
        const ticketCount = await db.ticketMaintenance.count({
            where: {
                OR: [

                    { ticketNumber: { contains: query, mode: 'insensitive' } },
                    { analisaDescription: { contains: query, mode: 'insensitive' } },
                    { troubleUser: { contains: query, mode: 'insensitive' } },
                    { actionDescription: { contains: query, mode: 'insensitive' } },
                ]
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });
        const totalPagesTicket = Math.ceil(ticketCount / ITEMS_PER_PAGE_TICKET);
        return totalPagesTicket;
    } catch (error) {
        console.error('Error fetching ticket', error)
        throw new Error('Error fetching ticket');
    }
}

