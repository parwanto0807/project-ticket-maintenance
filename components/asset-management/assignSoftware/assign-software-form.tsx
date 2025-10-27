// components/asset-management/asset/assign-software-form.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2, Calendar, Key, Package } from "lucide-react"
import { getAllSoftware } from "@/action/master/software"
import { createSoftwareInstallation } from "@/action/asset/software-installation"// Import server action untuk create installation

const assignSoftwareSchema = z.object({
    softwareId: z.string().min(1, "Software is required"),
    licenseKey: z.string().optional(),
    version: z.string().optional(),
    installDate: z.string().optional(),
    licenseExpiry: z.string().optional(),
    isActive: z.boolean().default(true),
})

type AssignSoftwareFormValues = z.infer<typeof assignSoftwareSchema>

interface Software {
    id: string
    name: string
    vendor?: string | null
    category?: string | null
    licenseType?: string | null
    defaultExpiry?: number | null
    description?: string | null
}

interface AssignSoftwareFormProps {
    assetId: string
    onSuccess: () => void
}

export function AssignSoftwareForm({ assetId, onSuccess }: AssignSoftwareFormProps) {
    const [software, setSoftware] = useState<Software[]>([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<AssignSoftwareFormValues>({
        resolver: zodResolver(assignSoftwareSchema),
        defaultValues: {
            softwareId: "",
            licenseKey: "",
            version: "",
            installDate: new Date().toISOString().split('T')[0],
            licenseExpiry: "",
            isActive: true,
        }
    })

    // Fetch available software menggunakan server action
    useEffect(() => {
        const fetchSoftware = async () => {
            try {
                setError(null)
                console.log("Fetching software data using server action...")

                const softwareData = await getAllSoftware()
                console.log("Software data fetched:", softwareData)
                setSoftware(softwareData.data || [])

            } catch (error) {
                console.error("Error fetching software:", error)
                setError("Gagal memuat daftar software")
                toast.error("Failed to load software list")
            } finally {
                setFetching(false)
            }
        }

        fetchSoftware()
    }, [])

    const onSubmit = async (values: AssignSoftwareFormValues) => {
        setLoading(true)
        try {
            console.log("Submitting software installation:", values)

            // Format data untuk create installation
            const installationData = {
                assetId,
                softwareId: values.softwareId,
                licenseKey: values.licenseKey || undefined,
                version: values.version || undefined,
                installDate: values.installDate ? new Date(values.installDate) : new Date(),
                licenseExpiry: values.licenseExpiry ? new Date(values.licenseExpiry) : undefined,
                isActive: values.isActive,
            }

            // Gunakan server action untuk create installation
            const result = await createSoftwareInstallation(installationData)

            if (result.error) {
                throw new Error(result.error)
            }

            toast.success("Software assigned successfully")
            onSuccess()

        } catch (error) {
            console.error("Error assigning software:", error)
            const errorMessage = error instanceof Error ? error.message : "Failed to assign software"
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const selectedSoftware = software.find(s => s.id === form.watch("softwareId"))

    // Jika error fetching, tampilkan pesan error
    if (error) {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                        <Package className="h-5 w-5" />
                        <span className="font-medium">Error Loading Software</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                    <p className="text-red-600 text-xs mt-2">
                        Pastikan server database berjalan dan tabel software sudah dibuat.
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onSuccess}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Software Selection */}
                <FormField
                    control={form.control}
                    name="softwareId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                Software *
                                {fetching && <Loader2 className="h-3 w-3 animate-spin" />}
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={fetching || software.length === 0}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                fetching ? "Loading software..." :
                                                    software.length === 0 ? "No software available" :
                                                        "Select software"
                                            }
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {software.map((soft) => (
                                        <SelectItem key={soft.id} value={soft.id}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{soft.name}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {soft.vendor} • {soft.licenseType || "No license type"}
                                                </span>
                                                {soft.category && (
                                                    <span className="text-xs text-muted-foreground">
                                                        Category: {soft.category}
                                                    </span>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {software.length === 0 && !fetching && (
                                <FormDescription className="text-amber-600">
                                    No software available. Please add software first in the software management section.
                                </FormDescription>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Software Details */}
                {selectedSoftware && (
                    <div className="p-4 bg-muted/50 rounded-lg border">
                        <h4 className="font-medium mb-2">Software Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Vendor:</span>
                                <span className="ml-2">{selectedSoftware.vendor || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Category:</span>
                                <span className="ml-2">{selectedSoftware.category || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">License Type:</span>
                                <span className="ml-2">{selectedSoftware.licenseType || "N/A"}</span>
                            </div>
                            {selectedSoftware.defaultExpiry && (
                                <div>
                                    <span className="text-muted-foreground">Default Expiry:</span>
                                    <span className="ml-2">{selectedSoftware.defaultExpiry} days</span>
                                </div>
                            )}
                        </div>
                        {selectedSoftware.description && (
                            <div className="mt-2">
                                <span className="text-muted-foreground text-sm">Description:</span>
                                <p className="text-sm mt-1">{selectedSoftware.description}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="installDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Installation Date
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="version"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Version</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., 1.0.0"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Software version (optional)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="licenseKey"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2">
                                <Key className="h-4 w-4" />
                                License Key
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter license key if applicable"
                                    className="resize-none font-mono"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Optional license key for the software
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="licenseExpiry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>License Expiry Date</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    When the license expires (optional)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        Active Installation
                                    </FormLabel>
                                    <FormDescription>
                                        Mark this installation as active
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onSuccess}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading || fetching || software.length === 0}
                        className="flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Assigning Software...
                            </>
                        ) : (
                            "Assign Software"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}