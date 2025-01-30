
import React from 'react'
import CreateWhEntry from '@/components/dashboard/transactions/logistic/whEntry/create-whentry'
import { ContentLayout } from '@/components/admin-panel/content-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { getBrandFindAll, getCategoryFindAll, getGroupFindAll, getTypeFindAll, getGudangFindAll } from '@/data/master/products';

const WarehouseEntry = async () => {
  const brandFind = await getBrandFindAll() || [];
  const validBrandFind = Array.isArray(brandFind) ? brandFind : [];

  const groupFind = await getGroupFindAll() || [];
  const validGroupFind = Array.isArray(groupFind) ? groupFind : [];

  const categoryFind = await getCategoryFindAll() || [];
  const validCategoryFind = Array.isArray(categoryFind) ? categoryFind : [];

  const typeFind = await getTypeFindAll() || [];
  const validTypeFind = Array.isArray(typeFind) ? typeFind : [];

  const gudangFind = await getGudangFindAll() || [];
  const validGudangFind = Array.isArray(gudangFind) ? gudangFind : [];


  return (
    <ContentLayout title='Add Warehouse Entry'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Logistic</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/transactions/logistic/whEntry">Warehouse Entry</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create</BreadcrumbPage>
          </BreadcrumbItem>

        </BreadcrumbList>
      </Breadcrumb>
      <CreateWhEntry
        categoryFind={validCategoryFind}
        typeFind={validTypeFind}
        groupFind={validGroupFind}
        brandFind={validBrandFind}
        gudangFind={validGudangFind}
      />
    </ContentLayout>
  )
}

export default WarehouseEntry
