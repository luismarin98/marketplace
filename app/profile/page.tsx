"use client";

import { useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, Settings, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Perfil y Configuración</h1>
        <p className="text-muted-foreground">Administra tu información personal y preferencias.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        {/* Menú Lateral */}
        <nav className="flex flex-col gap-2">
          <Button
            variant={activeSection === "profile" ? "default" : "ghost"}
            className="justify-start"
            onClick={() => setActiveSection("profile")}
          >
            <User className="mr-2 h-4 w-4" />
            Perfil
          </Button>
          <Button
            variant={activeSection === "security" ? "default" : "ghost"}
            className="justify-start"
            onClick={() => setActiveSection("security")}
          >
            <Lock className="mr-2 h-4 w-4" />
            Seguridad
          </Button>
          <Button
            variant={activeSection === "preferences" ? "default" : "ghost"}
            className="justify-start"
            onClick={() => setActiveSection("preferences")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Preferencias
          </Button>
        </nav>

        {/* Contenido Principal */}
        <div className="space-y-6">
          {activeSection === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tus datos personales aquí.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Nombre</label>
                  <Input defaultValue={user?.firstName || ""} placeholder="Tu nombre" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Apellido</label>
                  <Input defaultValue={user?.lastName || ""} placeholder="Tu apellido" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Correo Electrónico</label>
                  <Input defaultValue={user?.email || ""} disabled />
                </div>
                <Button>Guardar Cambios</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Contraseña</CardTitle>
                <CardDescription>Cambia tu contraseña para mantener tu cuenta segura.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Contraseña Actual</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Nueva Contraseña</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Confirmar Contraseña</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button>Actualizar Contraseña</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "preferences" && (
            <Card>
              <CardHeader>
                <CardTitle>Preferencias</CardTitle>
                <CardDescription>Ajustes generales de la aplicación.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">Notificaciones por Correo</div>
                    <div className="text-sm text-muted-foreground">Recibe correos sobre la actividad de tu cuenta.</div>
                  </div>
                  <Button variant="outline" size="sm">Activado</Button>
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">Tema Oscuro</div>
                    <div className="text-sm text-muted-foreground">Cambiar la apariencia de la aplicación.</div>
                  </div>
                  <Button variant="outline" size="sm">Sistema</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}