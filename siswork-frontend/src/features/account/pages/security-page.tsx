import { useMemo, useState } from "react"
import { ShieldCheck, Smartphone, KeyRound, LockKeyhole } from "lucide-react"
import { useMutation } from "@tanstack/react-query"

import { useAuth } from "@/features/auth/use-auth"
import {
  changePassword,
  disable2FA,
  setup2FA,
  verify2FA,
} from "@/features/auth/api"

export function SecurityPage() {
  const { user, refreshMe } = useAuth()

  const is2FAEnabled = useMemo(() => {
    return user?.totp_enabled === true
  }, [user])

  const [setupData, setSetupData] = useState<{
    qr_code_base64: string
    secret: string
  } | null>(null)

  const [totpCode, setTotpCode] = useState("")
  const [disablePassword, setDisablePassword] = useState("")
  const [disableCode, setDisableCode] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [twoFaError, setTwoFaError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [twoFaSuccess, setTwoFaSuccess] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  const setupMutation = useMutation({
    mutationFn: setup2FA,
    onMutate: () => {
      setTwoFaError(null)
      setTwoFaSuccess(null)
    },
    onSuccess: (data) => {
      setSetupData({
        qr_code_base64: data.qr_code_base64,
        secret: data.secret,
      })
      setTwoFaSuccess("Escanea el QR y confirma con tu código de 6 dígitos.")
    },
    onError: (err: any) => {
      setTwoFaError(err?.response?.data?.detail || "No se pudo iniciar la configuración de 2FA.")
    },
  })

  const verifyMutation = useMutation({
    mutationFn: verify2FA,
    onMutate: () => {
      setTwoFaError(null)
      setTwoFaSuccess(null)
    },
    onSuccess: async () => {
      await refreshMe()
      setSetupData(null)
      setTotpCode("")
      setTwoFaSuccess("La autenticación en dos pasos quedó activada correctamente.")
    },
    onError: (err: any) => {
      setTwoFaError(err?.response?.data?.detail || "Código incorrecto o expirado.")
    },
  })

  const disableMutation = useMutation({
    mutationFn: disable2FA,
    onMutate: () => {
      setTwoFaError(null)
      setTwoFaSuccess(null)
    },
    onSuccess: async () => {
      await refreshMe()
      setDisablePassword("")
      setDisableCode("")
      setSetupData(null)
      setTwoFaSuccess("La autenticación en dos pasos fue desactivada.")
    },
    onError: (err: any) => {
      setTwoFaError(err?.response?.data?.detail || "No se pudo desactivar el 2FA.")
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onMutate: () => {
      setPasswordError(null)
      setPasswordSuccess(null)
    },
    onSuccess: () => {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordSuccess("Tu contraseña fue actualizada correctamente.")
    },
    onError: (err: any) => {
      setPasswordError(err?.response?.data?.detail || "No se pudo cambiar la contraseña.")
    },
  })

  const handleVerify2FA = () => {
    if (totpCode.length !== 6) {
      setTwoFaError("Ingresa un código válido de 6 dígitos.")
      return
    }

    verifyMutation.mutate(totpCode)
  }

  const handleDisable2FA = () => {
    if (!disablePassword) {
      setTwoFaError("Debes ingresar tu contraseña.")
      return
    }

    if (disableCode.length !== 6) {
      setTwoFaError("Ingresa un código TOTP válido de 6 dígitos.")
      return
    }

    disableMutation.mutate({
      password: disablePassword,
      code: disableCode,
    })
  }

  const handleChangePassword = () => {
    setPasswordError(null)
    setPasswordSuccess(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Completa todos los campos de contraseña.")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres.")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("La confirmación no coincide con la nueva contraseña.")
      return
    }

    if (currentPassword === newPassword) {
      setPasswordError("La nueva contraseña debe ser distinta de la actual.")
      return
    }

    changePasswordMutation.mutate({
      current_password: currentPassword,
      new_password: newPassword,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Seguridad</h1>
        <p className="text-sm text-muted-foreground">
          Administra la autenticación en dos pasos y actualiza tu contraseña.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Autenticación en dos pasos
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Protege tu cuenta con códigos TOTP generados por Authy o Google Authenticator.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background/60 p-4">
                <p className="text-sm font-medium text-foreground">
                  Estado actual
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {is2FAEnabled
                    ? "2FA activado en esta cuenta."
                    : "2FA todavía no está activado."}
                </p>
              </div>

              {twoFaSuccess && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-300">
                  {twoFaSuccess}
                </div>
              )}

              {twoFaError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {twoFaError}
                </div>
              )}

              {is2FAEnabled ? (
                <div className="space-y-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                  <div>
                    <p className="text-sm font-semibold text-destructive">
                      2FA ya configurado
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Para desactivarlo, confirma tu contraseña actual y un código vigente de tu aplicación autenticadora.
                    </p>
                  </div>

                  <div className="grid max-w-md gap-3">
                    <input
                      type="password"
                      placeholder="Contraseña actual"
                      value={disablePassword}
                      onChange={(e) => setDisablePassword(e.target.value)}
                      className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                    />

                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Código TOTP de 6 dígitos"
                      maxLength={6}
                      value={disableCode}
                      onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ""))}
                      className="h-11 rounded-xl border border-border bg-background px-3 text-sm tracking-[0.25em] outline-none focus:border-primary"
                    />

                    <button
                      type="button"
                      onClick={handleDisable2FA}
                      disabled={
                        disableMutation.isPending ||
                        disableCode.length !== 6 ||
                        !disablePassword
                      }
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-destructive px-4 text-sm font-medium text-destructive-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {disableMutation.isPending ? "Desactivando..." : "Desactivar 2FA"}
                    </button>
                  </div>
                </div>
              ) : !setupData ? (
                <div className="space-y-4 rounded-2xl border border-border bg-background/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Configurar 2FA
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Generaremos un código QR para que lo escanees desde Authy.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setupMutation.mutate()}
                    disabled={setupMutation.isPending}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Smartphone className="h-4 w-4" />
                    {setupMutation.isPending ? "Preparando..." : "Configurar 2FA"}
                  </button>
                </div>
              ) : (
                <div className="space-y-5 rounded-2xl border border-border bg-background/50 p-4">
                  <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
                    <div className="rounded-2xl bg-muted p-4">
                      <p className="mb-3 text-sm font-medium text-foreground">
                        1. Escanea este QR con Authy
                      </p>
                      <img
                        src={`data:image/png;base64,${setupData.qr_code_base64}`}
                        alt="Código QR para configurar 2FA"
                        className="h-48 w-48 rounded-xl bg-white p-2"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-sm font-medium text-foreground">
                          Código manual
                        </p>
                        <code className="mt-2 block overflow-x-auto rounded-lg bg-muted px-3 py-2 text-xs">
                          {setupData.secret}
                        </code>
                      </div>

                      <div className="max-w-md space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          2. Ingresa el código de verificación
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="123456"
                          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm tracking-[0.25em] outline-none focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={handleVerify2FA}
                          disabled={verifyMutation.isPending || totpCode.length !== 6}
                          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {verifyMutation.isPending ? "Verificando..." : "Activar 2FA"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {user?.totp_enabled === undefined && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
                  El backend todavía no expone el estado persistido de 2FA en <code>/auth/me</code>. Para mostrar “2FA ya configurado” al entrar a esta pantalla, agrega <code>totp_enabled</code> al response del usuario autenticado.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <LockKeyhole className="h-6 w-6" />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Cambio de contraseña
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Usa una contraseña nueva y segura para proteger mejor tu cuenta.
                </p>
              </div>

              {passwordSuccess && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-300">
                  {passwordSuccess}
                </div>
              )}

              {passwordError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {passwordError}
                </div>
              )}

              <div className="grid gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Contraseña actual
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña actual"
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la nueva contraseña"
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={
                    changePasswordMutation.isPending ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <KeyRound className="h-4 w-4" />
                  {changePasswordMutation.isPending
                    ? "Actualizando..."
                    : "Actualizar contraseña"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}