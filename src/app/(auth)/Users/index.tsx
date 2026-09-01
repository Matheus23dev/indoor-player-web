import { useMemo, useState } from "react";

import { Loader2, Plus, Search, ShieldAlert, ShieldCheck, UserCog, UsersRound } from "lucide-react";

import { PageContainer, PageScrollArea } from "../../../components/layout/Page";

import { useAuth } from "../../../contexts/useAuth";

import UserFormModal from "./components/UserFormModal";
import UsersTable from "./components/UsersTable";

import { useUsers } from "./hooks/useUsers";

import type { AuthenticatedUser, User, UserRole } from "./types";

import { canAccessUsersModule, canCreateUser } from "./utils/permissions";

export default function Users() {
  const auth = useAuth() as unknown as {
    user?: AuthenticatedUser | null;
    currentUser?: AuthenticatedUser | null;
    token?: string | null;
  };

  const currentUser = auth.user ?? auth.currentUser ?? getUserFromStoredToken(auth.token);

  const hasAccess = canAccessUsersModule(currentUser?.role);

  const { users, loading, saving, addUser, editUser, removeUser } = useUsers({
    enabled: Boolean(currentUser) && hasAccess,
  });

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.role.toLowerCase().includes(normalizedSearch),
    );
  }, [users, search]);

  if (!currentUser) {
    return (
      <AccessMessage
        title="Não foi possível identificar o usuário"
        text="Confira se o usuário autenticado está disponível."
      />
    );
  }

  if (!hasAccess) {
    return (
      <AccessMessage
        title="Acesso não permitido"
        text="Operadores não possuem acesso ao módulo de usuários."
      />
    );
  }

  const adminsCount = users.filter((user) => user.role === "ADMIN").length;

  const operatorsCount = users.filter((user) => user.role === "OPERATOR").length;

  function openCreateModal() {
    setSelectedUser(null);
    setModalOpen(true);
  }

  function openEditModal(user: User) {
    setSelectedUser(user);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setSelectedUser(null);
  }

  return (
    <>
      <PageContainer scrollable>
        <header
          data-help-tour="user-create"
          className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:flex-row md:items-center"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
              Governança e acesso
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-950">Usuários</h1>

            <p className="mt-1 text-sm text-gray-500">
              Gerencie os acessos e permissões da empresa.
            </p>
          </div>

          {canCreateUser(currentUser.role) && (
            <button
              data-help-tour="user-create-button"
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
            >
              <Plus size={19} />
              Novo usuário
            </button>
          )}
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryCard
            icon={<UsersRound size={22} />}
            label="Total de usuários"
            value={users.length}
          />

          <SummaryCard
            icon={<ShieldCheck size={22} />}
            label="Administradores"
            value={adminsCount}
          />

          <SummaryCard icon={<UserCog size={22} />} label="Operadores" value={operatorsCount} />
        </div>

        <div
          data-help-tour="user-management"
          className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
        >
          <div className="relative max-w-md">
            <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, e-mail ou perfil..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <PageScrollArea ariaLabel="Lista de usuários">
          {loading && (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border bg-white">
              <Loader2 size={38} className="animate-spin text-blue-600" />
            </div>
          )}

          {!loading && filteredUsers.length > 0 && (
            <UsersTable
              users={filteredUsers}
              currentUser={currentUser}
              saving={saving}
              onEdit={openEditModal}
              onDelete={(user) => {
                void removeUser(user);
              }}
            />
          )}

          {!loading && filteredUsers.length === 0 && (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <div>
                <UsersRound size={52} className="mx-auto text-gray-300" />

                <h2 className="mt-4 text-xl font-black text-gray-900">Nenhum usuário encontrado</h2>

                <p className="mt-2 text-sm text-gray-500">
                  Ajuste a busca ou cadastre um novo usuário.
                </p>
              </div>
            </div>
          )}
        </PageScrollArea>
      </PageContainer>

      <UserFormModal
        open={modalOpen}
        saving={saving}
        currentUser={currentUser}
        user={selectedUser}
        onClose={closeModal}
        onCreate={addUser}
        onUpdate={editUser}
      />
    </>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function SummaryCard({ icon, label, value }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">{icon}</div>

        <div>
          <p className="text-xs font-bold text-gray-500">{label}</p>

          <p className="mt-1 text-2xl font-black text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function AccessMessage({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 p-6">
      <div className="max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert size={28} />
        </div>

        <h1 className="mt-4 text-2xl font-black text-gray-900">{title}</h1>

        <p className="mt-2 text-sm text-gray-500">{text}</p>
      </div>
    </div>
  );
}

function getUserFromStoredToken(contextToken?: string | null): AuthenticatedUser | null {
  const token = contextToken ?? getStoredToken();

  if (!token) {
    return null;
  }

  try {
    const payloadPart = token.split(".")[1];

    if (!payloadPart) {
      return null;
    }

    const normalized = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payloadPart.length / 4) * 4, "=");

    const payload = JSON.parse(
      decodeURIComponent(
        Array.from(atob(normalized))
          .map((character) => `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`)
          .join(""),
      ),
    ) as Record<string, unknown>;

    const role = payload.role as UserRole | undefined;

    const id = String(payload.id ?? payload.sub ?? "");

    if (!id || !["OWNER", "ADMIN", "OPERATOR"].includes(String(role))) {
      return null;
    }

    return {
      id,
      role: role!,
      name: typeof payload.name === "string" ? payload.name : undefined,
      email: typeof payload.email === "string" ? payload.email : undefined,
      companyId: typeof payload.companyId === "string" ? payload.companyId : undefined,
    };
  } catch {
    return null;
  }
}

function getStoredToken() {
  const possibleKeys = [
    "token",
    "accessToken",
    "access_token",
    "@auth:token",
    "indoor_player_token",
  ];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);

    if (value) {
      return value.replace(/^"|"$/g, "");
    }
  }

  return null;
}
