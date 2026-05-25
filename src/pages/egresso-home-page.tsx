import { NavLink, Outlet } from "react-router-dom"
import { useUser } from "@/contexts/UserContext"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  ArrowLeftIcon,
  GearIcon,
  IdentificationCardIcon,
  InfoIcon,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const egressoSections = [
  {
    path: "/home/egresso/curriculo",
    label: "Currículo",
    icon: IdentificationCardIcon,
    end: false,
  },
  { path: "/home/egresso/sobre", label: "Sobre", icon: InfoIcon, end: false },
  {
    path: "/home/egresso/configuracoes",
    label: "Configurações",
    icon: GearIcon,
    end: false,
  },
] as const

export function EgressoHomePage() {
  const { userData } = useUser()
  
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {egressoSections.map((section) => {
                  const Icon = section.icon

                  return (
                    <SidebarMenuItem key={section.path}>
                      <NavLink to={section.path} end={section.end}>
                        {({ isActive }) => (
                          <SidebarMenuButton tooltip={section.label} isActive={isActive}>
                            <Icon />
                            <span>{section.label}</span>
                          </SidebarMenuButton>
                        )}
                      </NavLink>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarMenuItem className="mb-3">
          <NavLink to="/login">
            <SidebarMenuButton className="text-destructive">
              <ArrowLeftIcon />
              <span>Sair</span>
            </SidebarMenuButton>
          </NavLink>
        </SidebarMenuItem>

        <SidebarSeparator />

        <SidebarFooter>
          <div className="flex-row flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/avatars/01.png" alt="User" />
              <AvatarFallback className="bg-primary text-white">NE</AvatarFallback>
            </Avatar>
            <div className="data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium">{userData.nome}</p>
              <p className="text-xs">{userData.email}</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex items-center gap-3 p-6">
          <SidebarTrigger />
          <img
            src="/logo_ifal.png"
            alt="Instituto Federal de Alagoas"
            className="ml-auto h-14 w-auto"
          />
        </header>

        <main className="flex flex-1 flex-col gap-6 px-6 pb-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
