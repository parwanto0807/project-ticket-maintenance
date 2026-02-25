import {
  // Settings,
  // Bookmark,
  // SquarePen,
  LayoutGrid,
  Boxes,
  // Omega,
  HardDrive,
  // Wrench,
  // FileText,
  // BarChart,
  // Scan,
  // Bell,
  // ClipboardList,
  Users,
  // Tool,
  // Calendar,
  // Archive,
  // Shield,
  // Database,
} from "lucide-react";
// import { IconType } from 'react-icons';
import { FaHistory, FaTicketAlt, FaArchive } from "react-icons/fa";
import { ComponentType, SVGProps } from "react";

export type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>; // Menggunakan `any` untuk kompatibilitas dengan ikon dari library berbeda
  submenus: Submenu[];
  disabled?: boolean;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string, role: string): Group[] {
  const additionalMenuItems: Menu[] = [
    {
      href: "/dashboard/maintenance/ticket",
      label: "riwayat_tiket",
      active: pathname === "/dashboard/maintenance/ticket",
      icon: FaHistory,
      submenus: [],
    },
    {
      href: "/dashboard/maintenance/ticket/create",
      label: "buat_tiket",
      active: pathname === "/dashboard/maintenance/ticket/create",
      icon: FaTicketAlt,
      submenus: [],
    },
    {
      href: "/dashboard/asset/asset-list-user",
      label: "aset_pengguna",
      active: pathname === "/dashboard/asset/asset-list-user",
      icon: FaArchive,
      submenus: [],
    },
  ];

  if (role === "USER") {
    return [
      {
        groupLabel: "layanan_tambahan",
        menus: additionalMenuItems,
      },
    ];
  }

  const additionalMenuItemsTecnician: Menu[] = [
    {
      href: "/dashboard/technician/schedule",
      label: "jadwal_teknisi",
      active: pathname === "/dashboard/technician/schedule",
      icon: FaHistory,
      submenus: [],
    },
    {
      href: "/dashboard/technician/history",
      label: "riwayat_pemeliharaan",
      active: pathname === "/dashboard/technician/history",
      icon: FaTicketAlt,
      submenus: [],
    },
  ];

  if (role === "TECHNICIAN") {
    return [
      {
        groupLabel: "layanan_tambahan_teknisi",
        menus: additionalMenuItemsTecnician,
      },
    ];
  }
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "data_master",
      menus: [
        {
          href: "/dashboard/master",
          label: "data_master",
          active: pathname.includes("/dashboard/master"),
          icon: Boxes,
          submenus: [
            {
              href: "/dashboard/master/products",
              label: "produk",
              active: pathname === "/dashboard/master/products",
            },
            {
              href: "/dashboard/master/software",
              label: "perangkat_lunak",
              active: pathname === "/dashboard/master/software",
            },
            {
              href: "/dashboard/master/employees",
              label: "karyawan",
              active: pathname === "/dashboard/master/employees",
            },
          ].map((submenu) => ({
            ...submenu,
            disabled: role !== "ADMIN", // Menambahkan disabled pada submenu
          })),
        },
      ].map((menu) => ({
        ...menu,
        disabled: role !== "ADMIN", // Menambahkan disabled pada menu utama
      })),
    },
    {
      groupLabel: "manajemen_aset",
      menus: [
        {
          href: "/dashboard/asset",
          label: "aset",
          active: pathname.includes("/dashboard/asset"),
          icon: HardDrive,
          submenus: [
            {
              href: "/dashboard/asset/overview",
              label: "ikhtisar_aset",
              active: pathname === "/dashboard/asset/overview",
            },
            {
              href: "/dashboard/asset/asset-list",
              label: "daftar_aset",
              active: pathname === "/dashboard/asset/asset-list",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "manajemen_pemeliharaan",
      menus: [
        {
          href: "#",
          label: "teknisi",
          active: pathname.includes("#"),
          icon: Users,
          submenus: [
            {
              href: "/dashboard/technician/assign",
              label: "penugasan_teknisi",
              active: pathname === "/dashboard/technician/assign",
            },
            {
              href: "/dashboard/technician/planner",
              label: "penjadwalan_berkala",
              active: pathname === "/dashboard/technician/planner",
            },
            {
              href: "/dashboard/technician/schedule",
              label: "jadwal_teknisi",
              active: pathname === "/dashboard/technician/schedule",
            },
            {
              href: "/dashboard/technician/history",
              label: "riwayat_teknisi",
              active: pathname === "/dashboard/technician/history",
            },
            {
              href: "/dashboard/technician/list",
              label: "daftar_teknisi",
              active: pathname === "/dashboard/technician/list",
            },
          ],
        },
      ],
    },
  ];
}
