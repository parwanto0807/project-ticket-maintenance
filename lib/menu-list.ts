import {
  // Settings,
  // Bookmark,
  // SquarePen,
  LayoutGrid,
  Boxes,
  // Omega,
  HardDrive,
  Wrench,
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
import { IconType } from 'react-icons';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  disabled?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: IconType;
  submenus: Submenu[];
  disabled?: boolean;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string, role: string): Group[] {
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
              href: "/dashboard/master/price-product",
              label: "Products Price",
              active: pathname === "/dashboard/master/price-product",
            },
            // {
            //   href: "/dashboard/master/customers",
            //   label: "Customers",
            //   active: pathname === "/dashboard/master/customers",
            // },
            // {
            //   href: "/dashboard/master/supplier",
            //   label: "Suppliers",
            //   active: pathname === "/dashboard/master/supplier",
            // },
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
            // {
            //   href: "/dashboard/assets/register",
            //   label: "Register Asset",
            //   active: pathname === "/dashboard/assets/register",
            // },
            // {
            //   href: "/dashboard/assets/tracking",
            //   label: "Asset Tracking",
            //   active: pathname === "/dashboard/assets/tracking",
            // },
            // {
            //   href: "/dashboard/assets/depreciation",
            //   label: "Depreciation",
            //   active: pathname === "/dashboard/assets/depreciation",
            // },
          ],
        },
        // {
        //   href: "#",
        //   label: "MAINTENANCE",
        //   active: pathname.includes("#"),
        //   icon: Wrench,
        //   submenus: [
        //     {
        //       href: "/dashboard/maintenance/ticket",
        //       label: "Maintenance Tickets",
        //       active: pathname === "/dashboard/maintenance/ticket",
        //     },
        //     {
        //       href: "/dashboard/assets/maintenance/schedule",
        //       label: "Maintenance Schedule",
        //       active: pathname === "/dashboard/assets/maintenance/schedule",
        //     },
        //     {
        //       href: "/dashboard/assets/maintenance/history",
        //       label: "Maintenance History",
        //       active: pathname === "/dashboard/assets/maintenance/history",
        //     },
        //   ],
        // },
      ],
    },
    {
      groupLabel: "MAINTENANCE MANAGEMENT",
      menus: [
        {
          href: "#",
          label: "MAINTENANCE",
          active: pathname.includes("#"),
          icon: Wrench,
          submenus: [
            {
              href: "/dashboard/maintenance/ticket",
              label: "Maintenance Tickets",
              active: pathname === "/dashboard/maintenance/ticket",
            },
            {
              href: "/dashboard/assets/maintenance/schedule",
              label: "Maintenance Schedule",
              active: pathname === "/dashboard/assets/maintenance/schedule",
            },
            {
              href: "/dashboard/assets/maintenance/history",
              label: "Maintenance History",
              active: pathname === "/dashboard/assets/maintenance/history",
            },
          ],
        },
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
              href: "/dashboard/technician/history",
              label: "Technician History",
              active: pathname === "/dashboard/technician/history",
            },
            {
              href: "/dashboard/technician/schedule",
              label: "Technician Schedule",
              active: pathname === "/dashboard/technician/schedule",
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
    // {
    //   groupLabel: "TRANSACTION",
    //   menus: [
    //     {
    //       href: "/dashboard/transactions/logistic",
    //       label: "LOGISTIC",
    //       active: pathname.includes("/dashboard/transactions/logistic"),
    //       icon: SquarePen,
    //       submenus: [
    //         {
    //           href: "/dashboard/transactions/logistic/whEntry",
    //           label: "Warehouse Entry",
    //           active: pathname === "/dashboard/transactions/logistic/whEntry",
    //         },
    //         {
    //           href: "/dashboard/transactions/logistic/stock",
    //           label: "Inventory Data Stock",
    //           active: pathname === "/dashboard/transactions/logistic/stock",
    //         },
    //         {
    //           href: "/dashboard/transactions/logistic/tera",
    //           label: "Inventory Data Tera",
    //           active: pathname === "/dashboard/transactions/logistic/tera",
    //         },
    //         {
    //           href: "/dashboard/logistic/outgoing",
    //           label: "Warehouse Outbound",
    //           active: pathname === "/dashboard/logistic/outgoing",
    //         },
    //         {
    //           href: "/dashboard/logistic/do",
    //           label: "Delivery Order",
    //           active: pathname === "/dashboard/logistic/do",
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   groupLabel: "REPORTS & ANALYTICS",
    //   menus: [
    //     {
    //       href: "/dashboard/reports",
    //       label: "REPORTS",
    //       active: pathname.includes("/dashboard/reports"),
    //       icon: FileText,
    //       submenus: [
    //         {
    //           href: "/dashboard/reports/assets",
    //           label: "Asset Reports",
    //           active: pathname === "/dashboard/reports/assets",
    //         },
    //         {
    //           href: "/dashboard/reports/maintenance",
    //           label: "Maintenance Reports",
    //           active: pathname === "/dashboard/reports/maintenance",
    //         },
    //         {
    //           href: "/dashboard/reports/finance",
    //           label: "Financial Reports",
    //           active: pathname === "/dashboard/reports/finance",
    //         },
    //       ],
    //     },
    //     {
    //       href: "/dashboard/analytics",
    //       label: "ANALYTICS",
    //       active: pathname.includes("/dashboard/analytics"),
    //       icon: BarChart,
    //       submenus: [
    //         {
    //           href: "/dashboard/analytics/assets",
    //           label: "Asset Analytics",
    //           active: pathname === "/dashboard/analytics/assets",
    //         },
    //         {
    //           href: "/dashboard/analytics/maintenance",
    //           label: "Maintenance Analytics",
    //           active: pathname === "/dashboard/analytics/maintenance",
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   groupLabel: "",
    //   menus: [
    //     {
    //       href: "/dashboard/settings",
    //       label: "SETTINGS",
    //       active: pathname.includes("/dashboard/settings"),
    //       icon: Settings,
    //       submenus: [
    //         {
    //           href: "/dashboard/settings/banks",
    //           label: "Bank",
    //           active: pathname.includes("/dashboard/settings/banks"),
    //         },
    //         {
    //           href: "/dashboard/settings/currency",
    //           label: "Currency",
    //           active: pathname.includes("/dashboard/settings/currency"),
    //         },
    //         {
    //           href: "/dashboard/settings/taxs",
    //           label: "Tax",
    //           active: pathname.includes("/dashboard/settings/taxs"),
    //         },
    //         {
    //           href: "/dashboard/settings/users",
    //           label: "User Setting",
    //           active: pathname.includes("/dashboard/settings/users"),
    //         },
    //         {
    //           href: "/dashboard/settings/account",
    //           label: "Account Setting",
    //           active: pathname.includes("/dashboard/settings/account"),
    //         },
    //       ],
    //     },
    //   ],
    // },
  ];
}