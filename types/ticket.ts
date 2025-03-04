// types/ticket.ts
export interface Ticket {
    id: string;
    countNumber: number;
    ticketNumber: string;
    troubleUser: string;
    analisaDescription: string | null;
    actionDescription: string | null;
    priorityStatus: "Low" | "Medium" | "High" | "Critical";
    status: "Pending" | "Assigned" | "In_Progress" | "Completed" | "Canceled";
    scheduledDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    employee: {
        name: string;
    };
    technician: {
        name: string;
    };
    asset: {
        product: {
            part_name: string;
        };
        location: string;
    };
    ticketImage1: string | null;
    ticketImage2: string | null;
    ticketImage3: string | null;
}