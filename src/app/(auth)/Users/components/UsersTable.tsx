import { Pencil, ShieldCheck, Trash2, UserRound } from "lucide-react";

import type { AuthenticatedUser, User } from "../types/index";

import { canDeleteUser, canEditUser, getRoleLabel } from "../utils/permissions";

interface UsersTableProps {
  users: User[];
  currentUser: AuthenticatedUser;
  saving: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UsersTable({
  users,
  currentUser,
  saving,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader>Usuário</TableHeader>

              <TableHeader>Perfil</TableHeader>

              <TableHeader>Criado em</TableHeader>

              <TableHeader align="right">Ações</TableHeader>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {users.map((user) => {
              const editable = canEditUser(currentUser, user);

              const removable = canDeleteUser(currentUser, user);

              return (
                <tr key={user.id} className="transition hover:bg-gray-50">
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <UserRound size={19} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-black text-gray-900">{user.name}</p>

                          {user.id === currentUser.id && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black uppercase text-gray-600">
                              Você
                            </span>
                          )}
                        </div>

                        <p className="truncate text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <RoleBadge role={user.role} />
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex justify-end gap-2">
                      {editable && (
                        <button
                          type="button"
                          onClick={() => onEdit(user)}
                          disabled={saving}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Pencil size={15} />
                          Editar
                        </button>
                      )}

                      {removable && (
                        <button
                          type="button"
                          onClick={() => onDelete(user)}
                          disabled={saving}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                          Excluir
                        </button>
                      )}

                      {!editable && !removable && (
                        <span className="text-xs font-semibold text-gray-400">
                          Sem ações disponíveis
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface TableHeaderProps {
  children: React.ReactNode;
  align?: "left" | "right";
}

function TableHeader({ children, align = "left" }: TableHeaderProps) {
  return (
    <th
      className={`px-5 py-3 text-xs font-black uppercase tracking-wide text-gray-500 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function RoleBadge({ role }: { role: User["role"] }) {
  const styles = {
    OWNER: "border-amber-200 bg-amber-50 text-amber-700",
    ADMIN: "border-blue-200 bg-blue-50 text-blue-700",
    OPERATOR: "border-emerald-200 bg-emerald-50 text-emerald-700",
  }[role];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black ${styles}`}
    >
      <ShieldCheck size={14} />
      {getRoleLabel(role)}
    </span>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data inválida";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
