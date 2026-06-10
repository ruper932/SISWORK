import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { User } from "../types"

type Props = {
  users: User[]
  onEdit: (user: User) => void
  onDeactivate: (user: User) => void | Promise<void>
  onRestore: (user: User) => void | Promise<void>
  onDelete: (user: User) => void
  deletingUserCi?: string | null
}

export function UsersTable({
  users,
  onEdit,
  onDeactivate,
  onRestore,
  onDelete,
  deletingUserCi,
}: Props) {
  return (
    <div className="rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CI</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Verificación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No hay usuarios para mostrar.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.ci}>
                <TableCell>{user.ci}</TableCell>
                <TableCell>
                  {user.first_name} {user.last_name} {user.mother_last_name ?? ""}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? "default" : "destructive"}>
                    {user.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.is_verified ? "default" : "outline"}>
                    {user.is_verified ? "Verificado" : "No verificado"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                      Editar
                    </Button>

                    {user.is_active ? (
                      <Button variant="secondary" size="sm" onClick={() => onDeactivate(user)}>
                        Desactivar
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" onClick={() => onRestore(user)}>
                        Reactivar
                      </Button>
                    )}

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(user)}
                      disabled={deletingUserCi === user.ci}
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}