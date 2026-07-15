import {
    type FormEvent,
    useEffect,
    useState,
  } from 'react';
  
  import {
    Button,
  } from '@/components/ui/button';
  
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  
  import {
    Input,
  } from '@/components/ui/input';
  
  import {
    Label,
  } from '@/components/ui/label';
  
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  
  import type {
    CreateUserPayload,
    UpdateUserPayload,
    User,
  } from '../types/users.types';
  
  interface UserFormModalProps {
    open: boolean;
    user?: User | null;
    saving?: boolean;
    onClose: () => void;
    onCreate: (payload: CreateUserPayload) => Promise<void>;
    onUpdate: (id: string, payload: UpdateUserPayload) => Promise<void>;
  }
  
  type FormRole =
    | 'ADMIN'
    | 'EMPLOYEE';
  
  export function UserFormModal({
    open,
    user,
    saving = false,
    onClose,
    onCreate,
    onUpdate,
  }: UserFormModalProps) {
    const isEditing =
      Boolean(user);
  
    const [name, setName] =
      useState('');
  
    const [email, setEmail] =
      useState('');
  
    const [password, setPassword] =
      useState('');
  
    const [role, setRole] =
      useState<FormRole>('EMPLOYEE');
  
    useEffect(
      () => {
        if (!open) {
          return;
        }
  
        setName(
          user?.name ?? '',
        );
  
        setEmail(
          user?.email ?? '',
        );
  
        setPassword('');
  
        setRole(
          user?.role === 'ADMIN'
            ? 'ADMIN'
            : 'EMPLOYEE',
        );
      },
      [
        open,
        user,
      ],
    );
  
    async function handleSubmit(
      event: FormEvent,
    ) {
      event.preventDefault();
  
      const trimmedName =
        name.trim();
  
      const trimmedEmail =
        email.trim();
  
      const trimmedPassword =
        password.trim();
  
      if (
        !trimmedName ||
        !trimmedEmail
      ) {
        return;
      }
  
      if (
        !isEditing &&
        !trimmedPassword
      ) {
        return;
      }
  
      if (
        isEditing &&
        user
      ) {
        await onUpdate(
          user.id,
          {
            name: trimmedName,
            email: trimmedEmail,
            role,
            ...(trimmedPassword
              ? {
                  password: trimmedPassword,
                }
              : {}),
          },
        );
  
        onClose();
  
        return;
      }
  
      await onCreate({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        role,
      });
  
      onClose();
    }
  
    return (
      <Dialog
        open={open}
        onOpenChange={value => {
          if (!value) {
            onClose();
          }
        }}
      >
        <DialogContent className="border border-slate-200 bg-white text-slate-900 sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">
              {isEditing
                ? 'Editar usuário'
                : 'Novo usuário'}
            </DialogTitle>
  
            <DialogDescription className="text-slate-500">
              {isEditing
                ? 'Atualize os dados do usuário selecionado.'
                : 'Cadastre um novo usuário para acessar o painel.'}
            </DialogDescription>
          </DialogHeader>
  
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-slate-700"
              >
                Nome
              </Label>
  
              <Input
                id="name"
                value={name}
                onChange={event =>
                  setName(event.target.value)
                }
                placeholder="Nome do usuário"
                disabled={saving}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600"
              />
            </div>
  
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-slate-700"
              >
                Email
              </Label>
  
              <Input
                id="email"
                type="email"
                value={email}
                onChange={event =>
                  setEmail(event.target.value)
                }
                placeholder="email@empresa.com"
                disabled={saving}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600"
              />
            </div>
  
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-slate-700"
              >
                Senha
              </Label>
  
              <Input
                id="password"
                type="password"
                value={password}
                onChange={event =>
                  setPassword(event.target.value)
                }
                placeholder={
                  isEditing
                    ? 'Deixe vazio para manter a senha atual'
                    : 'Digite a senha'
                }
                disabled={saving}
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600"
              />
            </div>
  
            <div className="space-y-2">
              <Label className="text-slate-700">
                Permissão
              </Label>
  
              <Select
                value={role}
                onValueChange={value =>
                  setRole(value as FormRole)
                }
                disabled={saving}
              >
                <SelectTrigger className="border-slate-300 bg-white text-slate-900 focus:ring-blue-600">
                  <SelectValue placeholder="Selecione a permissão" />
                </SelectTrigger>
  
                <SelectContent className="border border-slate-200 bg-white text-slate-900">
                  <SelectItem value="ADMIN">
                    Administrador
                  </SelectItem>
  
                  <SelectItem value="EMPLOYEE">
                    Funcionário
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
  
            <DialogFooter>
              <Button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </Button>
  
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {saving
                  ? 'Salvando...'
                  : isEditing
                    ? 'Salvar alterações'
                    : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }