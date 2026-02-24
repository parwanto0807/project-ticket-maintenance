import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="max-h-screen pt-4 sm:pt-8 pb-8 px-1 sm:px-6">{children}</div>
    </div>
  );
}
