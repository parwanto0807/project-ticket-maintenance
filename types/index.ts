import { Icons } from '../components/icons'; // Adjusted import path

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  group?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

// Updated PageProps type
export type PageProps = {
  params: Promise<{ id: string }>; // Changed to a direct object
}

// Updated PageProps type
export type PagePropsEditTransactionStock = {
  params: Promise<{ id: string; gudangId: string }>; // Changed to a direct object
}
// Updated PageProps type
export type PagePropsFindTera = {
  params: Promise<{ serialNumber: string }>; // Changed to a direct object
}