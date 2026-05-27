import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { usersApi } from "@/api/usersApi";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { getApiErrorMessage } from "@/api/axiosInstance";
import { useUiStore } from "@/stores/uiStore";
import { validatePassword, PASSWORD_HINT } from "@/utils/passwordRules";

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const pushToast = useUiStore((s) => s.pushToast);

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateProfile = useMutation({
    mutationFn: () => usersApi.updateProfile({ name: name.trim() }),
    onSuccess: (updated) => {
      setUser(updated);
      pushToast({ type: "success", message: "Profile updated" });
    },
    onError: (err) => pushToast({ type: "error", message: getApiErrorMessage(err) })
  });

  const changePassword = useMutation({
    mutationFn: () => usersApi.changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      pushToast({ type: "success", message: "Password changed" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err) => pushToast({ type: "error", message: getApiErrorMessage(err) })
  });

  const handleProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProfile.mutate();
  };

  const handlePassword = (e: FormEvent) => {
    e.preventDefault();
    const pwError = validatePassword(newPassword);
    if (pwError) {
      pushToast({ type: "error", message: pwError });
      return;
    }
    if (newPassword !== confirmPassword) {
      pushToast({ type: "error", message: "Passwords do not match" });
      return;
    }
    changePassword.mutate();
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          {user.email} · <span className="capitalize">{user.role}</span>
        </p>
      </div>

      <form onSubmit={handleProfile} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Account</h2>
        <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button type="submit" loading={updateProfile.isPending}>
          Save profile
        </Button>
      </form>

      <form onSubmit={handlePassword} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold">Change password</h2>
        <Input
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
        />
        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
        />
        <p className="-mt-2 text-xs text-slate-500">{PASSWORD_HINT}</p>
        <Input
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
        <Button type="submit" loading={changePassword.isPending}>
          Update password
        </Button>
      </form>
    </div>
  );
}
