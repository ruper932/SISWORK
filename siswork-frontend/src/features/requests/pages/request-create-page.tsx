import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"

import { useCreateRequestMutation } from "../hooks"
import {
  requestCreateSchema,
  type RequestCreateFormInput,
  type RequestCreateFormOutput,
} from "../schemas"
import { useSpecialtiesQuery } from "@/features/specialties/hooks"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const urgencyOptions = [
  { value: "LOW", label: "Baja" },
  { value: "MEDIUM", label: "Media" },
  { value: "HIGH", label: "Alta" },
] as const

export function RequestCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateRequestMutation()
  const {
    data: specialties = [],
    isLoading: isLoadingSpecialties,
    isError: isSpecialtiesError,
  } = useSpecialtiesQuery()

  const defaultValues = useMemo<RequestCreateFormInput>(
    () => ({
      specialty_id: "",
      title: "",
      description: "",
      budget: undefined,
      proposed_final_price: undefined,
      scheduled_date: "",
      city: "",
      zone: "",
      latitude: undefined,
      longitude: undefined,
      urgency: "MEDIUM",
    }),
    [],
  )

  const form = useForm<RequestCreateFormInput, unknown, RequestCreateFormOutput>({
    resolver: zodResolver(requestCreateSchema),
    defaultValues,
  })

  const onSubmit = async (values: RequestCreateFormOutput) => {
    await createMutation.mutateAsync({
      ...values,
      budget: values.budget ?? null,
      proposed_final_price: values.proposed_final_price ?? null,
      latitude: values.latitude ?? null,
      longitude: values.longitude ?? null,
      zone: values.zone?.trim() ? values.zone : null,
      scheduled_date: values.scheduled_date?.trim() ? values.scheduled_date : null,
    })

    navigate("/requests")
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Nueva solicitud</CardTitle>
          <CardDescription>
            Publica lo que necesitas y recibe postulaciones de profesionales.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="specialty_id">Especialidad</Label>
              <Controller
                control={form.control}
                name="specialty_id"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoadingSpecialties || createMutation.isPending}
                  >
                    <SelectTrigger id="specialty_id">
                      <SelectValue
                        placeholder={
                          isLoadingSpecialties
                            ? "Cargando especialidades..."
                            : "Selecciona una especialidad"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {isSpecialtiesError && (
                <p className="text-sm text-red-600">
                  No se pudieron cargar las especialidades.
                </p>
              )}
              {form.formState.errors.specialty_id && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.specialty_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" rows={5} {...form.register("description")} />
              {form.formState.errors.description && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budget">Presupuesto</Label>
                <Input id="budget" type="number" step="0.01" {...form.register("budget")} />
                {form.formState.errors.budget && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.budget.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="proposed_final_price">Precio propuesto</Label>
                <Input
                  id="proposed_final_price"
                  type="number"
                  step="0.01"
                  {...form.register("proposed_final_price")}
                />
                {form.formState.errors.proposed_final_price && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.proposed_final_price.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="scheduled_date">Fecha programada</Label>
                <Input
                  id="scheduled_date"
                  type="datetime-local"
                  {...form.register("scheduled_date")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgencia</Label>
                <Controller
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="urgency">
                        <SelectValue placeholder="Selecciona la urgencia" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.urgency && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.urgency.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input id="city" {...form.register("city")} />
                {form.formState.errors.city && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zone">Zona</Label>
                <Input id="zone" {...form.register("zone")} />
                {form.formState.errors.zone && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.zone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitud</Label>
                <Input id="latitude" type="number" step="any" {...form.register("latitude")} />
                {form.formState.errors.latitude && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.latitude.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitud</Label>
                <Input id="longitude" type="number" step="any" {...form.register("longitude")} />
                {form.formState.errors.longitude && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.longitude.message}
                  </p>
                )}
              </div>
            </div>

            {createMutation.isError && (
              <p className="text-sm text-red-600">
                No se pudo crear la solicitud. Revisa los datos e intenta nuevamente.
              </p>
            )}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={createMutation.isPending || isLoadingSpecialties}>
                {createMutation.isPending ? "Guardando..." : "Crear solicitud"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/requests")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}