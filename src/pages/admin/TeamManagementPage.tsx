import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teamsApi } from "@/api/teamsApi";
import { useTeams } from "@/hooks/useTeams";
import { useUsersList } from "@/hooks/useUsers";
import { DataTable } from "@/components/molecules/DataTable";
import { Modal, ModalActions } from "@/components/molecules/Modal";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import { getApiErrorMessage } from "@/api/axiosInstance";
import { useUiStore } from "@/stores/uiStore";
import type { Team } from "@/types/team";

export function TeamManagementPage() {
  const pushToast = useUiStore((s) => s.pushToast);
  const queryClient = useQueryClient();
  const { data: teams, isLoading } = useTeams();
  const { data: managers } = useUsersList({ role: "manager", limit: 50 });
  const { data: agents } = useUsersList({ role: "agent", limit: 100, isActive: true });

  const [createOpen, setCreateOpen] = useState(false);
  const [memberTeamId, setMemberTeamId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [managerId, setManagerId] = useState("");
  const [memberUserId, setMemberUserId] = useState("");

  const createTeam = useMutation({
    mutationFn: () =>
      teamsApi.create({
        name: name.trim(),
        description: description.trim(),
        managerId: managerId || null
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      pushToast({ type: "success", message: "Team created" });
      setCreateOpen(false);
      setName("");
      setDescription("");
      setManagerId("");
    },
    onError: (err) => pushToast({ type: "error", message: getApiErrorMessage(err) })
  });

  const addMember = useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      teamsApi.addMember(teamId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      pushToast({ type: "success", message: "Member added" });
      setMemberTeamId(null);
      setMemberUserId("");
    },
    onError: (err) => pushToast({ type: "error", message: getApiErrorMessage(err) })
  });

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createTeam.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Team management</h1>
          <p className="mt-1 text-sm text-slate-600">Organize agents into support teams</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>New team</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <DataTable<Team>
          rows={teams || []}
          rowKey={(t) => t._id}
          columns={[
            { key: "name", header: "Name", render: (t) => t.name },
            { key: "slug", header: "Slug", render: (t) => t.slug },
            {
              key: "members",
              header: "Members",
              render: (t) => (t.members as string[] | undefined)?.length ?? 0
            },
            {
              key: "status",
              header: "Status",
              render: (t) => (
                <Badge className={t.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100"}>
                  {t.isActive ? "Active" : "Inactive"}
                </Badge>
              )
            },
            {
              key: "actions",
              header: "",
              render: (t) => (
                <Button variant="secondary" onClick={() => setMemberTeamId(t._id)}>
                  Add member
                </Button>
              )
            }
          ]}
        />
      )}

      <Modal
        open={createOpen}
        title="Create team"
        onClose={() => setCreateOpen(false)}
        footer={
          <ModalActions
            onCancel={() => setCreateOpen(false)}
            onConfirm={() => {
              const form = document.getElementById("create-team-form") as HTMLFormElement | null;
              form?.requestSubmit();
            }}
            loading={createTeam.isPending}
          />
        }
      >
        <form id="create-team-form" onSubmit={handleCreate} className="space-y-3">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label className="block text-sm">
            <span className="text-slate-600">Manager (optional)</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
            >
              <option value="">None</option>
              {(managers?.items || []).map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
        </form>
      </Modal>

      <Modal
        open={Boolean(memberTeamId)}
        title="Add team member"
        onClose={() => setMemberTeamId(null)}
        footer={
          <ModalActions
            onCancel={() => setMemberTeamId(null)}
            onConfirm={() => {
              if (memberTeamId && memberUserId) {
                addMember.mutate({ teamId: memberTeamId, userId: memberUserId });
              }
            }}
            loading={addMember.isPending}
          />
        }
      >
        <label className="block text-sm">
          <span className="text-slate-600">Agent</span>
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={memberUserId}
            onChange={(e) => setMemberUserId(e.target.value)}
          >
            <option value="">Select agent</option>
            {(agents?.items || []).map((a) => (
              <option key={a._id} value={a._id}>
                {a.name} ({a.email})
              </option>
            ))}
          </select>
        </label>
      </Modal>
    </div>
  );
}
