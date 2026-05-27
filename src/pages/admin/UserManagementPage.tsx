import { FormEvent, useState } from "react";
import {
  useCreateUser,
  useUpdateUser,
  useUpdateUserRole,
  useUsersList
} from "@/hooks/useUsers";
import { useTeams } from "@/hooks/useTeams";
import { DataTable } from "@/components/molecules/DataTable";
import { Pagination } from "@/components/molecules/Pagination";
import { Modal, ModalActions } from "@/components/molecules/Modal";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import { getApiErrorMessage } from "@/api/axiosInstance";
import { useUiStore } from "@/stores/uiStore";
import { PASSWORD_HINT, validatePassword } from "@/utils/passwordRules";
import type { User, UserRole } from "@/types/user";

const roles: UserRole[] = ["customer", "agent", "manager", "admin"];

export function UserManagementPage() {
  const pushToast = useUiStore((s) => s.pushToast);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useUsersList({
    page,
    limit: 15,
    role: roleFilter || undefined
  });
  const { data: teams } = useTeams();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const updateRole = useUpdateUserRole();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent" as UserRole,
    teamId: ""
  });

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const pwError = validatePassword(form.password);
    if (pwError) {
      pushToast({ type: "error", message: pwError });
      return;
    }
    try {
      await createUser.mutateAsync({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        teamId:
          form.role === "agent" || form.role === "manager" ? form.teamId || null : null
      });
      pushToast({ type: "success", message: "User created" });
      setCreateOpen(false);
      setForm({ name: "", email: "", password: "", role: "agent", teamId: "" });
    } catch (err) {
      pushToast({ type: "error", message: getApiErrorMessage(err) });
    }
  };

  const toggleActive = async (user: User) => {
    try {
      await updateUser.mutateAsync({ id: user._id, body: { isActive: !user.isActive } });
      pushToast({ type: "success", message: user.isActive ? "User deactivated" : "User activated" });
    } catch (err) {
      pushToast({ type: "error", message: getApiErrorMessage(err) });
    }
  };

  const changeRole = async (user: User, role: UserRole) => {
    try {
      await updateRole.mutateAsync({ id: user._id, role });
      pushToast({ type: "success", message: "Role updated" });
    } catch (err) {
      pushToast({ type: "error", message: getApiErrorMessage(err) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">User management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create agent, manager, and admin accounts. Customers can sign up on the public registration page.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Add user</Button>
      </div>

      <label className="text-sm">
        <span className="text-slate-600">Filter by role</span>
        <select
          className="ml-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as UserRole | "");
            setPage(1);
          }}
        >
          <option value="">All roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <DataTable<User>
            rows={data?.items || []}
            rowKey={(u) => u._id}
            columns={[
              { key: "name", header: "Name", render: (u) => u.name },
              { key: "email", header: "Email", render: (u) => u.email },
              {
                key: "role",
                header: "Role",
                render: (u) => (
                  <select
                    className="rounded border border-slate-300 px-2 py-1 text-xs capitalize"
                    value={u.role}
                    onChange={(e) => changeRole(u, e.target.value as UserRole)}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                )
              },
              {
                key: "status",
                header: "Status",
                render: (u) => (
                  <Badge className={u.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}>
                    {u.isActive ? "Active" : "Inactive"}
                  </Badge>
                )
              },
              {
                key: "actions",
                header: "",
                render: (u) => (
                  <Button variant="ghost" onClick={() => toggleActive(u)}>
                    {u.isActive ? "Deactivate" : "Activate"}
                  </Button>
                )
              }
            ]}
          />
          {data ? (
            <Pagination page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} />
          ) : null}
        </>
      )}

      <Modal
        open={createOpen}
        title="Create user"
        onClose={() => setCreateOpen(false)}
        footer={
          <ModalActions
            onCancel={() => setCreateOpen(false)}
            onConfirm={() => (document.getElementById("create-user-form") as HTMLFormElement)?.requestSubmit()}
            confirmLabel="Create"
            loading={createUser.isPending}
          />
        }
      >
        <form id="create-user-form" onSubmit={handleCreate} className="space-y-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <p className="-mt-2 text-xs text-slate-500">{PASSWORD_HINT}</p>
          <label className="block text-sm">
            <span className="text-slate-600">Role</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          {form.role === "agent" || form.role === "manager" ? (
            <label className="block text-sm">
              <span className="text-slate-600">Team</span>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={form.teamId}
                onChange={(e) => setForm({ ...form, teamId: e.target.value })}
                required
              >
                <option value="">Select team</option>
                {(teams || []).map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </form>
      </Modal>
    </div>
  );
}
