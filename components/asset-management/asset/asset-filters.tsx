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
import { Badge } from "@/components/ui/badge";
import { AssetHelpDialog } from "./help-dialog";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Filter, RotateCcw } from "lucide-react";

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
    const [isOpen, setIsOpen] = useState(false);

    const [filters, setFilters] = useState({
        assetType: searchParams.get('assetType') || 'all',
        userName: searchParams.get('userName') || 'all',
        department: searchParams.get('department') || 'all',
        status: searchParams.get('status') || 'all',
        location: searchParams.get('location') || 'all',
        software: searchParams.get('software') || 'all',
    });

    const applyFilters = (newFilters: typeof filters) => {
        const params = new URLSearchParams();
        const existingQuery = searchParams.get('query');
        if (existingQuery) params.set('query', existingQuery);
        params.set('page', '1');
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value !== 'all') params.set(key, value);
        });
        router.push(`/dashboard/asset/asset-list?${params.toString()}`);
    };

    const handleFilterChange = (key: string, value: string) => {
        const updated = { ...filters, [key]: value };
        setFilters(updated);
        applyFilters(updated);
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
        const params = new URLSearchParams();
        const q = searchParams.get('query');
        if (q) params.set('query', q);
        router.push(`/dashboard/asset/asset-list?${params.toString()}`);
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== 'all');
    const activeCount = Object.values(filters).filter(v => v !== 'all').length;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
            <div className="flex items-center justify-between px-3 py-4 border-b border-slate-200 dark:border-slate-800">
                <CollapsibleTrigger asChild>
                    <button
                        type="button"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <Filter className="h-4 w-4" />
                        Filter
                        {hasActiveFilters && (
                            <Badge variant="secondary" className="text-[10px] font-medium h-5 px-1.5">
                                {activeCount}
                            </Badge>
                        )}
                        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </CollapsibleTrigger>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {activeCount} filter aktif
                        </span>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        disabled={!hasActiveFilters}
                        className="h-8 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        Reset
                    </Button>
                    <AssetHelpDialog />
                </div>
            </div>
            <CollapsibleContent>
                <div className="p-3 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Tipe Aset</label>
                            <Select value={filters.assetType} onValueChange={(v) => handleFilterChange('assetType', v)}>
                                <SelectTrigger className="h-9 rounded-lg"> <SelectValue placeholder="Semua" /> </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    {assetTypes.map((t, i) => <SelectItem key={i} value={t || ''}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Pengguna</label>
                            <Select value={filters.userName} onValueChange={(v) => handleFilterChange('userName', v)}>
                                <SelectTrigger className="h-9 rounded-lg"> <SelectValue placeholder="Semua" /> </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    {userNames.map((n, i) => <SelectItem key={i} value={n || ''}>{n}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Departemen</label>
                            <Select value={filters.department} onValueChange={(v) => handleFilterChange('department', v)}>
                                <SelectTrigger className="h-9 rounded-lg"> <SelectValue placeholder="Semua" /> </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    {departments.map((d, i) => <SelectItem key={i} value={d || ''}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Status</label>
                            <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                                <SelectTrigger className="h-9 rounded-lg"> <SelectValue placeholder="Semua" /> </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    {statuses.map((s, i) => <SelectItem key={i} value={s || ''}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Lokasi</label>
                            <Select value={filters.location} onValueChange={(v) => handleFilterChange('location', v)}>
                                <SelectTrigger className="h-9 rounded-lg"> <SelectValue placeholder="Semua" /> </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    {locations.map((l, i) => <SelectItem key={i} value={l || ''}>{l}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Software</label>
                            <Select value={filters.software} onValueChange={(v) => handleFilterChange('software', v)}>
                                <SelectTrigger className="h-9 rounded-lg"> <SelectValue placeholder="Semua" /> </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Aset</SelectItem>
                                    <SelectItem value="with-software">Dengan Software</SelectItem>
                                    <SelectItem value="without-software">Tanpa Software</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
