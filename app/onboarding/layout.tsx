import { OnboardingSidebar } from "./components/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/shadcn/sidebar";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingSidebar>
      <SidebarInset>
        {/* Mobile Trigger Button */}
        <div className="sticky top-0 z-10 flex items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-b md:hidden">
          <SidebarTrigger />
          <span className="font-semibold">Onboarding Progress</span>
        </div>

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
      </SidebarInset>
    </OnboardingSidebar>
  );
}
