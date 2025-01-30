import {
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  Boxes, 
  Omega
} from "lucide-react";
import { IconType } from 'react-icons';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
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
  // console.log("Role in getMenuList:", role);
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "DASHBOARD",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
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
            {
              href: "/dashboard/master/customers",
              label: "Customers",
              active: pathname === "/dashboard/master/customers",
            },
            {
              href: "/dashboard/master/supplier",
              label: "Suppliers",
              active: pathname === "/dashboard/master/employees",
            },
            {
              href: "/dashboard/master/employees",
              label: "Employees",
              active: pathname === "/dashboard/master/employees",
            },
          ].map(submenu => ({
            ...submenu,
            disabled: role !== "ADMIN", // Menambahkan disabled pada submenu
          })),
        }
      ].map(menu => {
        const updatedMenu = {
          ...menu,
          disabled: role !== "ADMIN", // Menambahkan disabled pada menu utama
        };
        // console.log("Updated Menu:",role, updatedMenu); // Debugging disabled
        return updatedMenu;
      }),
    },    
    {
      groupLabel: "TRANSACTION",
      menus: [
        {
          href: "/dashboard/transactions/meter",
          label: "METER SERVICES",
          active: pathname.includes("/dashboard/transactions/meter"),
          icon: SquarePen,
          submenus: [
            {
              href: "/dashboard/transactions/meter/register",
              label: "Saitec Meter",
              active: pathname === "/dashboard/transactions/meter/register"
            },
            {
              href: "/dashboard/transactions/meter/tenant",
              label: "Saitec Tenants",
              active: pathname === "/dashboard/transactions/meter/tenant"
            },
            {
              href: "/dashboard/transactions/meter/enduser",
              label: "Saitec Enduser",
              active: pathname === "/dashboard/transactions/meter/enduser"
            }
          ]
        },
        {
          href: "/dashboard/transactions/logistic/",
          label: "LOGISTIC",
          active: pathname.includes("/dashboard/transactions/logistic/"),
          icon: SquarePen,
          submenus: [
            {
              href: "/dashboard/transactions/logistic/whEntry",
              label: "Warehouse Entry",
              active: pathname === "/dashboard/transactions/logistic/whEntry"
            },
            {
              href: "/dashboard/transactions/logistic/stock",
              label: "Inventory Data Stock",
              active: pathname === "/dashboard/transactions/logistic/stock"
            },
            {
              href: "/dashboard/transactions/logistic/tera",
              label: "Inventory Data Tera",
              active: pathname === "/dashboard/transactions/logistic/tera"
            },
            {
              href: "/dashboard/logistic/outgoing",
              label: "Warehouse Outbound",
              active: pathname === "/dashboard/logistic/outgoing"
            }, 
            {
              href: "/dashboard/logistic/do",
              label: "Delivery Order",
              active: pathname === "/dashboard/logistic/do"
            }
          ]
        },
        {
          href: "/dashboard/logistic",
          label: "ENGINEERING",
          active: pathname.includes("/dashboard/logistic"),
          icon: Omega,
          submenus: [
            {
              href: "/dashboard/logistic/comissioning",
              label: "Commisioning",
              active: pathname === "/dashboard/logistic/comissioning"
            }
          ]
        },
        
        {
          href: "/dashboard/finance",
          label: "FINANCE",
          active: pathname.includes("/dashboard/finance"),
          icon: Bookmark,
          submenus: [
            {
              href: "/dashboard/finance/invoice-do",
              label: "Invoice DO",
              active: pathname === "/dashboard/finance/invoice-do"
            },
            {
              href: "/dashboard/finance/faktur-number",
              label: "Register Invoice & Faktur Number",
              active: pathname === "/dashboard/finance/faktur-number"
            },
            {
              href: "/dashboard/finance/invoice",
              label: "Invoice",
              active: pathname === "/dashboard/finance/invoice"
            }]
        }
      ]
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard/settings",
          label: "SETTINGS",
          active: pathname.includes("/dashboard/settings"),
          icon: Settings,
          submenus: [
            {
              href: "/dashboard/settings/banks",
              label: "Bank",
              active: pathname.includes("/dashboard/settings/banks"),
            },
            {
              href: "/dashboard/settings/currency",
              label: "Currency",
              active: pathname.includes("/dashboard/settings/currency"),
            },
            {
              href: "/dashboard/settings/taxs",
              label: "Tax",
              active: pathname.includes("/dashboard/settings/taxs"),
            },
            {
              href: "/dashboard/settings/users",
              label: "User Setting",
              active: pathname.includes("/dashboard/settings/users"),
            },
            {
              href: "/dashboard/settings/account",
              label: "Account Setting",
              active: pathname.includes("/dashboard/settings/account"),
            }
          ]
        }

      ]
    }
  ];
}
