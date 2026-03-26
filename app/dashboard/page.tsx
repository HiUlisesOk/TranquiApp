"use client";

import { useState } from "react";
import { ModulePage } from "@/components/layout/module-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ViewState } from "@/types";

const states: ViewState[] = ["empty", "loading", "error", "success"];

export default function DashboardPage() {
  const [state, setState] = useState<ViewState>("success");

  return (
    <ModulePage
      title="Dashboard"
      description="Visualizá ingresos, egresos y salud financiera en un solo lugar."
      state={state}
    >
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Simulador de estados</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Cambiar estado</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Seleccioná un estado de vista</DialogTitle>
                <DialogDescription>Esto ayuda a validar vacíos, errores y carga.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2">
                {states.map((option) => (
                  <Button key={option} variant={state === option ? "default" : "outline"} onClick={() => setState(option)}>
                    {option}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      <Tabs defaultValue="hoy">
        <TabsList>
          <TabsTrigger value="hoy">Hoy</TabsTrigger>
          <TabsTrigger value="semana">Semana</TabsTrigger>
        </TabsList>
        <TabsContent value="hoy">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concepto</TableHead>
                <TableHead>Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Gastos del día</TableCell>
                <TableCell>$ 19.450</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ingresos del día</TableCell>
                <TableCell>$ 25.200</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="semana">
          <p className="text-sm text-muted-foreground">La tendencia semanal se ve estable. Seguís dentro del presupuesto.</p>
        </TabsContent>
      </Tabs>
    </ModulePage>
  );
}
