import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ClipboardList, LogOut, MessageSquare, RefreshCw, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { CaptchaField, executeRecaptcha } from "@/components/CaptchaField";
import { captchaConfig } from "@/lib/captcha.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  isAdminAuthenticated,
  loginAdmin,
  logoutAdmin,
  validateAdminCredentials,
} from "@/lib/admin-auth";
import {
  getAllFeedback,
  getAllPreRegistrations,
  getStats,
  type FeedbackSubmission,
  type PreRegistration,
} from "@/lib/feedback-storage";

export const Route = createFileRoute("/admin/feedback")({
  component: AdminFeedbackPage,
});

function AdminFeedbackPage() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <LoginForm
        onSuccess={() => setAuthenticated(true)}
        onNavigateHome={() => navigate({ to: "/" })}
      />
    );
  }

  return (
    <Dashboard
      onLogout={() => {
        logoutAdmin();
        setAuthenticated(false);
      }}
      onNavigateHome={() => navigate({ to: "/" })}
    />
  );
}

function LoginForm({
  onSuccess,
  onNavigateHome,
}: {
  onSuccess: () => void;
  onNavigateHome: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    let token = captchaToken;
    if (captchaConfig.isV3) {
      token = await executeRecaptcha("admin_login");
    }
    if (!token) {
      setError("Iltimos, captcha ni tasdiqlang");
      return;
    }

    if (validateAdminCredentials(email, password)) {
      loginAdmin();
      onSuccess();
    } else {
      setError("Email yoki parol noto'g'ri");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="surface rounded-3xl p-8">
          <div className="mb-6 text-center">
            <BrandLogo className="mx-auto h-12 w-12" />
            <h1 className="mt-4 text-[20px] font-semibold">Admin panel</h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Arizalar va xabarlarni ko'rish uchun kiring
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="admin-password">Parol</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <CaptchaField onTokenChange={captchaConfig.isV2 ? setCaptchaToken : undefined} />
            {error && <p className="text-[13px] text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Kirish
            </Button>
          </form>

          <button
            onClick={onNavigateHome}
            className="mt-4 w-full text-center text-[12px] text-muted-foreground hover:text-foreground"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({
  onLogout,
  onNavigateHome,
}: {
  onLogout: () => void;
  onNavigateHome: () => void;
}) {
  const [preRegs, setPreRegs] = useState<PreRegistration[]>([]);
  const [feedback, setFeedback] = useState<FeedbackSubmission[]>([]);
  const [stats, setStats] = useState(getStats());

  function refresh() {
    setPreRegs(getAllPreRegistrations());
    setFeedback(getAllFeedback());
    setStats(getStats());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <h1 className="text-[18px] font-semibold">Arizalar boshqaruvi</h1>
            <p className="text-[12px] text-muted-foreground">
              Oldindan ro'yxat va xabarlar (localStorage)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="h-3.5 w-3.5" />
              Yangilash
            </Button>
            <Button variant="outline" size="sm" onClick={onNavigateHome}>
              Bosh sahifa
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-3.5 w-3.5" />
              Chiqish
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={Users} label="Jami" value={stats.totalCount} sub="Barcha arizalar" />
          <StatCard
            icon={UserPlus}
            label="Oldindan ro'yxat"
            value={stats.preRegistrationCount}
            sub="Pre-registration"
          />
          <StatCard
            icon={MessageSquare}
            label="Xabarlar"
            value={stats.feedbackCount}
            sub="Taklif va arizalar"
          />
        </div>

        {/* Breakdown */}
        {(Object.keys(stats.byBusinessType).length > 0 ||
          Object.keys(stats.byTopic).length > 0) && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Object.keys(stats.byBusinessType).length > 0 && (
              <div className="surface rounded-2xl p-5">
                <h3 className="text-[14px] font-semibold">Biznes turi bo'yicha</h3>
                <ul className="mt-3 space-y-1">
                  {Object.entries(stats.byBusinessType).map(([type, count]) => (
                    <li key={type} className="flex justify-between text-[13px]">
                      <span>{type}</span>
                      <span className="font-medium">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {Object.keys(stats.byTopic).length > 0 && (
              <div className="surface rounded-2xl p-5">
                <h3 className="text-[14px] font-semibold">Mavzu bo'yicha</h3>
                <ul className="mt-3 space-y-1">
                  {Object.entries(stats.byTopic).map(([topic, count]) => (
                    <li key={topic} className="flex justify-between text-[13px]">
                      <span>{topic}</span>
                      <span className="font-medium">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Pre-registrations table */}
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            <h2 className="text-[16px] font-semibold">
              Oldindan ro'yxatdan o'tganlar ({preRegs.length})
            </h2>
          </div>
          {preRegs.length === 0 ? (
            <EmptyState text="Hali oldindan ro'yxatdan o'tganlar yo'q" />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[640px] text-left text-[13px]">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Ism</th>
                    <th className="px-4 py-3 font-medium">Telefon</th>
                    <th className="px-4 py-3 font-medium">Biznes</th>
                    <th className="px-4 py-3 font-medium">Shahar</th>
                    <th className="px-4 py-3 font-medium">Sana</th>
                  </tr>
                </thead>
                <tbody>
                  {preRegs.map((item) => (
                    <tr key={item.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-medium">{item.name}</div>
                        {item.email && (
                          <div className="text-[11px] text-muted-foreground">{item.email}</div>
                        )}
                        {item.note && (
                          <div className="text-[11px] text-muted-foreground">{item.note}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">{item.phone}</td>
                      <td className="px-4 py-3">{item.businessType}</td>
                      <td className="px-4 py-3">{item.city}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Feedback table */}
        <div className="mt-8 pb-8">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <h2 className="text-[16px] font-semibold">Xabarlar ({feedback.length})</h2>
          </div>
          {feedback.length === 0 ? (
            <EmptyState text="Hali xabarlar yo'q" />
          ) : (
            <div className="grid gap-3">
              {feedback.map((item) => (
                <div key={item.id} className="surface rounded-2xl p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-[12px] text-muted-foreground">
                        {item.phone} · {item.topic}
                      </div>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                  <p className="mt-2 text-[13px] text-muted-foreground">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <div className="surface rounded-2xl p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-[12px]">{label}</span>
      </div>
      <div className="mt-2 font-display text-[32px] font-semibold">{value}</div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-[13px] text-muted-foreground">
      {text}
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("uz-UZ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
