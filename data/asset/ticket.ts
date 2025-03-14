import { db } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { startOfMonth, subMonths } from 'date-fns';

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

export const fetchTicketListHistoryTechnician = async (query: string, currentPage: number, email: string) => {
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
                    { technician: { email: email } },
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

export const fetchTicketListTechnician = async (query: string, currentPage: number, email: string) => {
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
                    { technician: { email: email } },
                    {
                        OR: [
                            { ticketNumber: { contains: query, mode: 'insensitive' } },
                            { analisaDescription: { contains: query, mode: 'insensitive' } },
                            { troubleUser: { contains: query, mode: 'insensitive' } },
                            { actionDescription: { contains: query, mode: 'insensitive' } },
                        ],
                    },
                    {
                        NOT: { status: { in: ["Pending", "Completed", "Canceled"] } }
                    }
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

export const fetchTicketAnalist = async () => {
    noStore()
    try {
        const ticketFind = await db.ticketMaintenance.findMany({
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
        })
        return ticketFind;
    } catch (error) {
        console.error("Filed fetch ticket list", error)
        throw new Error("Files fetch ticket list")
    }
}

export const fetchTicketAnalistAll = async () => {
    noStore();
    try {
        const ticketFind = await db.ticketMaintenance.findMany({
            include: {
                asset: {
                    include: {
                        product: {
                            include: {
                                group: true,
                                jenisproduct: true,
                                kategoriproduct: true
                            }
                        }
                    }
                },
                employee: {
                    include: {
                        department: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            },
        });

        // Hitung tanggal mulai dari 12 bulan terakhir
        const startDate = startOfMonth(subMonths(new Date(), 11));

        // Filter tiket yang berada dalam rentang 12 bulan terakhir
        const filteredTickets = ticketFind.filter(ticket =>
            new Date(ticket.createdAt) >= startDate
        );

        // 1️⃣ Grouping dan counting berdasarkan group.name
        const groupCounts = filteredTickets.reduce((acc: { [key: string]: { total: number; latestCreatedAt: Date } }, ticket) => {
            const groupName = ticket.asset?.product?.group?.name || "Unknown Group";
            const ticketDate = new Date(ticket.createdAt);

            if (!acc[groupName]) {
                acc[groupName] = { total: 0, latestCreatedAt: ticketDate };
            }

            acc[groupName].total += 1;

            if (ticketDate > acc[groupName].latestCreatedAt) {
                acc[groupName].latestCreatedAt = ticketDate;
            }

            return acc;
        }, {});

        // 2️⃣ Grouping dan counting berdasarkan jenisProduct.name
        const jenisProductCounts = filteredTickets.reduce((acc: { [key: string]: { total: number; latestCreatedAt: Date } }, ticket) => {
            const jenisProductName = ticket.asset?.product?.jenisproduct?.name || "Unknown Product";
            const ticketDate = new Date(ticket.createdAt);

            if (!acc[jenisProductName]) {
                acc[jenisProductName] = { total: 0, latestCreatedAt: ticketDate };
            }

            acc[jenisProductName].total += 1;

            if (ticketDate > acc[jenisProductName].latestCreatedAt) {
                acc[jenisProductName].latestCreatedAt = ticketDate;
            }

            return acc;
        }, {});

        // 3️⃣ Grouping dan counting berdasarkan group.name
        const categoryCounts = filteredTickets.reduce((acc: { [key: string]: { total: number; latestCreatedAt: Date } }, ticket) => {
            const groupName = ticket.asset?.product?.kategoriproduct?.name || "Unknown Group";
            const ticketDate = new Date(ticket.createdAt);

            if (!acc[groupName]) {
                acc[groupName] = { total: 0, latestCreatedAt: ticketDate };
            }

            acc[groupName].total += 1;

            if (ticketDate > acc[groupName].latestCreatedAt) {
                acc[groupName].latestCreatedAt = ticketDate;
            }

            return acc;
        }, {});

        // 4️⃣ Grouping dan counting berdasarkan group.name
        const departmentCounts = filteredTickets.reduce((acc: { [key: string]: { total: number; latestCreatedAt: Date } }, ticket) => {
            const departmentName = ticket.employee?.department?.dept_name || "Unknown Department";
            const ticketDate = new Date(ticket.createdAt);

            if (!acc[departmentName]) {
                acc[departmentName] = { total: 0, latestCreatedAt: ticketDate };
            }

            acc[departmentName].total += 1;

            if (ticketDate > acc[departmentName].latestCreatedAt) {
                acc[departmentName].latestCreatedAt = ticketDate;
            }

            return acc;
        }, {});

        // Ubah hasil ke format array untuk frontend
        const result = {
            groupData: Object.entries(groupCounts).map(([name, data]) => ({
                name,
                total: data.total,
                createdAt: data.latestCreatedAt
            })),
            jenisProductData: Object.entries(jenisProductCounts).map(([name, data]) => ({
                name,
                total: data.total,
                createdAt: data.latestCreatedAt
            })),
            cetgoriProductData: Object.entries(categoryCounts).map(([name, data]) => ({
                name,
                total: data.total,
                createdAt: data.latestCreatedAt
            })),
            departmentTicketData: Object.entries(departmentCounts).map(([name, data]) => ({
                name,
                total: data.total,
                createdAt: data.latestCreatedAt
            }))
        };

        return result;
    } catch (error) {
        console.error("Failed to fetch ticket list", error);
        throw new Error("Failed to fetch ticket list");
    }
};

export const fetchTicketAnalistDepartment = async () => {
    noStore();
    try {
        const ticketFind = await db.ticketMaintenance.findMany({
            include: {
                employee: {
                    include: {
                        department: true // Include department untuk mendapatkan dept_name
                    }
                },
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
        });

        // Hitung tanggal mulai dari 12 bulan terakhir
        const startDate = startOfMonth(subMonths(new Date(), 11));

        // Filter tiket yang berada dalam rentang 12 bulan terakhir
        const filteredTickets = ticketFind.filter(ticket => 
            new Date(ticket.createdAt) >= startDate
        );

        // Grouping dan counting berdasarkan department.dept_name dan employee.name
        const departmentCounts = filteredTickets.reduce((acc: { 
            [key: string]: { total: number; latestCreatedAt: Date; employees: { name: string; ticketCount: number }[] } 
        }, ticket) => {
            const deptName = ticket.employee?.department?.dept_name || "Unknown Department";
            const employeeName = ticket.employee?.name || "Unknown Employee";
            const ticketDate = new Date(ticket.createdAt);

            // Jika departemen belum ada di accumulator, inisialisasi
            if (!acc[deptName]) {
                acc[deptName] = { total: 0, latestCreatedAt: ticketDate, employees: [] };
            }

            acc[deptName].total += 1;

            // Cek apakah employee sudah ada di daftar
            const existingEmployee = acc[deptName].employees.find(e => e.name === employeeName);
            if (existingEmployee) {
                existingEmployee.ticketCount += 1;
            } else {
                acc[deptName].employees.push({ name: employeeName, ticketCount: 1 });
            }

            // Update latestCreatedAt jika tiket lebih baru
            if (ticketDate > acc[deptName].latestCreatedAt) {
                acc[deptName].latestCreatedAt = ticketDate;
            }

            return acc;
        }, {});

        // Ubah hasil ke format array agar lebih mudah diolah di frontend
        const result = Object.entries(departmentCounts).map(([dept_name, data]) => ({
            dept_name,
            total: data.total,
            createdAt: data.latestCreatedAt, // Tambahkan createdAt untuk tracking kapan tiket terbaru dibuat
            employees: data.employees // Menampilkan daftar karyawan dan jumlah tiket mereka
        }));

        return result;
    } catch (error) {
        console.error("Failed to fetch ticket list", error);
        throw new Error("Failed to fetch ticket list");
    }
};
