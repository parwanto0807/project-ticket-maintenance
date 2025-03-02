"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTicketMaintenanceOnAssignSchema } from "@/schemas";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransition } from "react";
import { createTicketAssign } from "@/action/maintenance/ticket";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AssetStatus, AssetType, Department, Product, Technician } from "@prisma/client";
// import { useCurrentUser } from "@/hooks/use-current-user";

interface Asset {
    id: string;
    countNumber: number;
    assetNumber: string;
    status: AssetStatus;
    location: string | null;
    purchaseDate: Date | null;
    purchaseCost: number | null;
    residualValue: number | null;
    usefulLife: number | null;
    createdAt: Date;
    updatedAt: Date;
    assetTypeId: string;
    assetType: AssetType;
    departmentId: string;
    assetImage1: string | null;
    productId: string;
    employeeId: string | null;
    product: Product | null;
    employee: Employee | null;
    department: Department | null;
}

type Employee = {
    id: string;
    name: string;
    email: string;
    address: string;
    picture: string;
    signInvoice: boolean;
    userDept: string;
    createdAt: Date;
    updatedAt: Date;
    department?: {
        id: string;
        dept_name: string;
    };
};

const CreateTicketOnAssignForm = ({
    assetFind,
    employeeDataFind,
    technicianFind,
}: {
    assetFind: Asset[];
    employeeDataFind: Employee[];
    technicianFind: Technician[];
}) => {
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);
    const [ticketNumber, setTicketNumber] = useState("");
    const [countNumber, setCountNumber] = useState(0);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [filteredAssets, setFilteredAssets] = useState<Asset[]>(assetFind);
    const [selectedDepartmentName, setSelectedDepartmentName] = useState<{ dept_name: string } | null>(null);
    const router = useRouter();
    // const user = useCurrentUser();
    // const userTicket = user?.email;

    // console.log("User Department", departmentEmployees);
    // console.log("Email", userTicket);

    useEffect(() => {
        const fetchTicketNumber = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/generateTicketNumber");
                const data = await res.json();

                if (data.ticketNumber && data.countNumber !== undefined) {
                    setTicketNumber(data.ticketNumber);
                    setCountNumber(data.countNumber);

                    // Pastikan nilai masuk ke form
                    form.setValue("ticketNumber", data.ticketNumber, { shouldValidate: true });
                    form.setValue("countNumber", data.countNumber, { shouldValidate: true });
                }
            } catch (error) {
                console.error("Error fetching ticket number:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTicketNumber();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Inisialisasi form dengan useForm
    const form = useForm<z.infer<typeof CreateTicketMaintenanceOnAssignSchema>>({
        resolver: zodResolver(CreateTicketMaintenanceOnAssignSchema),
        defaultValues: {
            troubleUser: "",
            analisaDescription: "",
            actionDescription: "",
            priorityStatus: "Low",
            status: "Pending",
            createdAt: new Date(),
            updatedAt: new Date(),
            scheduledDate: new Date(),
            completedDate: new Date(),
            employeeId: "",
            assetId: "",
            technicianId: "",
            ticketNumber: ticketNumber,
            countNumber: countNumber,
        },
    });

    console.log("Default Value:", form.control._formValues);
    const onSubmit = (values: z.infer<typeof CreateTicketMaintenanceOnAssignSchema>) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("troubleUser", values.troubleUser);
        if (values.analisaDescription) formData.append("analisaDescription", values.analisaDescription);
        if (values.actionDescription) formData.append("actionDescription", values.actionDescription);
        formData.append("priorityStatus", values.priorityStatus);
        formData.append("status", values.status);
        formData.append("ticketNumber", values.ticketNumber);
        formData.append("countNumber", values.countNumber.toString());
        formData.append("employeeId", values.employeeId);
        formData.append("assetId", values.assetId);
        formData.append("technicianId", values.technicianId ?? "");

        if (values.scheduledDate) {
            formData.append("scheduledDate", values.scheduledDate.toISOString());
        }
        if (values.completedDate) {
            formData.append("completedDate", values.completedDate.toISOString());
        }

        // Tambahkan timestamp
        formData.append("createdAt", new Date().toISOString());
        formData.append("updatedAt", new Date().toISOString());

        // Mengirim data ke server
        startTransition(() => {
            createTicketAssign(formData)
                .then((data) => {
                    if (data?.error) {
                        toast.error(data.error);
                    }
                    if (data?.success) {
                        toast.success(data.success);
                        router.push("/dashboard/technician/assign");
                    }
                })
                .finally(() => setLoading(false));
        });
    };

    const handleSelectAsset = (id: string) => {
        // Set assetId ke form
        form.setValue("assetId", id);

        // Cari asset berdasarkan id yang dipilih
        const selectedAssetFind = assetFind?.find((ass) => ass.id === id);

        if (selectedAssetFind) {
            // Set nilai selectedAsset
            setSelectedAsset(selectedAssetFind);

            // Jika ada asset yang ditemukan, set nilai ke form
            form.setValue("assetId", selectedAssetFind.id);
        }
    };

    const handleSelectEmployee = (employeeId: string) => {
        form.setValue("employeeId", employeeId);
        const selectedEmployee = employeeDataFind?.find(emp => emp.id === employeeId);
        if (selectedEmployee?.department) {
            setSelectedDepartmentName({ dept_name: selectedEmployee.department.dept_name });
            // Filter assetFind agar hanya asset yang sesuai dengan department id dari employee terpilih
            const filtered = assetFind.filter(asset => asset.departmentId === selectedEmployee.department?.id);
            setFilteredAssets(filtered);
        }
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center">Create Ticket</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Ticket Number */}
                    <FormField
                        control={form.control}
                        name="ticketNumber"
                        render={({ field }) => (
                            <FormItem className="col-span-2 w-full md:col-span-1 md:w-auto">
                                <FormLabel>🎫 Ticket Number</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={ticketNumber}
                                        placeholder="Enter ticket number"
                                        disabled={isPending}
                                        readOnly
                                        className="font-mono font-extrabold tracking-widest text-green-800"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* User Asset (Employee) */}
                    <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>👨‍💻 User Asset</FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value); // Menggunakan field.onChange
                                        handleSelectEmployee(value);
                                    }}
                                    disabled={isPending}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user asset" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {employeeDataFind?.map((data) => (
                                            <SelectItem key={data.id} value={data.id}>
                                                {data.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {selectedDepartmentName && (
                        <div>
                            <p>🚪 Department: {selectedDepartmentName.dept_name}</p>
                            {/* Tampilkan detail lain jika diperlukan */}
                        </div>
                    )}

                    {/* Asset Name */}
                    <FormField
                        control={form.control}
                        name="assetId"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>🏢 Asset Name</FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        handleSelectAsset(value);
                                    }}
                                    disabled={isPending}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select asset" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {filteredAssets?.map((data) => (
                                            <SelectItem key={data.id} value={data.id}>
                                                {data.product?.part_name} - {data.employee?.name} - {data.department?.dept_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {selectedAsset && (
                        <div className="hidden">
                            <h3>Selected Asset</h3>
                            <p>Asset ID: {selectedAsset.id}</p>
                            <p>Asset Number: {selectedAsset.assetNumber}</p>
                            <p>Status: {selectedAsset.status}</p>
                        </div>
                    )}

                    {/* Trouble User */}
                    <FormField
                        control={form.control}
                        name="troubleUser"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>🔧 Trouble User</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Enter trouble user" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Priority Status */}
                    <FormField
                        control={form.control}
                        name="priorityStatus"
                        render={({ field }) => (
                            <FormItem className="col-span-2 w-full md:col-span-1 md:w-auto">
                                <FormLabel>⚠️ Priority Status</FormLabel>
                                <FormControl>
                                    <select {...field} className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white">
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Status */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className="col-span-2 w-full md:col-span-1 md:w-auto">
                                <FormLabel>📌 Status</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} readOnly />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tambahan Field: Technician */}
                    <FormField
                        control={form.control}
                        name="technicianId"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>👨‍🔧 Technician</FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => field.onChange(value)}
                                    disabled={isPending}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Technician" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {technicianFind.map((tech) => (
                                            <SelectItem key={tech.id} value={tech.id}>
                                                {tech.name} {tech.specialization}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {/* Tambahan Field: Scheduled Date */}
                    <FormField
                        control={form.control}
                        name="scheduledDate"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>📆 Scheduled Date</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="date"
                                        disabled={isPending}
                                        value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                        onChange={(e) => field.onChange(new Date(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Submit Button */}
                <div className=" flex items-end justify-end gap-4">
                    <Button type="submit" className="w-full md:w-auto px-6 py-2 text-lg" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                    <Button
                        variant="destructive"
                        type="button"
                        onClick={() => router.push("/dashboard/technician/assign")}
                    >
                        Back
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default CreateTicketOnAssignForm;
