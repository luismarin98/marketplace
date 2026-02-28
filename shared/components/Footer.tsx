import { ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">Marketplace</span>
        </div>
        <nav className="flex gap-6">
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Términos y Condiciones
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Términos y Condiciones</DialogTitle>
                <DialogDescription>
                  Lee nuestros términos y condiciones antes de usar la plataforma.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto py-4 pr-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>1. Aceptación de los Términos</AccordionTrigger>
                    <AccordionContent>
                      Al acceder y utilizar Marketplace, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de los términos, no puedes utilizar nuestro servicio.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>2. Cuentas de Usuario</AccordionTrigger>
                    <AccordionContent>
                      Para acceder a ciertas funciones, debes registrarte para obtener una cuenta. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>3. Publicación de Productos</AccordionTrigger>
                    <AccordionContent>
                      Como vendedor, eres responsable de la exactitud, calidad y legalidad de los productos que publicas. Está prohibido listar artículos ilegales, falsificados o que infrinjan los derechos de propiedad intelectual de terceros.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </DialogContent>
          </Dialog>
        </nav>
        <p className="text-xs text-muted-foreground">
          {"2026 Marketplace. All rights reserved."}
        </p>
      </div>
    </footer>
  );
}
