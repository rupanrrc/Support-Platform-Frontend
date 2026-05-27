import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateTicket } from "@/hooks/useTickets";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { getApiErrorMessage } from "@/api/axiosInstance";
import { useUiStore } from "@/stores/uiStore";
import { getTicketDetailPath } from "@/utils/ticketPaths";
import type { TicketPriority } from "@/types/ticket";

const priorities: TicketPriority[] = ["low", "medium", "high", "critical"];

export function CreateTicketPage() {
  const navigate = useNavigate();
  const createTicket = useCreateTicket();
  const pushToast = useUiStore((s) => s.pushToast);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (title.trim().length < 3) next.title = "Title must be at least 3 characters";
    if (description.trim().length < 5) next.description = "Description must be at least 5 characters";
    if (!category.trim()) next.category = "Category is required";
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      const ticket = await createTicket.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        category: category.trim().toLowerCase(),
        priority
      });
      pushToast({ type: "success", message: "Ticket created" });
      navigate(getTicketDetailPath("customer", ticket._id));
    } catch (err) {
      pushToast({ type: "error", message: getApiErrorMessage(err) });
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New ticket</h1>
        <p className="mt-1 text-sm text-slate-600">Describe your issue and our team will respond.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Description</span>
          <textarea
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description ? <p className="mt-1 text-xs text-red-600">{errors.description}</p> : null}
        </label>
        <Input
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          error={errors.category}
          placeholder="e.g. billing, technical"
        />
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Priority</span>
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TicketPriority)}
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={createTicket.isPending}>
            Submit ticket
          </Button>
          <Link
            to="/customer/tickets"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
