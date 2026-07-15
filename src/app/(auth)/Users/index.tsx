import {
    useMemo,
    useState,
  } from 'react';
  
  import {
    Edit,
    Plus,
    RefreshCw,
    Trash2,
    Users,
  } from 'lucide-react';
  
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';
  
  import {
    Button,
  } from '@/components/ui/button';
  
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  
  import {
    UserFormModal,
  } from './components/UserFormModal';
  
  import {
    useUsers,
  } from './hooks/useUsers';
  
  import type {
    CreateUserPayload,
    UpdateUserPayload,
    User,
    UserRole,
  } from './types/users.types';
  
  export function UsersPage() {
    const {
      users,
      loading,
      saving,
      loadUsers,
      createUser,
      updateUser,
      removeUser,
    } = useUsers();
  
    const [modalOpen, setModalOpen] =
      useState(false);
  
    const [selectedUser, setSelectedUser] =
      useState<User | null>(null);
  
    const [userToDelete, setUserToDelete] =
      useState<User | null>(null);
  
    const [deleting, setDeleting] =
      useState(false);
  
    const totalUsers =
      users.length;
  
    const adminUsers =
      useMemo(
        () =>
          users.filter(
            user => user.role === 'ADMIN',
          ).length,
        [
          users,
        ],
      );
  
    const employeeUsers =
      useMemo(
        () =>
          users.filter(
            user => user.role === 'EMPLOYEE',
          ).length,
        [
          users,
        ],
      );
  
    function handleOpenCreate() {
      setSelectedUser(null);
      setModalOpen(true);
    }
  
    function handleOpenEdit(
      user: User,
    ) {
      setSelectedUser(user);
      setModalOpen(true);
    }
  
    async function handleCreate(
      payload: CreateUserPayload,
    ) {
      await createUser(payload);
    }
  
    async function handleUpdate(
      id: string,
      payload: UpdateUserPayload,
    ) {
      await updateUser(
        id,
        payload,
      );
    }
  
    async function handleConfirmDelete() {
      if (!userToDelete) {
        return;
      }
  
      try {
        setDeleting(true);
  
        await removeUser(
          userToDelete.id,
        );
  
        setUserToDelete(null);
      } finally {
        setDeleting(false);
      }
    }
  
    return (
      <div className="min-h-screen w-full bg-slate-50 p-6">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white shadow-lg">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <Users className="h-6 w-6" />
                  </div>
  
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                      Usuários
                    </h1>
  
                    <p className="mt-1 text-sm text-blue-100">
                      Gerencie os acessos dos colaboradores ao painel administrativo.
                    </p>
                  </div>
                </div>
              </div>
  
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={() => void loadUsers()}
                  disabled={loading}
                  className="border border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
  
                  Atualizar
                </Button>
  
                <Button
                  type="button"
                  onClick={handleOpenCreate}
                  className="bg-white text-blue-700 hover:bg-blue-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
  
                  Novo usuário
                </Button>
              </div>
            </div>
          </div>
  
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardCard
              title="Total de usuários"
              value={totalUsers}
            />
  
            <DashboardCard
              title="Administradores"
              value={adminUsers}
            />
  
            <DashboardCard
              title="Funcionários"
              value={employeeUsers}
            />
          </div>
  
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Lista de usuários
                </h2>
  
                <p className="mt-1 text-sm text-slate-500">
                  Visualize, edite ou remova usuários cadastrados.
                </p>
              </div>
            </div>
  
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="text-slate-600">
                      Nome
                    </TableHead>
  
                    <TableHead className="text-slate-600">
                      Email
                    </TableHead>
  
                    <TableHead className="text-slate-600">
                      Permissão
                    </TableHead>
  
                    <TableHead className="text-slate-600">
                      Criado em
                    </TableHead>
  
                    <TableHead className="w-[130px] text-right text-slate-600">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
  
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-28 text-center text-slate-500"
                      >
                        Carregando usuários...
                      </TableCell>
                    </TableRow>
                  )}
  
                  {!loading &&
                    users.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-28 text-center text-slate-500"
                        >
                          Nenhum usuário cadastrado.
                        </TableCell>
                      </TableRow>
                    )}
  
                  {!loading &&
                    users.map(user => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-blue-50/40"
                      >
                        <TableCell className="font-medium text-slate-900">
                          {user.name}
                        </TableCell>
  
                        <TableCell className="text-slate-600">
                          {user.email}
                        </TableCell>
  
                        <TableCell>
                          <RoleBadge role={user.role} />
                        </TableCell>
  
                        <TableCell className="text-slate-600">
                          {formatDate(user.createdAt)}
                        </TableCell>
  
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              size="icon"
                              onClick={() =>
                                handleOpenEdit(user)
                              }
                              disabled={user.role === 'OWNER'}
                              className="h-9 w-9 border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
  
                            <Button
                              type="button"
                              size="icon"
                              onClick={() =>
                                setUserToDelete(user)
                              }
                              disabled={user.role === 'OWNER'}
                              className="h-9 w-9 bg-red-50 text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
  
        <UserFormModal
          open={modalOpen}
          user={selectedUser}
          saving={saving}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
  
        <AlertDialog
          open={Boolean(userToDelete)}
          onOpenChange={open => {
            if (!open) {
              setUserToDelete(null);
            }
          }}
        >
          <AlertDialogContent className="border border-slate-200 bg-white text-slate-900">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Remover usuário
              </AlertDialogTitle>
  
              <AlertDialogDescription className="text-slate-500">
                Tem certeza que deseja remover o usuário {userToDelete?.name}?
                Essa ação não poderá ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
  
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={deleting}
                className="border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </AlertDialogCancel>
  
              <AlertDialogAction
                onClick={() => void handleConfirmDelete()}
                disabled={deleting}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {deleting
                  ? 'Removendo...'
                  : 'Remover'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
  
  interface DashboardCardProps {
    title: string;
    value: number;
  }
  
  function DashboardCard({
    title,
    value,
  }: DashboardCardProps) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>
  
        <p className="mt-3 text-3xl font-bold text-slate-900">
          {value}
        </p>
      </div>
    );
  }
  
  function RoleBadge({
    role,
  }: {
    role: UserRole;
  }) {
    const className =
      role === 'OWNER'
        ? 'bg-blue-700 text-white'
        : role === 'ADMIN'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-slate-100 text-slate-700';
  
    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}
      >
        {formatRole(role)}
      </span>
    );
  }
  
  function formatRole(
    role: UserRole,
  ) {
    const roles:
      Record<UserRole, string> = {
        OWNER: 'Dono',
        ADMIN: 'Administrador',
        EMPLOYEE: 'Funcionário',
      };
  
    return roles[role] ?? role;
  }
  
  function formatDate(
    date: string,
  ) {
    return new Intl.DateTimeFormat(
      'pt-BR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      },
    ).format(
      new Date(date),
    );
  }