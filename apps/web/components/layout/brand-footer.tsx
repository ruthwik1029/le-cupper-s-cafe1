export function BrandFooter() {
  return (
    <div className="flex flex-col gap-1 border-t border-sidebar-border px-4 py-3">
      <div className="flex items-center justify-between text-xs text-sidebar-foreground/80">
        <span className="font-semibold text-sidebar-foreground">Le Cuppers</span>
        <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50">POS</span>
      </div>
      <p className="text-[11px] leading-tight text-sidebar-foreground/60">
        Artisanal Hospitality &amp; Operations
      </p>
    </div>
  );
}
