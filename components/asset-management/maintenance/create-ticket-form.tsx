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
import {
    FaTicketAlt,
    FaUser,
    FaBuilding,
    FaTools,
    FaExclamationTriangle,
    FaCalendar,
    FaImage,
    FaArrowLeft,
    FaPaperPlane,
    FaCog,
    FaMobile,
    FaDesktop
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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

// Fungsi resize dengan kualitas lebih baik
async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise((resolve, reject) => {
        // Create image element properly
        const img = document.createElement('img');

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject(new Error("Canvas context not available"));
                return;
            }

            let { width, height } = img;
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

            // Improve image quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) {
                    const resizedFile = new File([blob], file.name, {
                        type: "image/jpeg",
                        lastModified: new Date().getTime()
                    });
                    resolve(resizedFile);
                } else {
                    reject(new Error("Failed to create blob"));
                }
            }, "image/jpeg", 0.85);
        };

        img.onerror = () => reject(new Error("Failed to load image"));

        // Create object URL for the image
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;

        // Clean up object URL after loading
        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
        };
    });
}

const CreateTicketForm = ({ assetFind, employeeDataFind }: { assetFind: Asset[]; employeeDataFind: Employee[] }) => {
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);
    const [ticketNumber, setTicketNumber] = useState("");
    const [selectedDepartmentName, setSelectedDepartmentName] = useState<{ dept_name: string } | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const router = useRouter();
    const user = useCurrentUser();
    const userTicket = user?.email;

    const userDept = employeeDataFind?.filter((emp) => emp.email === userTicket);
    const departmentId = userDept?.[0]?.department?.id;
    const departmentEmployees = employeeDataFind?.filter((emp) => emp.department?.id === departmentId);
    const departmentByAsset = assetFind?.filter((ass) => ass.departmentId === departmentId);

    const [ticketImage1, setTicketImage1] = useState<File | null>(null);
    const [previewImage1, setPreviewImage1] = useState<string>("");

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Inisialisasi form
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
            scheduledDate: undefined,
            completedDate: undefined,
            employeeId: "",
            assetId: "",
            ticketNumber: "",
            countNumber: 0,
        },
    });

    // Generate ticket number
    useEffect(() => {
        const fetchTicketNumber = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/generateTicketNumber");
                const data = await res.json();

                if (data.ticketNumber && data.countNumber !== undefined) {
                    setTicketNumber(data.ticketNumber);
                    form.setValue("ticketNumber", data.ticketNumber, { shouldValidate: true });
                    form.setValue("countNumber", data.countNumber, { shouldValidate: true });
                }
            } catch (error) {
                console.error("Error fetching ticket number:", error);
                toast.error("Failed to generate ticket number");
            } finally {
                setLoading(false);
            }
        };

        fetchTicketNumber();
    }, [form]);

    const handleSelectEmployee = (employeeId: string) => {
        form.setValue("employeeId", employeeId);
        const selectedEmployee = employeeDataFind?.find((emp) => emp.id === employeeId);
        if (selectedEmployee?.department) {
            setSelectedDepartmentName({ dept_name: selectedEmployee.department.dept_name });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadProgress(0);
            const file = e.target.files[0];

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);

            try {
                let finalFile = file;
                if (file.size > 1048576) {
                    finalFile = await resizeImage(file, 1200, 1200);
                }
                setTicketImage1(finalFile);
                setPreviewImage1(URL.createObjectURL(finalFile));
                setUploadProgress(100);

                setTimeout(() => setUploadProgress(0), 1000);
            } catch (error) {
                console.error("Error processing image:", error);
                toast.error("Failed to process image");
                setUploadProgress(0);
            } finally {
                clearInterval(progressInterval);
            }
        }
    };

    const onSubmit = (values: z.infer<typeof CreateTicketMaintenanceSchema>) => {
        setLoading(true);
        const formData = new FormData();

        // Append form data
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (value instanceof Date) {
                    formData.append(key, value.toISOString());
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

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
                        toast.success("🎉 Ticket created successfully!");
                        setTimeout(() => {
                            router.push("/dashboard/maintenance/ticket");
                        }, 1500);
                    }
                })
                .catch((error) => {
                    console.error("Submission error:", error);
                    toast.error("Failed to create ticket");
                })
                .finally(() => setLoading(false));
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-4 px-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-2">
                    <div className="inline-flex items-center gap-3 mb-4 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg">
                        <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white">
                            <FaTicketAlt className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                Create Maintenance Ticket
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                Report and track equipment maintenance issues
                            </p>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 dark:border-slate-700 overflow-hidden"
                        >
                            <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                {/* Ticket Number */}
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="ticketNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    <FaTicketAlt className="w-4 h-4 text-orange-500" />
                                                    Ticket Number
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            value={ticketNumber}
                                                            disabled
                                                            className="font-mono font-bold text-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800 dark:text-green-300 pr-10"
                                                        />
                                                        {loading && (
                                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* User Asset */}
                                    <motion.div variants={itemVariants}>
                                        <FormField
                                            control={form.control}
                                            name="employeeId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        <FaUser className="w-4 h-4 text-blue-500" />
                                                        User Asset
                                                    </FormLabel>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={(value) => {
                                                            field.onChange(value);
                                                            handleSelectEmployee(value);
                                                        }}
                                                        disabled={isPending}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600">
                                                                <SelectValue placeholder="Select user" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {departmentEmployees?.map((data) => (
                                                                <SelectItem key={data.id} value={data.id}>
                                                                    <div className="flex items-center gap-2">
                                                                        <span>{data.name}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    {/* Department Info */}
                                    <motion.div variants={itemVariants}>
                                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            <FaBuilding className="w-4 h-4 text-purple-500" />
                                            Department
                                        </FormLabel>
                                        <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {selectedDepartmentName?.dept_name || "Select user to see department"}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Asset Name */}
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="assetId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    <FaCog className="w-4 h-4 text-orange-500" />
                                                    Asset Name
                                                </FormLabel>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                    }}
                                                    disabled={isPending}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600">
                                                            <SelectValue placeholder="Select asset" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {departmentByAsset?.map((data) => (
                                                            <SelectItem key={data.id} value={data.id}>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{data.product?.part_name}</span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {data.employee?.name} • {data.department?.dept_name}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                {/* Trouble Description */}
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="troubleUser"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    <FaTools className="w-4 h-4 text-red-500" />
                                                    Trouble Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Please describe the issue in detail..."
                                                        disabled={isPending}
                                                        className="min-h-[100px] resize-none bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Priority Status */}
                                    <motion.div variants={itemVariants}>
                                        <FormField
                                            control={form.control}
                                            name="priorityStatus"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        <FaExclamationTriangle className="w-4 h-4 text-yellow-500" />
                                                        Priority Status
                                                    </FormLabel>
                                                    <FormControl>
                                                        <select
                                                            {...field}
                                                            className="w-full p-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                                        >
                                                            <option value="Low">🟢 Low</option>
                                                            <option value="Medium">🟡 Medium</option>
                                                            <option value="High">🟠 High</option>
                                                            <option value="Critical">🔴 Critical</option>
                                                        </select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    {/* Status */}
                                    <motion.div variants={itemVariants}>
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        <FaCalendar className="w-4 h-4 text-green-500" />
                                                        Status
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            disabled
                                                            className="bg-gray-50 dark:bg-slate-600 border-gray-300 dark:border-slate-600 text-gray-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>
                                </div>

                                {/* Image Upload */}
                                <motion.div variants={itemVariants}>
                                    <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        <FaImage className="w-4 h-4 text-purple-500" />
                                        Issue Evidence
                                        {isMobile && <FaMobile className="w-3 h-3 text-blue-500" />}
                                        {!isMobile && <FaDesktop className="w-3 h-3 text-green-500" />}
                                    </FormLabel>
                                    <div className="space-y-4">
                                        <label
                                            htmlFor="ticketImage1"
                                            className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl cursor-pointer bg-white/50 dark:bg-slate-700/50 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors group"
                                        >
                                            <div className="text-center">
                                                <FaImage className="w-8 h-8 text-gray-400 group-hover:text-orange-500 mb-2 mx-auto" />
                                                <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-orange-600">
                                                    Click to upload image evidence
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    PNG, JPG, JPEG (Max 1MB)
                                                </p>
                                            </div>
                                        </label>
                                        <input
                                            id="ticketImage1"
                                            type="file"
                                            accept="image/*"
                                            {...(isMobile ? { capture: "environment" } : {})}
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />

                                        {/* Upload Progress */}
                                        <AnimatePresence>
                                            {uploadProgress > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-2"
                                                >
                                                    <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                                                        <motion.div
                                                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${uploadProgress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 text-center">
                                                        {uploadProgress < 100 ? "Processing image..." : "Image ready!"}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Image Preview */}
                                        <AnimatePresence>
                                            {previewImage1 && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="flex justify-center"
                                                >
                                                    <div className="relative group">
                                                        <Image
                                                            src={previewImage1}
                                                            alt="Preview"
                                                            width={200}
                                                            height={200}
                                                            className="rounded-xl border-2 border-orange-200 shadow-lg object-cover"
                                                            style={{ width: '200px', height: '200px' }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setPreviewImage1("");
                                                                setTicketImage1(null);
                                                            }}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>

                                {/* Hidden Fields */}
                                <FormField
                                    control={form.control}
                                    name="analisaDescription"
                                    render={({ field }) => (
                                        <input
                                            type="hidden"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="actionDescription"
                                    render={({ field }) => (
                                        <input
                                            type="hidden"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="countNumber"
                                    render={({ field }) => (
                                        <input
                                            type="hidden"
                                            {...field}
                                            value={field.value?.toString() || "0"}
                                        />
                                    )}
                                />
                            </div>

                            {/* Sticky Footer Buttons */}
                            <div className="sticky bottom-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-t border-gray-200 dark:border-slate-700 p-6">
                                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push("/dashboard/maintenance/ticket")}
                                            className="w-full sm:w-auto px-8 py-3 border-2 text-base font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                                            disabled={loading}
                                        >
                                            <FaArrowLeft className="w-4 h-4 mr-2" />
                                            Back to Tickets
                                        </Button>
                                    </motion.div>

                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            type="submit"
                                            disabled={loading || isPending}
                                            className="w-full sm:w-auto px-8 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Creating Ticket...
                                                </div>
                                            ) : (
                                                <>
                                                    <FaPaperPlane className="w-4 h-4 mr-2" />
                                                    Create Ticket
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </form>
                </Form>
            </motion.div>
        </div>
    );
};

export default CreateTicketForm;