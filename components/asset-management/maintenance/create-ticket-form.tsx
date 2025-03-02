"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
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

// Fungsi resize (contoh sederhana menggunakan canvas)
async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    let { width, height } = imageBitmap;
    const aspectRatio = width / height;

    if (width > maxWidth) {
        width = maxWidth;
        height = Math.round(width / aspectRatio);
    }
    if (height > maxHeight) {
        height = maxHeight;
        width = Math.round(height * aspectRatio);
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.drawImage(imageBitmap, 0, 0, width, height);
    }
    return new Promise<File>((resolve) => {
        canvas.toBlob((blob) => {
            if (blob) {
                const resizedFile = new File([blob], file.name, { type: file.type });
                resolve(resizedFile);
            }
        }, file.type);
    });
}

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

    const userDept = employeeDataFind?.filter((emp) => emp.email === userTicket);
    const departmentId = userDept?.[0]?.department?.id;
    const departmentEmployees = employeeDataFind?.filter((emp) => emp.department?.id === departmentId);
    const departmentByAsset = assetFind?.filter((ass) => ass.departmentId === departmentId);



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
        },
    });

    useEffect(() => {
        const fetchTicketNumber = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/generateTicketNumber");
                const data = await res.json();

                if (data.ticketNumber && data.countNumber !== undefined) {
                    setTicketNumber(data.ticketNumber);
                    setCountNumber(data.countNumber);
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
    }, [form]);
    // State untuk input file gambar
    const [ticketImage1, setTicketImage1] = useState<File | null>(null);

    // State untuk preview image
    const [previewImage1, setPreviewImage1] = useState<string>("");

    // Deteksi perangkat mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsMobile(window.matchMedia("(pointer: coarse)").matches);
        }
    }, []);

    const handleSelectAsset = (id: string) => {
        form.setValue("assetId", id);
        const selectedAssetFind = assetFind?.find((ass) => ass.id === id);
        if (selectedAssetFind) {
            setSelectedAsset(selectedAssetFind);
            form.setValue("assetId", selectedAssetFind.id);
        }
    };

    const handleSelectEmployee = (employeeId: string) => {
        form.setValue("employeeId", employeeId);
        const selectedEmployee = employeeDataFind?.find((emp) => emp.id === employeeId);
        if (selectedEmployee?.department) {
            setSelectedDepartmentName({ dept_name: selectedEmployee.department.dept_name });
        }
    };

    // Fungsi onSubmit untuk mengirim data
    const onSubmit = (values: z.infer<typeof CreateTicketMaintenanceSchema>) => {
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

        if (values.scheduledDate) {
            formData.append("scheduledDate", values.scheduledDate.toISOString());
        }
        if (values.completedDate) {
            formData.append("completedDate", values.completedDate.toISOString());
        }

        // Tambahkan timestamp
        formData.append("createdAt", new Date().toISOString());
        formData.append("updatedAt", new Date().toISOString());

        // Tambahkan file gambar: Hanya Ticket Image 1 (input) untuk preview disini
        if (ticketImage1) {
            formData.append("ticketImage1", ticketImage1);
        }

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
                    {/* User Asset */}
                    <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>👨‍💻 User Asset</FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value);
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
                                        {departmentEmployees?.map((data) => (
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
                                        {departmentByAsset?.map((data) => (
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
                    {/* Hidden Analisa & Action Description */}
                    <FormField
                        control={form.control}
                        name="analisaDescription"
                        render={({ field }) => (
                            <FormItem className="col-span-2 hidden">
                                <FormLabel className="hidden">📋 Analisa Description</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value ?? ""}
                                        placeholder="Enter analisa description"
                                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="actionDescription"
                        render={({ field }) => (
                            <FormItem className="col-span-2 hidden">
                                <FormLabel className="hidden">🔍 Action Description</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value ?? ""}
                                        placeholder="Enter action description"
                                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Count Number (hidden) */}
                    <FormField
                        control={form.control}
                        name="countNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="hidden">🔢 Count Number</FormLabel>
                                <FormControl>
                                    <Input className="hidden" {...field} type="number" value={countNumber} placeholder="Enter count number" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Input File untuk Ticket Image 3 */}
                    <div>
                        <label htmlFor="ticketImage3" className="block text-sm font-medium text-gray-700">
                            Ticket Image from user complain
                        </label>
                        <input
                            id="ticketImage1"
                            type="file"
                            accept="image/*"
                            {...(isMobile ? { capture: "environment" } : {})}
                            onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    let finalFile = file;
                                    if (file.size > 1048576) {
                                        finalFile = await resizeImage(file, 800, 800);
                                    }
                                    setTicketImage1(finalFile);
                                    setPreviewImage1(URL.createObjectURL(finalFile));
                                }
                            }}
                            className="mt-1 block w-full"
                        />
                        {previewImage1 && previewImage1.trim() !== "" && (
                            <div className="mt-2">
                                <Image
                                    src={previewImage1}
                                    alt="Preview Ticket Image 1"
                                    width={96}
                                    height={96}
                                    className="object-cover rounded"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-end justify-end gap-4">
                    <Button type="submit" className="w-full md:w-auto px-6 py-2 text-lg" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                    <Button
                        variant="destructive"
                        type="button"
                        onClick={() => router.push("/dashboard/maintenance/ticket")}
                    >
                        Back
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default CreateTicketForm;
