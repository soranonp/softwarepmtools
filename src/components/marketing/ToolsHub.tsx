import Link from "next/link";
import { TOOL_CATEGORIES, SITE, type Tool } from "@/src/lib/content";
import { Card, Badge } from "@/src/components/ui/Card";
import { ButtonLink } from "@/src/components/ui/Button";

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const available = tool.status === "available";

  const body = (
    <Card
      elevated={available}
      interactive={available}
      className={
        available
          ? "flex h-full flex-col"
          : "flex h-full flex-col border-dashed bg-surface"
      }
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-semibold tracking-widest text-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
        {available ? (
          <Badge tone="success" dot>
            Available
          </Badge>
        ) : (
          <Badge tone="neutral" dot>
            Coming Soon
          </Badge>
        )}
      </div>

      <h3 className="mt-4 text-lg font-bold text-navy-900">{tool.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-7 text-muted">
        {tool.description}
      </p>

      <p className="mt-4 rounded-lg bg-surface px-3 py-2 text-xs text-muted ring-1 ring-line ring-inset">
        <span className="font-semibold text-navy-900">เหมาะสำหรับ: </span>
        {tool.targetUser}
      </p>

      <div className="mt-5">
        {available && tool.href ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
            เปิดเครื่องมือ <span aria-hidden>→</span>
          </span>
        ) : (
          <ButtonLink
            href={SITE.googleFormUrl}
            external
            variant="secondary"
            className="w-full"
          >
            สนใจเครื่องมือนี้ — แจ้งให้ทราบเมื่อพร้อม
          </ButtonLink>
        )}
      </div>
    </Card>
  );

  return available && tool.href ? (
    <Link href={tool.href} className="block">
      {body}
    </Link>
  ) : (
    <div>{body}</div>
  );
}

export function ToolsHub() {
  let counter = 0;
  return (
    <div className="space-y-16">
      {TOOL_CATEGORIES.map((category) => (
        <section key={category.id} id={category.id} className="scroll-mt-28">
          <div className="flex flex-col gap-1 border-l-4 border-brand-600 pl-4">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              {category.name}
            </h2>
            <p className="text-sm text-muted">{category.description}</p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} index={counter++} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
