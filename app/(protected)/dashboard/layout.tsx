import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export default function DemoLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <div>
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
    </div>
  )
}
