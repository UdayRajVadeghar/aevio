import { QueryProvider } from "./components/query-provider";
import { Sidebar } from "./components/sidebar";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
        >
          <div className="w-full max-w-3xl mx-auto p-6 md:p-12 min-h-full flex items-center">
            <div className="w-full py-12">{children}</div>
          </div>
        </main>
      </div>
    </QueryProvider>
  );
}
