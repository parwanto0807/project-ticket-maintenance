

"use client";

import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import UserPanelLayout from "@/components/user-panel/user-panel-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  const role = user?.role || "USER"; // Default ke USER jika role tidak ada

  return (
    <div>
      {role === "ADMIN" ? (
        <AdminPanelLayout>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            {children}
          </ThemeProvider>
        </AdminPanelLayout>
      ) : (
        <UserPanelLayout>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            {children}
          </ThemeProvider>
        </UserPanelLayout>
      )}
    </div>
  );
}


// import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
// import { ThemeProvider } from "@/components/theme-provider";
// import { Toaster } from "@/components/ui/sonner";

// export default function DemoLayout({
//   children
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div>
//       <AdminPanelLayout>
//       <ThemeProvider
//             attribute="class"
//             defaultTheme="system"
//             enableSystem
//             disableTransitionOnChange
//           >
//             <Toaster />
//             {children}
//           </ThemeProvider>
//       </AdminPanelLayout>
//     </div>
//   )
// }
