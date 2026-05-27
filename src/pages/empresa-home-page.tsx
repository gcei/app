import { NavLink, Outlet } from "react-router-dom"
import {
  ArrowLeftIcon,
  ClipboardTextIcon,
  GearIcon,
  HouseIcon,
  UsersIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { useAuth } from "@/contexts/AuthContext"

const empresaSections = [
  {
    path: "/home/interno/inicio",
    label: "Início",
    icon: HouseIcon,
    end: false,
  },
  {
    path: "/home/interno/candidatos",
    label: "Candidatos",
    icon: UsersIcon,
    end: false,
  },
  {
    path: "/home/interno/egressos-cadastrados",
    label: "Egressos cadastrados",
    icon: UsersThreeIcon,
    end: false,
  },
  {
    path: "/home/interno/pesquisa-anual",
    label: "Pesquisa do egresso",
    icon: ClipboardTextIcon,
    end: false,
  },
  {
    path: "/home/interno/configuracoes",
    label: "Configurações",
    icon: GearIcon,
    end: false,
  },
] as const

function getInitials(nome: string) {
  return (
    nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase() ?? "")
      .join("") || "?"
  )
}

export function EmpresaHomePage() {
  const { user, logout } = useAuth()

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {empresaSections.map((section) => {
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
          <SidebarMenuButton className="text-destructive" onClick={logout}>
            <ArrowLeftIcon />
            <span>Sair</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarSeparator />

        <SidebarFooter>
          <div className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-primary text-white">
                {getInitials(user?.name ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
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
