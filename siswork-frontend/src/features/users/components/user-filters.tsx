import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  filters: {
    q: string
    role: string
    city: string
    zone: string
    status: string
    verified: string
  }
  onChange: (patch: Partial<Props["filters"]>) => void
  onReset: () => void
}

export function UserFilters({ filters, onChange, onReset }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      <Input
        placeholder="Buscar por CI, nombre, email..."
        value={filters.q}
        onChange={(e) => onChange({ q: e.target.value })}
      />

      <Select value={filters.role} onValueChange={(value) => onChange({ role: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Rol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos los roles</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
          <SelectItem value="PROFESSIONAL">Profesional</SelectItem>
          <SelectItem value="CLIENT">Cliente</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Ciudad"
        value={filters.city}
        onChange={(e) => onChange({ city: e.target.value })}
      />

      <Input
        placeholder="Zona"
        value={filters.zone}
        onChange={(e) => onChange({ zone: e.target.value })}
      />

      <Select value={filters.status} onValueChange={(value) => onChange({ status: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="ACTIVE">Activos</SelectItem>
          <SelectItem value="INACTIVE">Inactivos</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Select value={filters.verified} onValueChange={(value) => onChange({ verified: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Verificado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="YES">Verificados</SelectItem>
            <SelectItem value="NO">No verificados</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onReset}>Limpiar</Button>
      </div>
    </div>
  )
}