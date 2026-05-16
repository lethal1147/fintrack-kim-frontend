"use client";

import { useState } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SectionHeader } from "./section-header";
import { SaveToast } from "./save-toast";

// ─── constants ────────────────────────────────────────────────────────────────

const MOCK_SESSIONS = [
  { device: "MacBook Pro — Chrome", location: "New York, US", current: true },
  { device: "iPhone 16 — Safari", location: "New York, US", current: false },
];

// ─── component ────────────────────────────────────────────────────────────────

export function SecurityTab() {
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [twoFa, setTwoFa] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (newPw && newPw !== confirm) {
      setError("New passwords don't match.");
      return;
    }
    setError("");
    setSaved(true);
    setCurrent("");
    setNewPw("");
    setConfirm("");
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <SectionHeader
        title="Security"
        description="Manage your password and account security."
      />

      {/* Password */}
      <div>
        <p className="text-sm font-semibold mb-3">Change password</p>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <div className="p-4 grid grid-cols-[160px_1fr] gap-4 items-center">
            <Label htmlFor="s-current" className="text-sm font-medium">
              Current password
            </Label>
            <Input
              id="s-current"
              type="password"
              placeholder="••••••••"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
          <div className="p-4 grid grid-cols-[160px_1fr] gap-4 items-center">
            <Label htmlFor="s-new" className="text-sm font-medium">
              New password
            </Label>
            <Input
              id="s-new"
              type="password"
              placeholder="••••••••"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
          </div>
          <div className="p-4 grid grid-cols-[160px_1fr] gap-4 items-center">
            <Label htmlFor="s-confirm" className="text-sm font-medium">
              Confirm password
            </Label>
            <Input
              id="s-confirm"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-1.5 mt-2 text-sm text-destructive">
            <IconAlertTriangle className="size-3.5" />
            {error}
          </div>
        )}
      </div>

      {/* 2FA */}
      <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Two-factor authentication</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add an extra layer of security with a one-time code on login.
          </p>
        </div>
        <Switch checked={twoFa} onCheckedChange={setTwoFa} />
      </div>

      {/* Active sessions */}
      <div>
        <p className="text-sm font-semibold mb-3">Active sessions</p>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          {MOCK_SESSIONS.map((s) => (
            <div
              key={s.device}
              className="px-4 py-3 flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-sm font-medium">{s.device}</p>
                <p className="text-xs text-muted-foreground">{s.location}</p>
              </div>
              {s.current ? (
                <span className="text-xs text-emerald-600 font-medium">
                  This device
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-destructive hover:text-destructive h-7 px-2"
                >
                  Sign out
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Save security settings</Button>
      </div>

      <SaveToast visible={saved} />
    </form>
  );
}
