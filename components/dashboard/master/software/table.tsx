import { fetchFilteredSoftware } from '@/data/asset/software';
import { UpdateSoftware } from './buttons';
import DeleteAlertSoftware from './alert-delete';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Package,
    Building,
    Calendar,
    Globe,
    FileText,
    Cpu,
    Shield,
    Factory,
    CheckCircle,
    XCircle
} from 'lucide-react';

const getCategoryIcon = (category: string | null) => {
    switch (category?.toLowerCase()) {
        case 'os':
            return <Cpu className="h-4 w-4 text-blue-600" />;
        case 'antivirus':
            return <Shield className="h-4 w-4 text-green-600" />;
        case 'cad':
        case 'erp':
            return <Factory className="h-4 w-4 text-purple-600" />;
        default:
            return <Package className="h-4 w-4 text-gray-600" />;
    }
};

const getLicenseTypeBadge = (licenseType: string | null) => {
    switch (licenseType?.toLowerCase()) {
        case 'subscription':
            return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Subscription</Badge>;
        case 'proprietary':
            return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Proprietary</Badge>;
        case 'oem':
            return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">OEM</Badge>;
        case 'freeware':
            return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Open Source / Freeware</Badge>;
        case 'shareware':
            return <Badge variant="outline" className="bg-purple-50 text-cyan-700 border-purple-200">Shareware</Badge>;
        default:
            return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Unknown</Badge>;
    }
};

const getCategoryBadge = (category: string | null) => {
    switch (category?.toLowerCase()) {
        case 'os':
            return <Badge variant="secondary" className="bg-blue-100 text-blue-800">OS</Badge>;
        case 'antivirus':
            return <Badge variant="secondary" className="bg-green-100 text-green-800">Antivirus</Badge>;
        case 'cad':
            return <Badge variant="secondary" className="bg-purple-100 text-purple-800">CAD</Badge>;
        case 'erp':
            return <Badge variant="secondary" className="bg-orange-100 text-orange-800">ERP</Badge>;
        default:
            return <Badge variant="secondary" className="bg-gray-100 text-gray-800">{category || 'Uncategorized'}</Badge>;
    }
};

export default async function SoftwareTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {
    const software = await fetchFilteredSoftware(query, currentPage);

    return (
        <div className="space-y-6">
            {/* Header dengan Gradient */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-700 border-0 shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-white">
                                Software Management
                            </CardTitle>
                            <CardDescription className="text-blue-100">
                                Kelola inventori perangkat lunak perusahaan - {software?.length || 0} software terdaftar
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {software?.map((item) => (
                    <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        {getCategoryIcon(item.category)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Building className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">{item.vendor || 'No vendor'}</span>
                                        </div>
                                    </div>
                                </div>
                                {getCategoryBadge(item.category)}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                            {/* License Type & Expiry */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    {getLicenseTypeBadge(item.licenseType)}
                                </div>
                                {item.defaultExpiry && (
                                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        <span>{item.defaultExpiry} bulan</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {item.description && (
                                <div className="flex items-start space-x-2">
                                    <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                                        {item.description}
                                    </p>
                                </div>
                            )}

                            {/* Website */}
                            {item.website && (
                                <div className="flex items-center space-x-2">
                                    <Globe className="h-4 w-4 text-gray-400" />
                                    <a
                                        href={item.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline truncate"
                                    >
                                        {item.website}
                                    </a>
                                </div>
                            )}

                            {/* Installation Status */}
                            <div className="flex items-center justify-between pt-2 border-t">
                                <Badge
                                    variant={item.installations?.[0]?.isActive ? "default" : "secondary"}
                                    className={
                                        item.installations?.[0]?.isActive
                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                    }
                                >
                                    {item.installations?.[0] ? `${item.installations.length} Active` : 'No Installation'}
                                </Badge>
                                <div className="flex space-x-2">
                                    <UpdateSoftware id={item.id} />
                                    <DeleteAlertSoftware id={item.id} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop View */}
            <Card className="hidden md:block shadow-lg">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center space-x-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <span>Software Inventory</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                <TableHead className="font-semibold text-gray-900 pl-6">
                                    <div className="flex items-center space-x-2">
                                        <Package className="h-4 w-4" />
                                        <span>Nama Software</span>
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                    <div className="flex items-center space-x-2">
                                        <Building className="h-4 w-4" />
                                        <span>Vendor</span>
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                    Kategori
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                    Tipe Lisensi
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Masa Berlaku</span>
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">
                                    Status
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900 text-right pr-6">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {software?.map((item) => (
                                <TableRow
                                    key={item.id}
                                    className="hover:bg-gray-50/80 transition-colors group"
                                >
                                    {/* Nama Software */}
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                                {getCategoryIcon(item.category)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                {item.website && (
                                                    <a
                                                        href={item.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-1 text-xs text-blue-600 hover:underline mt-1"
                                                    >
                                                        <Globe className="h-3 w-3" />
                                                        <span>Website</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Vendor */}
                                    <TableCell className="py-4">
                                        <div className="flex items-center space-x-2">
                                            <Building className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-700">{item.vendor || '-'}</span>
                                        </div>
                                    </TableCell>

                                    {/* Kategori */}
                                    <TableCell className="py-4">
                                        {getCategoryBadge(item.category)}
                                    </TableCell>

                                    {/* Tipe Lisensi */}
                                    <TableCell className="py-4">
                                        {getLicenseTypeBadge(item.licenseType)}
                                    </TableCell>

                                    {/* Masa Berlaku */}
                                    <TableCell className="py-4">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-700">
                                                {item.defaultExpiry ? `${item.defaultExpiry} bulan` : '-'}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Status Installasi */}
                                    <TableCell className="py-4">
                                        <Badge
                                            variant={item.installations?.length > 0 ? "default" : "secondary"}
                                            className={
                                                item.installations?.length > 0
                                                    ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                                                    : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200"
                                            }
                                        >
                                            {item.installations?.length > 0 ? (
                                                <>
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Terpakai
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Belum Terpakai
                                                </>
                                            )}
                                        </Badge>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="py-4 pr-6">
                                        <div className="flex justify-end space-x-2">
                                            <UpdateSoftware id={item.id} />
                                            <DeleteAlertSoftware id={item.id} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}