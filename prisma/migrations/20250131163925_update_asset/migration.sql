-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED');

-- CreateTable
CREATE TABLE "Employee" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "signInvoice" BOOLEAN NOT NULL DEFAULT false,
    "user_dept" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Department" (
    "_id" TEXT NOT NULL,
    "dept_name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Product" (
    "_id" TEXT NOT NULL,
    "part_number" TEXT NOT NULL,
    "part_name" TEXT NOT NULL,
    "nick_name" TEXT NOT NULL,
    "satuan_pemasukan" TEXT NOT NULL,
    "satuan_penyimpanan" TEXT NOT NULL,
    "satuan_pengeluaran" TEXT NOT NULL,
    "conversi_pemasukan" INTEGER NOT NULL,
    "conversi_penyimpanan" INTEGER NOT NULL,
    "conversi_pengeluaran" INTEGER NOT NULL,
    "description" TEXT,
    "minStock" INTEGER NOT NULL,
    "maxStock" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gudang_id" TEXT NOT NULL,
    "lokasirak_id" TEXT NOT NULL,
    "rak_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "kategori_id" TEXT NOT NULL,
    "jenisi_id" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Harga" (
    "_id" TEXT NOT NULL,
    "HargaJualProduct" TEXT NOT NULL,
    "Matauang" TEXT NOT NULL,
    "hargaHpp" DECIMAL(15,2) NOT NULL,
    "hargaJual" DECIMAL(15,2) NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Harga_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Group" (
    "_id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Gudang" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gudang_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Rak" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rak_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "LokasiRak" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LokasiRak_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "MataUang" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "MataUang_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "JenisProduct" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JenisProduct_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "KategoriProduct" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KategoriProduct_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "status" "AssetStatus" NOT NULL,
    "location" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "purchaseCost" DOUBLE PRECISION,
    "residualValue" DOUBLE PRECISION,
    "usefulLife" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assetTypeId" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "employeeId" TEXT,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Depreciation" (
    "id" SERIAL NOT NULL,
    "assetId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "depreciationTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Depreciation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepreciationType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepreciationType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_user_dept_fkey" FOREIGN KEY ("user_dept") REFERENCES "Department"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_jenisi_id_fkey" FOREIGN KEY ("jenisi_id") REFERENCES "JenisProduct"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "KategoriProduct"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_rak_id_fkey" FOREIGN KEY ("rak_id") REFERENCES "Rak"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_lokasirak_id_fkey" FOREIGN KEY ("lokasirak_id") REFERENCES "LokasiRak"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_gudang_id_fkey" FOREIGN KEY ("gudang_id") REFERENCES "Gudang"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harga" ADD CONSTRAINT "Harga_HargaJualProduct_fkey" FOREIGN KEY ("HargaJualProduct") REFERENCES "Product"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Harga" ADD CONSTRAINT "Harga_Matauang_fkey" FOREIGN KEY ("Matauang") REFERENCES "MataUang"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_assetTypeId_fkey" FOREIGN KEY ("assetTypeId") REFERENCES "AssetType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depreciation" ADD CONSTRAINT "Depreciation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depreciation" ADD CONSTRAINT "Depreciation_depreciationTypeId_fkey" FOREIGN KEY ("depreciationTypeId") REFERENCES "DepreciationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
