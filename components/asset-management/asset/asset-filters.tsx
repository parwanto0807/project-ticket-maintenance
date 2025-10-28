'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AssetFiltersProps {
    assetTypes: string[];
    userNames: string[];
    departments: string[];
    statuses: string[];
    locations: string[];
}

export function AssetFilters({
    assetTypes,
    userNames,
    departments,
    statuses,
    locations
}: AssetFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const [filters, setFilters] = useState({
        assetType: searchParams.get('assetType') || 'all',
        userName: searchParams.get('userName') || 'all',
        department: searchParams.get('department') || 'all',
        status: searchParams.get('status') || 'all',
        location: searchParams.get('location') || 'all',
        software: searchParams.get('software') || 'all',
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const applyFilters = async () => {
        setIsLoading(true);

        try {
            // Simulate a small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));

            const params = new URLSearchParams();

            // Tambahkan query pencarian jika ada
            const existingQuery = searchParams.get('query');
            if (existingQuery) {
                params.set('query', existingQuery);
            }

            // Tambahkan page jika ada
            const existingPage = searchParams.get('page');
            if (existingPage) {
                params.set('page', existingPage);
            }

            // Hanya tambahkan parameter filter jika bukan 'all'
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== 'all') {
                    params.set(key, value);
                }
            });

            // ✅ Update path ke /dashboard/asset/asset-list
            router.push(`/dashboard/asset/asset-list?${params.toString()}`);
        } catch (error) {
            console.error("Error applying filters:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetFilters = () => {
        setFilters({
            assetType: 'all',
            userName: 'all',
            department: 'all',
            status: 'all',
            location: 'all',
            software: 'all',
        });

        // Hapus semua parameter filter dari URL
        const params = new URLSearchParams();
        const existingQuery = searchParams.get('query');
        if (existingQuery) {
            params.set('query', existingQuery);
        }

        router.push(`/dashboard/asset/asset-list?${params.toString()}`);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== 'all');

    return (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 dark:bg-slate-800/80">
            <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                            🔍 Filter Assets
                            <Badge variant="outline" className="ml-2 bg-blue-500 text-white text-xs">
                                Advanced Search
                            </Badge>
                        </h3>
                        {hasActiveFilters && (
                            <Badge variant="destructive" className="text-xs">
                                Active Filters
                            </Badge>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {/* Asset Type Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Asset Type
                            </label>
                            <Select
                                value={filters.assetType}
                                onValueChange={(value) => handleFilterChange('assetType', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {assetTypes.map((type, index) => (
                                        <SelectItem key={index} value={type || ''}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* User Name Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                User Name
                            </label>
                            <Select
                                value={filters.userName}
                                onValueChange={(value) => handleFilterChange('userName', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Users" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    {userNames.map((name, index) => (
                                        <SelectItem key={index} value={name || ''}>
                                            {name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Department Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Department
                            </label>
                            <Select
                                value={filters.department}
                                onValueChange={(value) => handleFilterChange('department', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map((dept, index) => (
                                        <SelectItem key={index} value={dept || ''}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Status
                            </label>
                            <Select
                                value={filters.status}
                                onValueChange={(value) => handleFilterChange('status', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    {statuses.map((status, index) => (
                                        <SelectItem key={index} value={status || ''}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Location Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Location
                            </label>
                            <Select
                                value={filters.location}
                                onValueChange={(value) => handleFilterChange('location', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Locations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Locations</SelectItem>
                                    {locations.map((location, index) => (
                                        <SelectItem key={index} value={location || ''}>
                                            {location}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Software Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Software
                            </label>
                            <Select
                                value={filters.software}
                                onValueChange={(value) => handleFilterChange('software', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Software Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Assets</SelectItem>
                                    <SelectItem value="with-software">With Software</SelectItem>
                                    <SelectItem value="without-software">Without Software</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-2">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            {hasActiveFilters ? (
                                <span>📊 Filters applied: {Object.values(filters).filter(v => v !== 'all').length}</span>
                            ) : (
                                <span>ℹ️ No active filters</span>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetFilters}
                                disabled={!hasActiveFilters || isLoading}
                            >
                                🔄 Reset Filters
                            </Button>
                            <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={applyFilters}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Applying...
                                    </>
                                ) : (
                                    "🔍 Apply Filters"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}