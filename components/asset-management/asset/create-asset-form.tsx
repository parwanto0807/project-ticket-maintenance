"use client"

import * as z from "zod";
import { useState, useTransition, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { AssetSchema } from "@/schemas";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"
import { AssetType } from "@prisma/client";
import { QRCodeCanvas } from "qrcode.react";

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
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { createAsset } from "@/action/asset/asset";
import { AssetStatus } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import Search from "@/components/ui/search";
import Pagination from "@/components/ui/pagination";
import TypeAssetForm from "./type-asset-form";
import { Card } from "@/components/ui/card";
import Image from "next/image";

type ProductNameOnly = {
    id: string;
    part_name: string;
    part_number: string;
};

type UploadMethod = "file" | "camera";

const CreateAssetForm = ({
    assetTypeFind,
    productDataFind,
    totalPages,
    employeeDataFind,
}: {
    assetTypeFind: AssetType[];
    totalPages: number,
    productDataFind: ProductNameOnly[];
    employeeDataFind: Employee[];
}) => {

    const [isPending] = useTransition();
    const [date, setDate] = useState<Date | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [searchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductNameOnly | null>(null);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<{ id: string } | null>(null);
    const [selectedDepartmentName, setSelectedDepartmentName] = useState<{ dept_name: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [uploadMethod, setUploadMethod] = useState<UploadMethod>("file");

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

    const form = useForm<z.infer<typeof AssetSchema>>({
        resolver: zodResolver(AssetSchema),
        defaultValues: {
            assetNumber: "",
            status: "AVAILABLE",
            location: "",
            purchaseDate: new Date,
            purchaseCost: 0,
            residualValue: 0,
            usefulLife: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            assetTypeId: "",
            productId: "",
            employeeId: "",
            departmentId: "",
            assetImage1: undefined,
        }
    });

    const { setValue } = form;

    // console.log(selectedDepartmentId);
    // console.log(selectedDepartmentName);

    useEffect(() => {
        if (date) {
            console.log('Tanggal yang dipilih:', date);
        }
    }, [date]);

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    // console.log('Default Value:', form.control._formValues);

    const onSubmit = (values: z.infer<typeof AssetSchema>) => {
        // console.log('Form Value:', values);
        setLoading(true)
        createAsset(values)
            .then((data) => {
                if (data?.error) {
                    setLoading(false);
                    toast.error(data.error);
                    setTimeout(() => {
                        form.reset();
                    }, 2000);
                }
                if (data?.success) {
                    setLoading(false);
                    toast.success(data.success);
                    setTimeout(() => {
                        form.reset();
                    }, 2000);
                    router.push('/dashboard/asset/asset-list');
                }
            })
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        // Validasi format tanggal
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (regex.test(value)) {
            const parsedDate = new Date(value);
            if (!isNaN(parsedDate.getTime())) {
                setDate(parsedDate);
                form.setValue('purchaseDate', parsedDate);
            }
        }
    };

    const filteredProducts = productDataFind.filter((product) =>
        product.part_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.part_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectProduct = (product: ProductNameOnly) => {
        setSelectedProduct(product);
        form.setValue("productId", product.id); // Set the product ID in the form
        setOpen(false);
    };

    const handleSelectEmployee = (employeeId: string) => {
        form.setValue("employeeId", employeeId);
        const selectedEmployee = employeeDataFind?.find(emp => emp.id === employeeId);
        if (selectedEmployee && selectedEmployee.department) {
            setSelectedDepartmentId({
                id: selectedEmployee.department.id,
            });
            setSelectedDepartmentName({
                dept_name: selectedEmployee.department.dept_name
            });
            form.setValue("departmentId", selectedEmployee.department.id);
        }
    };

    const handleSelectAssetType = async (value: string) => {
        setValue("assetTypeId", value); // Set nilai AssetType di form
        setLoading(true);

        try {
            const response = await fetch(`/api/generateAssetNumber?assetTypeId=${value}`);
            const data = await response.json();

            if (response.ok) {
                setValue("assetNumber", data.assetNumber); // Set nilai AssetNumber di form
            } else {
                console.error("Error fetching asset number:", data.error);
            }
        } catch (error) {
            console.error("Request failed:", error);
        } finally {
            setLoading(false);
        }
    };

    // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (file) {
    //         const imageUrl = URL.createObjectURL(file);
    //         setPreviewImage(imageUrl);
    //         // Simpan file ke form
    //         setValue("assetImage1", file);
    //     } else {
    //         setPreviewImage(null);
    //     }
    // };
    // Handler untuk perubahan file atau capture

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleUploadMethodChange = (method: UploadMethod) => {
        setUploadMethod(method);
        if (method === "file" && isCameraActive) {
            stopCamera(); // Stop the camera when switching to "file"
        }
    };

    // Memulai kamera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            console.log("Camera stream received:", stream); // Log stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Unable to access camera. Please ensure you have granted permission.");
        }
    };

    // Menghentikan kamera
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            setIsCameraActive(false);
        }
    };

    // Menangkap gambar dari kamera
    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            // Atur ukuran canvas sesuai dengan video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Gambar frame video ke canvas
            context?.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Konversi gambar ke data URL (base64)
            const imageDataUrl = canvas.toDataURL("image/png");
            setImageSrc(imageDataUrl);
        }
    };
    // Membersihkan stream saat komponen di-unmount
    useEffect(() => {
        const videoElement = videoRef.current; // Salin ke variabel lokal

        return () => {
            if (videoElement && videoElement.srcObject) {
                const stream = videoElement.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []); // Hanya dipanggil sekali saat unmount

    return (
        <Form {...form}>
            <div className="w-full rounded-lg border p-4 shadow-lg mt-4 dark:bg-gray-950">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 p-4 mb-12 ">
                    <div className="flex-initial grid grid-cols-1 gap-4 sm:grid-cols-2 sm:justify-between uppercase">
                        <div className="flex w-full gap-x-2 items-center justify-center">
                            <div className="flex-initial w-full">
                                <FormField
                                    control={form.control}
                                    name="assetTypeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Asset Type</FormLabel>
                                            <Select onValueChange={handleSelectAssetType} defaultValue={field.value} disabled={isPending}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type asset" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {assetTypeFind?.map(assetTypeFind => (
                                                        <SelectItem key={assetTypeFind.id} value={assetTypeFind.id}>
                                                            {assetTypeFind.name} {assetTypeFind.kode}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex-initial md:flex-none mt-8">
                                <TypeAssetForm assetTypeFind={assetTypeFind} />
                            </div>
                        </div>
                        <div className="flex w-full md:justify-end sm:ml-auto">
                            <FormField
                                control={form.control}
                                name="assetNumber"
                                render={({ field }) => (
                                    <FormItem className="text-blue-700 gap-x-2 text-center uppercase">
                                        <FormLabel>Asset Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="text-blue-700 font-bold text-lg text-center uppercase"
                                                disabled={isPending}
                                                placeholder="Asset Number"
                                                readOnly

                                            />
                                        </FormControl>
                                        {field.value && (
                                            <div className="mt-4 flex justify-center">
                                                <div className="p-4 border-4 border-gray-400 rounded-lg shadow-md bg-white">
                                                    <QRCodeCanvas value={field.value} size={128} />
                                                </div>
                                            </div>
                                        )}

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="mt-1 grid grid-cols-1 gap-4 gap-y-4 sm:grid-cols-1 items-center justify-center space-between uppercase">
                        <div className='grid grid-cols-1 w-full space-y-2 items-center justify-center'>
                            <FormField
                                control={form.control}
                                name="productId" // Sesuaikan dengan nama field di schema
                                render={() => (
                                    <FormItem className="flex flex-col space-y-2">
                                        <FormLabel htmlFor="productId">Asset Name</FormLabel>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-full md:w-1/2 justify-between"
                                                >
                                                    {selectedProduct ? selectedProduct.part_name : "Select part name ..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0 max-w-xl">
                                                <Command>
                                                    <div className="flex flex-col w-full">
                                                        {/* Search Input */}
                                                        <div className="flex space-y-1 p-2">
                                                            <Search placeholder="Search product price..." />
                                                        </div>
                                                        <CommandList className="flex-1">
                                                            {filteredProducts.length === 0 ? (
                                                                <CommandEmpty>No part name found.</CommandEmpty>
                                                            ) : (
                                                                <CommandGroup>
                                                                    {filteredProducts.map((product) => (
                                                                        <CommandItem
                                                                            key={product.id}
                                                                            onSelect={() => {
                                                                                handleSelectProduct(product);
                                                                                form.setValue("productId", product.id); // Simpan nilai ke form
                                                                                setOpen(false);
                                                                            }}
                                                                            disabled={isPending}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    selectedProduct?.id === product.id ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                            <div className="flex flex-col">
                                                                                <span className="text-wrap">{product.part_name}</span>
                                                                                <span className="text-xs text-gray-500 text-wrap">{product.part_number}</span>
                                                                            </div>
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            )}
                                                        </CommandList>

                                                        <div className="flex justify-center mt-4">
                                                            <Pagination totalPages={totalPages} />
                                                        </div>
                                                    </div>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                    </div>
                    <div className="flex w-full gap-x-2 uppercase">
                        <div className="flex-initial w-full">
                            <FormField
                                control={form.control}
                                name="employeeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Asset</FormLabel>
                                        <Select
                                            onValueChange={handleSelectEmployee}
                                            defaultValue={field.value ?? ""}
                                            disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select user asset" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {employeeDataFind?.map(data => (
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
                        </div>
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="departmentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={selectedDepartmentId?.id ?? ""}
                                                disabled={isPending}
                                                type="hidden"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel>Department Name</FormLabel>
                                <FormControl>
                                    <Input value={selectedDepartmentName?.dept_name ?? ""} readOnly />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </div>
                    </div>

                    <div className="flex w-full gap-2 uppercase">
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
                                                disabled={isPending}
                                                type="text"
                                                min="1"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-1/2">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Asset Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Entry Unit " />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(AssetStatus).map((status: AssetStatus) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 mt-0 sm:grid-cols-4 gap-2 uppercase">
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="purchaseDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="purchaseDate">Purchase Date</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col space-y-2">
                                                {/* Input manual */}
                                                <Input
                                                    {...field}
                                                    type="date"
                                                    value={inputValue}
                                                    onChange={handleInputChange}
                                                    placeholder="YYYY-MM-DD"
                                                    className="w-[280px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="purchaseCost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purchase Cost</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type="price"
                                                min="1"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="residualValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Residual Value</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type="price"
                                                min="1"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="w-full">
                            <FormField
                                control={form.control}
                                name="usefulLife"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Useful Life</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type="number"
                                                min="1"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* <div className="w-full md:w-1/4 items-center justify-center">
                        <Card className="w-full py-2 px-2 border-2 mt-4 rounded-sm items-center justify-center">
                            <h3 className="w-full font-bold items-center justify-center text-center">Upload Images</h3>
                            <div className="mb-2 pt-2">
                                <Input
                                    type="file"
                                    name="assetImage1"
                                    className="file:h-full file:mr-4 file:rounded-sm file:border-0 file:bg-gray-200 hover:file:bg-gray-300 file:cursor-pointer border border-gray-400 w-full"
                                    accept="image/*" // Opsional: Batasi hanya untuk gambar
                                    onChange={handleImageChange}
                                />
                                {previewImage && (
                                    <div className="mt-4">
                                        <Image
                                            src={previewImage}
                                            alt="Preview"
                                            width={400} // Set the desired width
                                            height={200} // Set the desired height
                                            className="rounded-lg shadow-sm items-center justify-center object-center"
                                            style={{ maxWidth: '100%', height: 'auto' }} // Ensure responsiveness
                                        />
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div> */}

                    <div className="w-full md:w-1/4 items-center justify-center">
                        <Card className="w-full py-2 px-2 border-2 mt-4 rounded-sm items-center justify-center">
                            <h3 className="w-full font-bold items-center justify-center text-center">
                                Upload Images
                            </h3>

                            {/* Pilihan Upload Method */}
                            <div className="flex gap-6 justify-center mt-4 mb-8">
                                <label className="flex items-center space-x-2 text-lg font-medium">
                                    <input
                                        type="radio"
                                        name="uploadMethod"
                                        value="file"
                                        checked={uploadMethod === "file"}
                                        onChange={() => handleUploadMethodChange("file")}
                                        className="form-radio text-blue-500 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">File</span>
                                </label>

                                <label className="flex items-center space-x-2 text-lg font-medium">
                                    <input
                                        type="radio"
                                        name="uploadMethod"
                                        value="camera"
                                        checked={uploadMethod === "camera"}
                                        onChange={() => handleUploadMethodChange("camera")}
                                        className="form-radio text-green-500 border-gray-300 focus:ring-green-500"
                                    />
                                    <span className="text-gray-700">Camera</span>
                                </label>
                            </div>


                            {/* Input File atau Camera */}
                            <div className="mb-2 pt-2">
                                <Input
                                    type="file"
                                    name="assetImage1"
                                    className="file:h-full file:mr-4 file:rounded-sm file:border-0 file:bg-gray-200 hover:file:bg-gray-300 file:cursor-pointer border border-gray-400 w-full"
                                    accept="image/*" // Hanya menerima file gambar
                                    capture={uploadMethod === "camera" ? "environment" : undefined} // Aktifkan kamera belakang (environment) atau depan (user)
                                    onChange={handleImageChange}
                                />
                                {previewImage && (
                                    <div className="mt-4">
                                        <Image
                                            src={previewImage}
                                            alt="Preview"
                                            width={400}
                                            height={200}
                                            className="rounded-lg shadow-sm items-center justify-center object-center"
                                            style={{ maxWidth: "100%", height: "auto" }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Tampilkan tombol camera hanya jika uploadMethod === "camera" */}
                            {uploadMethod === "camera" && (
                                <div className="flex flex-col items-center justify-center p-4">
                                    {/* Tombol untuk memulai/menghentikan kamera */}
                                    <div className="mb-4">
                                        {!isCameraActive ? (
                                            <Button
                                                onClick={startCamera}
                                                type="button"
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                            >
                                                Start Camera
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={stopCamera}
                                                type="button"
                                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                                            >
                                                Stop Camera
                                            </Button>
                                        )}
                                    </div>

                                    {/* Video untuk menampilkan stream kamera */}
                                    {isCameraActive && (
                                        <div className="mb-4">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                className="w-full max-w-md border-2 border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    )}

                                    {/* Tombol untuk menangkap gambar */}
                                    {isCameraActive && (
                                        <Button
                                            onClick={captureImage}
                                            type="button"
                                            className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
                                        >
                                            Capture Image
                                        </Button>
                                    )}

                                    {/* Canvas untuk menangkap gambar (tersembunyi) */}
                                    <canvas ref={canvasRef} className="hidden" />

                                    {/* Menampilkan gambar yang diambil */}
                                    {imageSrc && (
                                        <div className="mt-4">
                                            <h3 className="text-lg font-bold mb-2">Captured Image:</h3>
                                            <Image
                                                src={imageSrc}
                                                alt="Captured"
                                                className="w-full max-w-md rounded-lg shadow-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    </div>
                    <div className="relative ">
                        <Button className={`w-24 h-9 rounded-lg absolute right-0 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-2 px-4 rounded-lg`} type="submit">{loading ? 'Load Save...' : 'Save'}</Button>
                    </div>
                </form>
                <div className="flex items-center justify-end border p-2 pr-3 rounded-md shadow-sm">
                    <Link
                        href="/dashboard/asset/asset-list"
                        className="flex h-9 w-24 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <span>Exit</span>{' '}
                        <ArrowLeftStartOnRectangleIcon className="h-5 md:ml-4" />
                    </Link>
                </div>
            </div>
        </Form>
    )

}

export default CreateAssetForm;