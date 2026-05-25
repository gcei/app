import { NavLink, Outlet } from "react-router-dom"
import { useState } from "react"
import {
  ArrowLeftIcon,
  ClipboardTextIcon,
  GearIcon,
  UsersIcon,
} from "@phosphor-icons/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

const empresaSections = [
  {
    path: "/home/empresas/candidatos",
    label: "Candidatos",
    icon: UsersIcon,
    end: false,
  },
  {
    path: "/home/empresas/pesquisa-anual",
    label: "Pesquisa do egresso",
    icon: ClipboardTextIcon,
    end: false,
  },
  {
    path: "/home/empresas/configuracoes",
    label: "Configurações",
    icon: GearIcon,
    end: false,
  },
] as const

export function EmpresaHomePage() {
  const [empresaData, setEmpresaData] = useState({
    nome: "Usuário parceiro",
    email: "contato@ifal.com.br"
  })

  const updateSidebarData = (newData: { nome: string; email: string }) => {
    setEmpresaData(newData)
  }

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
          <NavLink to="/login">
            <SidebarMenuButton className="text-destructive">
              <ArrowLeftIcon />
              <span>Sair</span>
            </SidebarMenuButton>
          </NavLink>
        </SidebarMenuItem>

        <SidebarSeparator />

        <SidebarFooter>
          <div className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src="/avatars/01.png" alt="Logo da empresa" />
              <AvatarFallback className="bg-primary text-white">EM</AvatarFallback>
            </Avatar>
            <div className="data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium">{empresaData.nome}</p>
              <p className="text-xs text-muted-foreground">{empresaData.email}</p>
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
          <Outlet context={updateSidebarData} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
