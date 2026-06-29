import { Search, Tags } from "lucide-react";

import { Section, SectionTitle } from "@/components/PublicShell";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type SeoQueryGroup = {
  title: string;
  queries: string[];
};

export function SeoQueryTagsSection({ compact = false }: { compact?: boolean }) {
  const { t, tRaw } = useTranslation();
  const groups = tRaw<SeoQueryGroup[]>("seoQueries.groups");

  return (
    <Section className={cn(compact ? "py-10" : "py-16")}>
      <div className="rounded-[24px] border border-border bg-card p-5 shadow-[0_18px_70px_-54px_rgba(0,0,0,0.45)] md:p-7">
        <div className="grid gap-7 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
          <div>
            <SectionTitle
              eyebrow={t("seoQueries.eyebrow")}
              title={t("seoQueries.title")}
              sub={t("seoQueries.subtitle")}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {groups.map((group) => (
              <article
                key={group.title}
                className="rounded-[18px] border border-border bg-muted/25 p-4"
              >
                <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">
                    <Search className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  {group.title}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.queries.map((query) => (
                    <span
                      key={query}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      <Tags className="h-3 w-3 text-primary" aria-hidden />
                      {query}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
