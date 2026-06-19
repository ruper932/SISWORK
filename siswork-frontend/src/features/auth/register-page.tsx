import React, { type ReactNode, type ReactElement } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { registerSchema, type RegisterSchema } from "./schemas";
import { useRegisterMutation } from "./hooks";
import { getApiErrorMessage, getApiFieldErrors } from "@/lib/api-error";

// Ciudades más conocidas de Bolivia
const BOLIVIAN_CITIES = [
  "La Paz",
  "Santa Cruz",
  "Cochabamba",
  "Sucre",
  "Potosí",
  "Oruro",
  "Tarija",
  "Cobija",
  "Trinidad",
  "El Alto",
  "Villa Tunari",
  "Riberalta",
] as const;

export function RegisterPage() {
  const registerMutation = useRegisterMutation();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      ci: "",
      first_name: "",
      last_name: "",
      mother_last_name: "",
      birth_date: "",
      email: "",
      phone: "",
      password: "",
      city: BOLIVIAN_CITIES[0],
      zone: "",
    },
  });

  useEffect(() => {
    if (!registerMutation.isError) return;

    const fieldErrors = getApiFieldErrors(registerMutation.error);

    Object.entries(fieldErrors).forEach(([field, message]) => {
      form.setError(field as keyof RegisterSchema, {
        type: "server",
        message,
      });
    });
  }, [registerMutation.isError, registerMutation.error, form]);

  const onSubmit = async (values: RegisterSchema) => {
    await registerMutation.mutateAsync(values);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_22%)]" />

      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="hidden lg:block">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Registro seguro en SISWORK
            </span>

            <h1 className="mt-6 text-5xl font-bold tracking-tight text-foreground">
              Crea tu cuenta y empieza a conectar oportunidades
            </h1>

            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Regístrate para publicar solicitudes, postularte, gestionar tu
              perfil y participar en una plataforma pensada para servicios
              profesionales.
            </p>

            <div className="mt-10 space-y-4">
              <FeatureItem>
                Perfil personal y de contacto en un solo lugar
              </FeatureItem>
              <FeatureItem>
                Acceso a solicitudes, profesionales y postulaciones
              </FeatureItem>
              <FeatureItem>
                Experiencia moderna con seguimiento claro y soporte
              </FeatureItem>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="mx-auto w-full max-w-3xl rounded-4xl border border-border/60 bg-card/95 p-6 shadow-2xl shadow-primary/10 backdrop-blur sm:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20">
                S
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
                Crear cuenta
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Completa tu información para registrarte en SISWORK.
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormSection
                title="Identidad"
                description="Datos principales para identificar tu cuenta."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    id="ci"
                    label="CI"
                    icon={<UserRound className="h-4 w-4" />}
                    error={form.formState.errors.ci?.message}
                  >
                    <input
                      id="ci"
                      type="text"
                      placeholder="Ej. 12345678"
                      className="input-auth"
                      {...form.register("ci")}
                    />
                  </Field>

                  <Field
                    id="birth_date"
                    label="Fecha de nacimiento"
                    icon={<CalendarDays className="h-4 w-4" />}
                    error={form.formState.errors.birth_date?.message}
                  >
                    <input
                      id="birth_date"
                      type="date"
                      className="input-auth"
                      {...form.register("birth_date")}
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection
                title="Datos personales"
                description="Información básica para tu perfil."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    id="first_name"
                    label="Nombre"
                    icon={<UserRound className="h-4 w-4" />}
                    error={form.formState.errors.first_name?.message}
                  >
                    <input
                      id="first_name"
                      type="text"
                      placeholder="Tu nombre"
                      className="input-auth"
                      {...form.register("first_name")}
                    />
                  </Field>

                  <Field
                    id="last_name"
                    label="Apellido paterno"
                    icon={<UserRound className="h-4 w-4" />}
                    error={form.formState.errors.last_name?.message}
                  >
                    <input
                      id="last_name"
                      type="text"
                      placeholder="Apellido paterno"
                      className="input-auth"
                      {...form.register("last_name")}
                    />
                  </Field>

                  <Field
                    id="mother_last_name"
                    label="Apellido materno"
                    icon={<UserRound className="h-4 w-4" />}
                    error={form.formState.errors.mother_last_name?.message}
                  >
                    <input
                      id="mother_last_name"
                      type="text"
                      placeholder="Apellido materno"
                      className="input-auth"
                      {...form.register("mother_last_name")}
                    />
                  </Field>

                  <Field
                    id="phone"
                    label="Teléfono"
                    icon={<Phone className="h-4 w-4" />}
                    error={form.formState.errors.phone?.message}
                  >
                    <input
                      id="phone"
                      type="text"
                      placeholder="Tu número de contacto"
                      className="input-auth"
                      {...form.register("phone")}
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection
                title="Contacto y ubicación"
                description="Cómo te contactarán y desde dónde operas."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    id="email"
                    label="Correo"
                    icon={<Mail className="h-4 w-4" />}
                    error={form.formState.errors.email?.message}
                  >
                    <input
                      id="email"
                      type="email"
                      placeholder="tucorreo@gmail.com"
                      className="input-auth"
                      {...form.register("email")}
                    />
                  </Field>

                  <Field
                    id="city"
                    label="Ciudad"
                    icon={<MapPin className="h-4 w-4" />}
                    error={form.formState.errors.city?.message}
                  >
                    <select
                      id="city"
                      className="input-auth"
                      {...form.register("city")}
                    >
                      {BOLIVIAN_CITIES.map((city: string) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    id="zone"
                    label="Zona"
                    icon={<MapPin className="h-4 w-4" />}
                    error={form.formState.errors.zone?.message}
                  >
                    <input
                      id="zone"
                      type="text"
                      placeholder="Zona o sector"
                      className="input-auth"
                      {...form.register("zone")}
                    />
                  </Field>

                  <Field
                    id="password"
                    label="Contraseña"
                    icon={<KeyRound className="h-4 w-4" />}
                    error={form.formState.errors.password?.message}
                  >
                    <input
                      id="password"
                      type="password"
                      placeholder="Crea una contraseña segura"
                      className="input-auth"
                      {...form.register("password")}
                    />
                  </Field>
                </div>
              </FormSection>

              {registerMutation.isError && (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {getApiErrorMessage(registerMutation.error)}
                </div>
              )}

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {registerMutation.isPending ? "Registrando..." : "Crear cuenta"}
                {!registerMutation.isPending && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="font-semibold text-foreground transition hover:text-primary"
              >
                Inicia sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Componentes auxiliares ----------

interface FormSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-border/60 bg-background/60 p-4 sm:p-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  icon?: ReactNode;
  children: ReactNode;
}

function Field({ id, label, error, icon, children }: FieldProps) {
  // Aseguramos que solo hay un hijo y lo tipamos como ReactElement
  const child = React.Children.only(children) as ReactElement<any>;
  const childClassName = child.props.className || "";
  const newClassName = icon ? `${childClassName} pl-10` : childClassName;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        {React.cloneElement(child, { className: newClassName })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function FeatureItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <ShieldCheck className="h-4 w-4" />
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{children}</p>
    </div>
  );
}