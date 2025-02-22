import { db } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

const ITEMS_PER_PAGE_TICKET = 15;

export async function generateTicketNumber() {

    try {
        const lastNumber = await db.ticketMaintenance.findFirst({
            orderBy: { countNumber: 'desc' },
            select: { ticketNumber: true },
        });
        let newIdNumber = 1;

        if (lastNumber?.ticketNumber) {
            const lastIdNumber = parseInt(lastNumber?.ticketNumber?.split('-').pop() || '0', 10);
            newIdNumber = lastIdNumber + 1;
        }
        const newTicketNumber = `${lastNumber?.ticketNumber}-${String(newIdNumber).padStart(6, '0')}`;
        return { ticketNumber: newTicketNumber, countNumber: newIdNumber };
    } catch (error) {
        console.error("Filed to generate ticket Number", error)
        throw new Error("Filed to generate ticket number")
    }
};

export const fetchTicketList = async (query: string, currentPage: number) => {
    noStore()
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_TICKET;
    try {
        const ticketFind = await db.ticketMaintenance.findMany({
            skip: offset,
            take: ITEMS_PER_PAGE_TICKET,
            include: {
                employee: true,
                asset: true,
            },
            orderBy: {
                updatedAt: 'desc'
            },
            where: {
                OR: [
                    { ticketNumber: { contains: query, mode: 'insensitive' } },
                    { analisaDescription: { contains: query, mode: 'insensitive' } },
                    { troubleUser: { contains: query, mode: 'insensitive' } },
                    { actionDescription: { contains: query, mode: 'insensitive' } },
                ]
            }
        })
        return ticketFind;
    } catch (error) {
        console.error("Filed fetch ticket list", error)
        throw new Error("Files fetch ticket list")
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

