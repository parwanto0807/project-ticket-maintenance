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
      label: "Riwayat Tiket",
      active: pathname === "/dashboard/maintenance/ticket",
      icon: FaHistory,
      submenus: [],
    },
    {
      href: "/dashboard/maintenance/ticket/create",
      label: "Buat Tiket",
      active: pathname === "/dashboard/maintenance/ticket/create",
      icon: FaTicketAlt,
      submenus: [],
    },
    {
      href: "/dashboard/asset/asset-list-user",
      label: "Aset Pengguna",
      active: pathname === "/dashboard/asset/asset-list-user",
      icon: FaArchive,
      submenus: [],
    },
  ];

  if (role === "USER") {
    return [
      {
        groupLabel: "LAYANAN TAMBAHAN",
        menus: additionalMenuItems,
      },
    ];
  }

  const additionalMenuItemsTecnician: Menu[] = [
    {
      href: "/dashboard/technician/schedule",
      label: "Jadwal Teknisi",
      active: pathname === "/dashboard/technician/schedule",
      icon: FaHistory,
      submenus: [],
    },
    {
      href: "/dashboard/technician/history",
      label: "Riwayat Pemeliharaan",
      active: pathname === "/dashboard/technician/history",
      icon: FaTicketAlt,
      submenus: [],
    },
  ];

  if (role === "TECHNICIAN") {
    return [
      {
        groupLabel: "LAYANAN TAMBAHAN TEKNISI",
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
          label: "DASHBOARD",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "DATA MASTER",
      menus: [
        {
          href: "/dashboard/master",
          label: "DATA MASTER",
          active: pathname.includes("/dashboard/master"),
          icon: Boxes,
          submenus: [
            {
              href: "/dashboard/master/products",
              label: "Produk",
              active: pathname === "/dashboard/master/products",
            },
            {
              href: "/dashboard/master/software",
              label: "Perangkat Lunak",
              active: pathname === "/dashboard/master/software",
            },
            {
              href: "/dashboard/master/employees",
              label: "Karyawan",
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
      groupLabel: "MANAJEMEN ASET",
      menus: [
        {
          href: "/dashboard/asset",
          label: "ASET",
          active: pathname.includes("/dashboard/asset"),
          icon: HardDrive,
          submenus: [
            {
              href: "/dashboard/asset/overview",
              label: "Ikhtisar Aset",
              active: pathname === "/dashboard/asset/overview",
            },
            {
              href: "/dashboard/asset/asset-list",
              label: "Daftar Aset",
              active: pathname === "/dashboard/asset/asset-list",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "MANAJEMEN PEMELIHARAAN",
      menus: [
        {
          href: "#",
          label: "TEKNISI",
          active: pathname.includes("#"),
          icon: Users,
          submenus: [
            {
              href: "/dashboard/technician/assign",
              label: "Penugasan Teknisi",
              active: pathname === "/dashboard/technician/assign",
            },
            {
              href: "/dashboard/technician/planner",
              label: "Penjadwalan Berkala",
              active: pathname === "/dashboard/technician/planner",
            },
            {
              href: "/dashboard/technician/schedule",
              label: "Jadwal Teknisi",
              active: pathname === "/dashboard/technician/schedule",
            },
            {
              href: "/dashboard/technician/history",
              label: "Riwayat Teknisi",
              active: pathname === "/dashboard/technician/history",
            },
            {
              href: "/dashboard/technician/list",
              label: "Daftar Teknisi",
              active: pathname === "/dashboard/technician/list",
            },
          ],
        },
      ],
    },
  ];
}
