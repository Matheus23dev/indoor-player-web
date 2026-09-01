import { useEffect, useMemo, useState, type FormEvent } from "react";

import { Eye, EyeOff, Save, ShieldCheck, UserRound, X } from "lucide-react";

import { appAlert as Swal } from "@/lib/alert";

import { getAssignableRoles } from "../utils/permissions";

import { getApiErrorMessage } from "../../../../lib/apiError";

import type {
  AuthenticatedUser,
  CreateUserPayload,
  UpdateUserPayload,
  User,
  UserRole,
} from "../types";

interface UserFormModalProps {
  open: boolean;
  saving: boolean;
  currentUser: AuthenticatedUser;
  user?: User | null;
  onClose: () => void;
  onCreate: (data: CreateUserPayload) => Promise<unknown>;
  onUpdate: (userId: string, data: UpdateUserPayload) => Promise<unknown>;
}

export default function UserFormModal({
  open,
  saving,
  currentUser,
  user,
  onClose,
  onCreate,
  onUpdate,
}: UserFormModalProps) {
  const isEditing = Boolean(user);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState<Exclude<UserRole, "OWNER">>("OPERATOR");

  const [showPassword, setShowPassword] = useState(false);

  const assignableRoles = useMemo(() => getAssignableRoles(currentUser.role), [currentUser.role]);

  const editingOwnAdminAccount = Boolean(
    user && currentUser.role === "ADMIN" && user.id === currentUser.id && user.role === "ADMIN",
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setPassword("");
    setShowPassword(false);

    if (user?.role === "ADMIN" || user?.role === "OPERATOR") {
      setRole(user.role);
      return;
    }

    setRole(assignableRoles[0]?.value ?? "OPERATOR");
  }, [open, user, assignableRoles]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      await showWarning("Nome obrigatório", "Informe o nome do usuário.");
      return;
    }

    if (!normalizedEmail) {
      await showWarning("E-mail obrigatório", "Informe o e-mail do usuário.");
      return;
    }

    if (!isEditing && password.trim().length < 6) {
      await showWarning("Senha inválida", "A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (isEditing && password && password.trim().length < 6) {
      await showWarning("Senha inválida", "A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    try {
      if (user) {
        const payload: UpdateUserPayload = {
          name: normalizedName,
          email: normalizedEmail,
        };

        if (password.trim()) {
          payload.password = password.trim();
        }

        if (!editingOwnAdminAccount) {
          payload.role = role;
        }

        await onUpdate(user.id, payload);

        await Swal.fire({
          icon: "success",
          title: "Usuário atualizado",
          timer: 1300,
          showConfirmButton: false,
        });
      } else {
        await onCreate({
          name: normalizedName,
          email: normalizedEmail,
          password: password.trim(),
          role,
        });

        await Swal.fire({
          icon: "success",
          title: "Usuário criado",
          timer: 1300,
          showConfirmButton: false,
        });
      }

      onClose();
    } catch (error: unknown) {
      await Swal.fire({
        icon: "error",
        title: isEditing ? "Erro ao atualizar" : "Erro ao criar",
        text: getApiErrorMessage(
          error,
          isEditing ? "Não foi possível atualizar o usuário." : "Não foi possível criar o usuário.",
        ),
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              {isEditing ? "Editar usuário" : "Novo usuário"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "Atualize os dados e permissões do usuário."
                : "Cadastre um novo acesso para a empresa."}
            </p>
          </div>

          <button
            data-help-tour="user-modal-close"
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            aria-label="Fechar"
          >
            <X size={22} />
          </button>
        </header>

        <div className="space-y-5 p-6">
          <div data-help-tour="user-modal-identity">
            <label htmlFor="user-name" className="mb-2 block text-sm font-bold text-gray-700">
              Nome
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="user-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={saving}
                maxLength={100}
                placeholder="Nome completo"
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
              />
            </div>
          </div>

          <div data-help-tour="user-modal-email">
            <label htmlFor="user-email" className="mb-2 block text-sm font-bold text-gray-700">
              E-mail
            </label>

            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={saving}
              autoComplete="email"
              placeholder="usuario@empresa.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
            />
          </div>

          <div data-help-tour="user-modal-password">
            <label htmlFor="user-password" className="mb-2 block text-sm font-bold text-gray-700">
              {isEditing ? "Nova senha (opcional)" : "Senha"}
            </label>

            <div className="relative">
              <input
                id="user-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={saving}
                autoComplete="new-password"
                placeholder={
                  isEditing ? "Deixe vazio para manter a senha" : "Mínimo de 6 caracteres"
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div data-help-tour="user-modal-role">
            <label
              htmlFor="user-role"
              className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700"
            >
              <ShieldCheck size={17} />
              Perfil de acesso
            </label>

            {editingOwnAdminAccount ? (
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
                Administrador
              </div>
            ) : (
              <select
                id="user-role"
                value={role}
                onChange={(event) => setRole(event.target.value as Exclude<UserRole, "OWNER">)}
                disabled={saving || assignableRoles.length === 1}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-50 disabled:opacity-70"
              >
                {assignableRoles.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {currentUser.role === "ADMIN" && !editingOwnAdminAccount && (
              <p className="mt-2 text-xs font-medium text-gray-500">
                Administradores podem criar e editar apenas operadores.
              </p>
            )}
          </div>
        </div>

        <footer
          data-help-tour="user-modal-actions"
          className="flex justify-end gap-3 border-t px-6 py-4"
        >
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={18} />

            {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar usuário"}
          </button>
        </footer>
      </form>
    </div>
  );
}

async function showWarning(title: string, text: string) {
  await Swal.fire({
    icon: "warning",
    title,
    text,
  });
}
