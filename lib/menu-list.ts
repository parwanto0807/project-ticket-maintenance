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
      label: "Ticket History",
      active: pathname === "/dashboard/maintenance/ticket",
      icon: FaHistory,
      submenus: [],
    },
    {
      href: "/dashboard/maintenance/ticket/create",
      label: "Create Ticket",
      active: pathname === "/dashboard/maintenance/ticket/create",
      icon: FaTicketAlt,
      submenus: [],
    },
    {
      href: "/dashboard/asset/asset-list-user",
      label: "User Asset",
      active: pathname === "/dashboard/asset/asset-list-user",
      icon: FaArchive,
      submenus: [],
    },
  ];

  if (role === "USER") {
    return [
      {
        groupLabel: "ADDITIONAL SERVICES",
        menus: additionalMenuItems,
      },
    ];
  }

  const additionalMenuItemsTecnician: Menu[] = [
    {
      href: "/dashboard/technician/schedule",
      label: "Technician Schedule",
      active: pathname === "/dashboard/technician/schedule",
      icon: FaHistory,
      submenus: [],
    },
    {
      href: "/dashboard/technician/history",
      label: "History Maintenance",
      active: pathname === "/dashboard/technician/history",
      icon: FaTicketAlt,
      submenus: [],
    },
  ];

  if (role === "TECHNICIAN") {
    return [
      {
        groupLabel: "ADDITIONAL SERVICES TECHNICIAN",
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
      groupLabel: "MASTER DATA",
      menus: [
        {
          href: "/dashboard/master",
          label: "MASTER DATA",
          active: pathname.includes("/dashboard/master"),
          icon: Boxes,
          submenus: [
            {
              href: "/dashboard/master/products",
              label: "Products",
              active: pathname === "/dashboard/master/products",
            },
            {
              href: "/dashboard/master/software",
              label: "Software",
              active: pathname === "/dashboard/master/software",
            },
            {
              href: "/dashboard/master/price-product",
              label: "Products Price",
              active: pathname === "/dashboard/master/price-product",
            },
            {
              href: "/dashboard/master/employees",
              label: "Employees",
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
      groupLabel: "ASSET MANAGEMENT",
      menus: [
        {
          href: "/dashboard/asset",
          label: "ASSETS",
          active: pathname.includes("/dashboard/asset"),
          icon: HardDrive,
          submenus: [
            {
              href: "/dashboard/asset/asset-list",
              label: "Asset List",
              active: pathname === "/dashboard/asset/asset-list",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "MAINTENANCE MANAGEMENT",
      menus: [
        {
          href: "#",
          label: "TECHNICIAN",
          active: pathname.includes("#"),
          icon: Users,
          submenus: [
            {
              href: "/dashboard/technician/assign",
              label: "Assign Technician",
              active: pathname === "/dashboard/technician/assign",
            },
            {
              href: "/dashboard/technician/schedule",
              label: "Technician Schedule",
              active: pathname === "/dashboard/technician/schedule",
            },
            {
              href: "/dashboard/technician/history",
              label: "Technician History",
              active: pathname === "/dashboard/technician/history",
            },
            {
              href: "/dashboard/technician/list",
              label: "Technician List",
              active: pathname === "/dashboard/technician/list",
            },
          ],
        },
      ],
    },
  ];
}
