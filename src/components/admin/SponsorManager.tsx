"use client";

import { useEffect, useState, useCallback } from "react";
import { CATEGORIES } from "@/lib/constants";
import { CategorySlug } from "@/lib/types";

interface Sponsor {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  activeFrom: string;
  activeUntil: string;
  logo?: string;
  reportToken?: string;
}

type FormData = {
  name: string;
  url: string;
  description: string;
  category: string;
  activeFrom: string;
  activeUntil: string;
  logo: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  url: "",
  description: "",
  category: "ai-general",
  activeFrom: new Date().toISOString().split("T")[0],
  activeUntil: "",
  logo: "",
};

function getStatus(from: string, until: string): { label: string; color: string } {
  const today = new Date().toISOString().split("T")[0];
  if (today < from) return { label: "Scheduled", color: "#f59e0b" };
  if (today > until) return { label: "Expired", color: "#ef4444" };
  return { label: "Active", color: "#22c55e" };
}

export default function SponsorManager() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchSponsors = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sponsors");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSponsors(data.sponsors);
    } catch {
      setError("Failed to load sponsors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setError("");
  }

  function openEdit(s: Sponsor) {
    setEditingId(s.id);
    setForm({
      name: s.name,
      url: s.url,
      description: s.description,
      category: s.category,
      activeFrom: s.activeFrom,
      activeUntil: s.activeUntil,
      logo: s.logo || "",
    });
    setShowForm(true);
    setError("");
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        logo: form.logo || undefined,
      };

      const url = editingId
        ? `/api/admin/sponsors/${editingId}`
        : "/api/admin/sponsors";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setShowForm(false);
      setEditingId(null);
      await fetchSponsors();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete sponsor "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/sponsors/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchSponsors();
    } catch {
      setError("Failed to delete sponsor");
    }
  }

  function copyReportLink(id: string, token: string) {
    const url = `${window.location.origin}/sponsor-report/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const categoryOptions = Object.entries(CATEGORIES).map(([slug, cat]) => ({
    slug,
    name: cat.name,
  }));

  if (loading) {
    return (
      <div className="bg-surface border border-border-dim rounded-lg p-4">
        <p className="font-mono text-xs text-text-dim text-center py-8">
          Loading sponsors...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">
          Sponsor Management
        </p>
        <button
          onClick={openCreate}
          className="font-mono text-[10px] px-3 py-1.5 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 rounded hover:bg-neon-cyan/20 transition-colors uppercase tracking-wider"
        >
          [+ New Sponsor]
        </button>
      </div>

      {error && (
        <div className="font-mono text-xs text-red-400 bg-red-400/10 border border-red-400/30 rounded px-3 py-2">
          {error}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="bg-surface border border-border-dim rounded-lg p-4 space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neon-cyan mb-2">
            {editingId ? "Edit Sponsor" : "New Sponsor"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[10px] text-text-dim uppercase mb-1">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-bg-primary border border-border-dim rounded px-3 py-2 font-mono text-xs text-text-primary focus:border-neon-cyan/50 outline-none"
                placeholder="Sponsor name"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-text-dim uppercase mb-1">
                URL
              </label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="w-full bg-bg-primary border border-border-dim rounded px-3 py-2 font-mono text-xs text-text-primary focus:border-neon-cyan/50 outline-none"
                placeholder="https://..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-mono text-[10px] text-text-dim uppercase mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full bg-bg-primary border border-border-dim rounded px-3 py-2 font-mono text-xs text-text-primary focus:border-neon-cyan/50 outline-none resize-none"
                placeholder="Brief description of the tool/product"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-text-dim uppercase mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-bg-primary border border-border-dim rounded px-3 py-2 font-mono text-xs text-text-primary focus:border-neon-cyan/50 outline-none"
              >
                {categoryOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] text-text-dim uppercase mb-1">
                Logo URL (optional)
              </label>
              <input
                type="url"
                value={form.logo}
                onChange={(e) => setForm({ ...form, logo: e.target.value })}
                className="w-full bg-bg-primary border border-border-dim rounded px-3 py-2 font-mono text-xs text-text-primary focus:border-neon-cyan/50 outline-none"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-text-dim uppercase mb-1">
                Active From
              </label>
              <input
                type="date"
                value={form.activeFrom}
                onChange={(e) => setForm({ ...form, activeFrom: e.target.value })}
                className="w-full bg-bg-primary border border-border-dim rounded px-3 py-2 font-mono text-xs text-text-primary focus:border-neon-cyan/50 outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-text-dim uppercase mb-1">
                Active Until
              </label>
              <input
                type="date"
                value={form.activeUntil}
                onChange={(e) => setForm({ ...form, activeUntil: e.target.value })}
                className="w-full bg-bg-primary border border-border-dim rounded px-3 py-2 font-mono text-xs text-text-primary focus:border-neon-cyan/50 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="font-mono text-[10px] px-4 py-1.5 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 rounded hover:bg-neon-cyan/20 transition-colors uppercase tracking-wider disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "[Update]" : "[Create]"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="font-mono text-[10px] px-4 py-1.5 text-text-dim border border-border-dim rounded hover:bg-surface-light/50 transition-colors uppercase tracking-wider"
            >
              [Cancel]
            </button>
          </div>
        </div>
      )}

      {/* Sponsors Table */}
      <div className="bg-surface border border-border-dim rounded-lg p-4 overflow-x-auto">
        {sponsors.length === 0 ? (
          <p className="font-mono text-xs text-text-dim text-center py-8">
            No sponsors yet. Create your first sponsor above.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-dim">
                <th className="text-left font-mono text-[10px] uppercase text-text-dim pb-2 pr-4">
                  Name
                </th>
                <th className="text-left font-mono text-[10px] uppercase text-text-dim pb-2 pr-4">
                  Category
                </th>
                <th className="text-left font-mono text-[10px] uppercase text-text-dim pb-2 pr-4">
                  Period
                </th>
                <th className="text-left font-mono text-[10px] uppercase text-text-dim pb-2 pr-4">
                  Status
                </th>
                <th className="text-right font-mono text-[10px] uppercase text-text-dim pb-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sponsors.map((s) => {
                const status = getStatus(s.activeFrom, s.activeUntil);
                const cat = CATEGORIES[s.category as CategorySlug];
                return (
                  <tr
                    key={s.id}
                    className="border-b border-border-dim/30 hover:bg-surface-light/50 transition-colors"
                  >
                    <td className="py-2 pr-4">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-text-secondary hover:text-neon-cyan transition-colors"
                      >
                        {s.name}
                      </a>
                    </td>
                    <td className="py-2 pr-4">
                      {cat && (
                        <span
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                          style={{
                            color: cat.color,
                            backgroundColor: `${cat.color}15`,
                            border: `1px solid ${cat.color}30`,
                          }}
                        >
                          {cat.name}
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-4">
                      <span className="font-mono text-[10px] text-text-dim">
                        {s.activeFrom} → {s.activeUntil}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      <span
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          color: status.color,
                          backgroundColor: `${status.color}15`,
                          border: `1px solid ${status.color}30`,
                        }}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEdit(s)}
                          className="font-mono text-[10px] text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                        >
                          [Edit]
                        </button>
                        {s.reportToken && (
                          <button
                            onClick={() => copyReportLink(s.id, s.reportToken!)}
                            className={`font-mono text-[10px] transition-colors ${
                              copiedId === s.id
                                ? "text-green-400"
                                : "text-purple-400 hover:text-purple-300"
                            }`}
                            title="Copy report link"
                          >
                            {copiedId === s.id ? "[Copied!]" : "[Report]"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="font-mono text-[10px] text-red-400 hover:text-red-300 transition-colors"
                        >
                          [Delete]
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
