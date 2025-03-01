"use client"

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTicketMaintenanceSchema } from "@/schemas";
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
import { createTicket } from "@/action/maintenance/ticket";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssetStatus, AssetType, Department, Product } from "@prisma/client";
import { useCurrentUser } from "@/hooks/use-current-user";

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

const CreateTicketForm = ({ assetFind, employeeDataFind }: { assetFind: Asset[]; employeeDataFind: Employee[] }) => {
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);
    const [ticketNumber, setTicketNumber] = useState("");
    const [countNumber, setCountNumber] = useState(0);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [selectedDepartmentName, setSelectedDepartmentName] = useState<{ dept_name: string } | null>(null);
    const router = useRouter();
    const user = useCurrentUser();
    const userTicket = user?.email;

    const userDept = employeeDataFind?.filter(emp => emp.email === userTicket);
    const departmentId = userDept?.[0]?.department?.id;
    const departmentEmployees = employeeDataFind?.filter(emp => emp.department?.id === departmentId);
    const departmentByAsset = assetFind?.filter(ass => ass.departmentId === departmentId );

    console.log("User Department", departmentEmployees);

    console.log("Email", userTicket);

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
    const form = useForm<z.infer<typeof CreateTicketMaintenanceSchema>>({
        resolver: zodResolver(CreateTicketMaintenanceSchema),
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
            ticketNumber: ticketNumber,
            countNumber: countNumber,
        }
    });

    console.log('Default Value:', form.control._formValues);
    // Fungsi onSubmit untuk menangani pengiriman data
    const onSubmit = (values: z.infer<typeof CreateTicketMaintenanceSchema>) => {
        setLoading(true);

        // Membuat FormData untuk mengirim data
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
            createTicket(formData)
            
                .then((data) => {
                    if (data?.error) {
                        toast.error(data.error);
                    }
                    if (data?.success) {
                        toast.success(data.success);
                        router.push("/dashboard/maintenance/ticket");
                    }
                })
                .finally(() => setLoading(false));
        });
    };

    const handleSelectAsset = (id: string) => {
        // Set assetId ke form
        form.setValue("assetId", id);

        // Cari asset berdasarkan id yang dipilih
        const selectedAssetFind = assetFind?.find(ass => ass.id === id);

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
                    {/* Asset ID */}
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
                                    disabled={isPending}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user asset" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>

                                        {departmentEmployees?.map(data => (
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
                            {/* Tampilkan lebih banyak detail sesuai kebutuhan */}
                        </div>
                    )}
                    {/* Asset ID */}
                    <FormField
                        control={form.control}
                        name="assetId"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>🏢 Asset Name</FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value); // Menggunakan field.onChange
                                        handleSelectAsset(value);
                                    }}
                                    disabled={isPending}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user asset" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>

                                        {departmentByAsset?.map(data => (
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
                            {/* Tampilkan lebih banyak detail sesuai kebutuhan */}
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

                    {/* Analisa Description */}
                    <FormField
                        control={form.control}
                        name="analisaDescription"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel className="hidden">📋 Analisa Description</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value ?? ""} placeholder="Enter analisa description"  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white hidden" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Action Description */}
                    <FormField
                        control={form.control}
                        name="actionDescription"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel className="hidden">🔍 Action Description</FormLabel>
                                <FormControl>
                                    <Input {...field} value={field.value ?? ""}  placeholder="Enter action description" className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white hidden" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Count Number */}
                    <FormField
                        control={form.control}
                        name="countNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="hidden">🔢 Count Number</FormLabel>
                                <FormControl>
                                    <Input className="hidden"
                                        {...field}
                                        type="number"
                                        value={countNumber}
                                        placeholder="Enter count number" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <Button type="submit" className="w-full md:w-auto px-6 py-2 text-lg" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </form>
        </Form>

    );
};

export default CreateTicketForm;