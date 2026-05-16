import Link from "next/link";
import { TOOLS } from "@/src/lib/content";
import { Card, Badge } from "@/src/components/ui/Card";

export function ToolsGrid({ limit }: { limit?: number }) {
  const tools = limit ? TOOLS.slice(0, limit) : TOOLS;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool, i) => {
        const available = tool.status === "available";
        const inner = (
          <Card
            elevated={available}
            interactive={available}
            className={
              available ? "h-full" : "h-full border-dashed bg-surface"
            }
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold tracking-widest text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              {available ? (
                <Badge tone="success" dot>
                  ใช้งานได้แล้ว
                </Badge>
              ) : (
                <Badge tone="neutral" dot>
                  เร็ว ๆ นี้
                </Badge>
              )}
            </div>
            <h3 className="mt-4 text-lg font-bold text-navy-900">
              {tool.name}
            </h3>
            <p className="mt-2 text-sm leading-7 text-muted">
              {tool.description}
            </p>
            {available && (
              <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                เปิดเครื่องมือ
                <span aria-hidden>→</span>
              </p>
            )}
          </Card>
        );

        return available && tool.href ? (
          <Link key={tool.id} href={tool.href} className="block">
            {inner}
          </Link>
        ) : (
          <div key={tool.id}>{inner}</div>
        );
      })}
    </div>
  );
}
