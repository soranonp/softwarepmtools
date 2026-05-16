import { RECOMMEND_LOGIC, getServicePackage } from "@/src/lib/content";
import { Card } from "@/src/components/ui/Card";

export function RecommendLogic() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {RECOMMEND_LOGIC.map((item, i) => {
        const pkg = getServicePackage(item.packageId);
        return (
          <Card key={item.packageId} elevated className="flex flex-col">
            <span className="font-mono text-xs font-semibold tracking-widest text-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-3 flex-1 text-sm leading-7 text-navy-800">
              {item.situation}
            </p>
            <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
              <span className="text-xs text-muted">แนะนำ</span>
              <span className="text-sm font-bold text-brand-700">
                {pkg?.name ?? item.packageId}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
