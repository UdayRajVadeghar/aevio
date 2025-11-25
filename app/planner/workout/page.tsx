"use client";

import { ThemeToggle } from "@/components/ui/hero-section/theme-toggle";
import { Button } from "@/components/ui/shadcn/button";
import { Separator } from "@/components/ui/shadcn/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/shadcn/sidebar";
import { cn } from "@/lib/utils";
import {
  Bot,
  ChevronRight,
  Mic,
  MoreHorizontal,
  Paperclip,
  Plus,
  Send,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function WorkoutPlannerChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Workout Architect. Ready to build your perfect routine? Tell me about your goals, equipment access, and schedule.",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    // Simulate response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I've analyzed that. Let's get specific. How many days a week can you commit to training? I can design a split that maximizes hypertrophy while keeping your recovery windows optimal.",
        },
      ]);
    }, 1000);
  };

  // Mock data for history
  const historyItems = [
    { title: "Hypertrophy Push/Pull", date: "Today" },
    { title: "Marathon Prep Week 4", date: "Yesterday" },
    { title: "Home Dumbbell Only", date: "Previous 7 Days" },
    { title: "Mobility Routine", date: "Previous 7 Days" },
  ];

  return (
    <SidebarProvider>
      <AppSidebar historyItems={historyItems} />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background z-10 h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/planner"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Planner
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Workout Architect</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col relative">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
            <div className="max-w-3xl mx-auto space-y-8 pb-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-4 w-full",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "flex flex-col gap-1 max-w-[80%]",
                      msg.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {msg.role === "user" ? "You" : "Architect"}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "p-4 rounded-2xl text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted/50 border border-border/50 rounded-tl-sm"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-background border-t">
            <div className="max-w-3xl mx-auto relative">
              <div className="relative flex items-end gap-2 p-2 bg-muted/30 border border-input rounded-xl focus-within:ring-2 focus-within:ring-ring focus-within:border-primary transition-all shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground rounded-lg"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Describe your goals, limitations, or equipment..."
                  className="flex-1 bg-transparent border-none outline-none resize-none py-2.5 text-sm min-h-[44px] max-h-[200px] placeholder:text-muted-foreground"
                  rows={1}
                />
                {input.trim() ? (
                  <Button
                    size="icon"
                    onClick={handleSend}
                    className="h-9 w-9 shrink-0 rounded-lg"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground rounded-lg"
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <div className="text-center mt-2">
                <p className="text-[10px] text-muted-foreground">
                  AI-generated plans should be reviewed by a professional.
                </p>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppSidebar({
  historyItems,
}: {
  historyItems: { title: string; date: string }[];
}) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/planner">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Bot className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Aevio</span>
                  <span className="truncate text-xs">Planner</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <div className="px-2 py-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 shadow-sm bg-background"
            >
              <Plus className="w-4 h-4" />
              <span className="truncate">New Workout Plan</span>
            </Button>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Plans</SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu>
              {historyItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <a href="#" className="flex justify-between">
                      <span className="truncate">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Clear History</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between p-2">
          <ThemeToggle />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">User</span>
                <span className="truncate text-xs">user@example.com</span>
              </div>
              <MoreHorizontal className="ml-auto size-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
