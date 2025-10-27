"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSoftware } from "@/action/master/software";
import {
    ArrowLeft,
    PlusCircle,
    Package,
    Building,
    Tag,
    Key,
    Calendar,
    Globe,
    FileText
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function SoftwareForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        vendor: "",
        category: "",
        licenseType: "Proprietary",
        defaultExpiry: "",
        website: "",
        description: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Prepare data untuk dikirim
            const submitData = {
                name: formData.name.trim(),
                vendor: formData.vendor.trim() || undefined,
                category: formData.category.trim() || undefined,
                licenseType: formData.licenseType || undefined,
                defaultExpiry: formData.defaultExpiry ? Number(formData.defaultExpiry) : undefined,
                website: formData.website.trim() || undefined,
                description: formData.description.trim() || undefined
            };

            console.log("Submitting data to server action:", submitData);

            // Gunakan server action langsung
            const result = await createSoftware(submitData);

            if (result.success) {
                console.log("Software created successfully");
                // Redirect ke halaman software list setelah berhasil
                router.push("/dashboard/master/software");
                router.refresh();
            } else {
                setError(result.error || "Failed to create software");
            }

        } catch (err) {
            console.error("Error in form submission:", err);
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push("/dashboard/master/software")}
                        className="h-9 w-9"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Add New Software
                        </h1>
                        <p className=" text-xs md:text-sm text-muted-foreground mt-1">
                            Register new software to your asset management system
                        </p>
                    </div>
                </div>
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                    <Package className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                    Software Management
                </Badge>
            </div>

            {/* Main Form Card */}
            <Card className="border-l-4 border-l-blue-500 shadow-lg">
                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <PlusCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                Software Information
                            </CardTitle>
                            <CardDescription>
                                Fill in the details below to add new software to the system
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                <div className="w-2 bg-red-500 rounded-full self-stretch"></div>
                                <div>
                                    <strong className="font-semibold">Creation Failed</strong>
                                    <p className="mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="h-5 w-5 text-blue-500" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Basic Information
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent ml-2"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Software Name */}
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                                        <Package className="h-4 w-4 text-blue-500" />
                                        Software Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g., Microsoft Office 365"
                                        required
                                        disabled={isLoading}
                                        className="h-11 transition-colors focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>

                                {/* Vendor */}
                                <div className="space-y-3">
                                    <Label htmlFor="vendor" className="text-sm font-medium flex items-center gap-2">
                                        <Building className="h-4 w-4 text-green-500" />
                                        Vendor
                                    </Label>
                                    <Input
                                        id="vendor"
                                        name="vendor"
                                        value={formData.vendor}
                                        onChange={handleChange}
                                        placeholder="e.g., Microsoft Corporation"
                                        disabled={isLoading}
                                        className="h-11 transition-colors focus:ring-2 focus:ring-green-500/20"
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-3">
                                    <Label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-purple-500" />
                                        Category
                                    </Label>
                                    <Input
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="e.g., Office Suite, Design Tool"
                                        disabled={isLoading}
                                        className="h-11 transition-colors focus:ring-2 focus:ring-purple-500/20"
                                    />
                                </div>

                                {/* License Type */}
                                <div className="space-y-3">
                                    <Label htmlFor="licenseType" className="text-sm font-medium flex items-center gap-2">
                                        <Key className="h-4 w-4 text-orange-500" />
                                        License Type
                                    </Label>
                                    <Select
                                        value={formData.licenseType}
                                        onValueChange={(value) => handleSelectChange("licenseType", value)}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="h-11 transition-colors focus:ring-2 focus:ring-orange-500/20">
                                            <SelectValue placeholder="Select license type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Proprietary" className="flex items-center gap-2">
                                                <Key className="h-4 w-4 text-orange-500" />
                                                Proprietary
                                            </SelectItem>
                                            <SelectItem value="Open Source" className="flex items-center gap-2">
                                                <Key className="h-4 w-4 text-green-500" />
                                                Open Source
                                            </SelectItem>
                                            <SelectItem value="Freeware" className="flex items-center gap-2">
                                                <Key className="h-4 w-4 text-blue-500" />
                                                Freeware
                                            </SelectItem>
                                            <SelectItem value="Shareware" className="flex items-center gap-2">
                                                <Key className="h-4 w-4 text-purple-500" />
                                                Shareware
                                            </SelectItem>
                                            <SelectItem value="Oem" className="flex items-center gap-2">
                                                <Key className="h-4 w-4 text-blue-500" />
                                                OEM
                                            </SelectItem>
                                            <SelectItem value="Subscription" className="flex items-center gap-2">
                                                <Key className="h-4 w-4 text-red-500" />
                                                Subscription
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Additional Details Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="h-5 w-5 text-indigo-500" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Additional Details
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-indigo-200 to-transparent ml-2"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Default Expiry */}
                                <div className="space-y-3">
                                    <Label htmlFor="defaultExpiry" className="text-sm font-medium flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-amber-500" />
                                        Default Expiry (days)
                                    </Label>
                                    <Input
                                        id="defaultExpiry"
                                        name="defaultExpiry"
                                        type="number"
                                        value={formData.defaultExpiry}
                                        onChange={handleChange}
                                        placeholder="e.g., 365"
                                        min="0"
                                        disabled={isLoading}
                                        className="h-11 transition-colors focus:ring-2 focus:ring-amber-500/20"
                                    />
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Number of days until license expires
                                    </p>
                                </div>

                                {/* Website */}
                                <div className="space-y-3">
                                    <Label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-cyan-500" />
                                        Website
                                    </Label>
                                    <Input
                                        id="website"
                                        name="website"
                                        type="url"
                                        value={formData.website}
                                        onChange={handleChange}
                                        placeholder="https://example.com"
                                        disabled={isLoading}
                                        className="h-11 transition-colors focus:ring-2 focus:ring-cyan-500/20"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-indigo-500" />
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the software features, system requirements, or any important notes..."
                                    rows={5}
                                    disabled={isLoading}
                                    className="resize-none transition-colors focus:ring-2 focus:ring-indigo-500/20 min-h-[120px]"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span>All fields marked with * are required</span>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push("/dashboard/master/software")}
                                    disabled={isLoading}
                                    className="gap-2 min-w-[100px]"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="gap-2 min-w-[140px] bg-blue-600 hover:bg-blue-700"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="h-4 w-4" />
                                            Create Software
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mt-0.5">
                            <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-green-900 dark:text-green-100">
                                Pro Tips
                            </h4>
                            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                                <li>• Provide accurate vendor information for better asset tracking</li>
                                <li>• Set default expiry days for automatic license management</li>
                                <li>• Include website links for quick access to software resources</li>
                                <li>• Use categories to organize similar software together</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}