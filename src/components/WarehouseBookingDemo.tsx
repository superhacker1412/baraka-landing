import { CheckCircle2, MousePointerClick, Square } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type BaseStatus = "available" | "occupied" | "booked";
type DisplayStatus = BaseStatus | "selected";

type Cell = {
  id: string;
  name?: string;
  status: BaseStatus;
};

const GRID_COLS = 6;
const GRID_ROWS = 4;
const SQM_PER_CELL = 1;

/** 6×4 = 24 m²; left column (indices 0,6,12,18) = 4 m² occupied */
function buildInitialCells(): Cell[] {
  const bookedIndices = new Set([8, 14, 21]);
  const cells: Cell[] = [];

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const index = row * GRID_COLS + col;
      const id = `c${index}`;

      if (col === 0) {
        cells.push({ id, name: `Z-${row + 1}`, status: "occupied" });
      } else if (bookedIndices.has(index)) {
        cells.push({ id, status: "booked" });
      } else {
        cells.push({ id, status: "available" });
      }
    }
  }

  return cells;
}

const STATUS_CLASS: Record<DisplayStatus, string> = {
  available:
    "border-emerald-300/80 bg-white text-emerald-800 hover:bg-emerald-50 hover:border-emerald-400 cursor-pointer dark:border-emerald-600/50 dark:bg-emerald-950/30 dark:text-emerald-200 dark:hover:bg-emerald-900/50",
  occupied:
    "border-emerald-600 bg-emerald-500 text-white cursor-not-allowed dark:border-emerald-500 dark:bg-emerald-600",
  booked:
    "border-amber-400/80 bg-amber-100 text-amber-900 cursor-not-allowed dark:border-amber-500/60 dark:bg-amber-950/60 dark:text-amber-200",
  selected:
    "border-blue-500 bg-blue-500 text-white shadow-sm ring-2 ring-blue-300/60 cursor-pointer dark:border-blue-400 dark:bg-blue-600 dark:ring-blue-400/40",
};

const LEGEND_CLASS: Record<DisplayStatus, string> = {
  available: "border-emerald-300/80 bg-white dark:border-emerald-600/50 dark:bg-emerald-950/30",
  occupied: "border-emerald-600 bg-emerald-500 dark:border-emerald-500 dark:bg-emerald-600",
  booked: "border-amber-400/80 bg-amber-200 dark:bg-amber-900/70",
  selected: "border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-600",
};

export function WarehouseBookingDemo() {
  const { t } = useTranslation();
  const [cells] = useState(buildInitialCells);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const statusLabel = useMemo(
    () => ({
      available: t("landing.warehouse.statusAvailable"),
      occupied: t("landing.warehouse.statusOccupied"),
      booked: t("landing.warehouse.statusBooked"),
      selected: t("landing.warehouse.statusSelected"),
    }),
    [t],
  );

  const stats = useMemo(() => {
    let occupied = 0;
    let booked = 0;
    let available = 0;

    for (const cell of cells) {
      if (cell.status === "occupied") occupied += SQM_PER_CELL;
      else if (cell.status === "booked") booked += SQM_PER_CELL;
      else available += SQM_PER_CELL;
    }

    return { occupied, booked, available, total: cells.length * SQM_PER_CELL };
  }, [cells]);

  const selectedSqm = selectedIds.size * SQM_PER_CELL;

  function getDisplayStatus(cell: Cell): DisplayStatus {
    if (selectedIds.has(cell.id)) return "selected";
    return cell.status;
  }

  function handleCellClick(cell: Cell) {
    if (cell.status === "occupied" || cell.status === "booked") return;

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(cell.id)) next.delete(cell.id);
      else next.add(cell.id);
      return next;
    });
  }

  function cellTitle(cell: Cell, status: DisplayStatus): string {
    const sqmLabel = t("landing.warehouse.cellSqm", { sqm: SQM_PER_CELL });
    const name = cell.name ? `${cell.name} — ` : "";
    return `${name}${sqmLabel} (${statusLabel[status]})`;
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-4 lg:grid-cols-[1fr_190px] lg:gap-5">
      <div className="surface rounded-2xl p-3 sm:p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium sm:text-[13px]">
            <Square className="h-3.5 w-3.5 text-primary" aria-hidden />
            {t("landing.warehouse.schemaTitle")}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground sm:text-[11px]">
            <MousePointerClick className="h-3 w-3 shrink-0" aria-hidden />
            {t("landing.warehouse.clickHint")}
          </div>
        </div>

        <p className="mb-2 text-[10px] font-medium text-muted-foreground sm:text-[11px]">
          {t("landing.warehouse.areaSummary", {
            occupied: stats.occupied,
            available: stats.available,
          })}
          {stats.booked > 0 && ` · ${t("landing.warehouse.areaBooked", { booked: stats.booked })}`}
        </p>

        <div
          className="mx-auto grid max-w-md grid-cols-6 gap-1 sm:gap-1.5"
          role="grid"
          aria-label={t("landing.warehouse.gridAria")}
        >
          {cells.map((cell) => {
            const status = getDisplayStatus(cell);
            const isDisabled = cell.status === "occupied" || cell.status === "booked";

            return (
              <button
                key={cell.id}
                type="button"
                role="gridcell"
                aria-pressed={status === "selected"}
                disabled={isDisabled}
                onClick={() => handleCellClick(cell)}
                aria-label={cellTitle(cell, status)}
                title={cellTitle(cell, status)}
                className={cn(
                  "relative aspect-square min-h-7 rounded-md border-2 transition-all sm:min-h-8",
                  STATUS_CLASS[status],
                )}
              >
                {status === "selected" && (
                  <CheckCircle2
                    className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-white text-blue-600 dark:bg-blue-950 dark:text-blue-300"
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] sm:text-[11px]">
          {(["occupied", "available", "booked", "selected"] as DisplayStatus[]).map((status) => (
            <span key={status} className="inline-flex items-center gap-1">
              <span
                className={cn("h-2.5 w-2.5 rounded-sm border-2", LEGEND_CLASS[status])}
                aria-hidden
              />
              {statusLabel[status]}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
        <div className="surface flex-1 rounded-xl p-3.5 sm:p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("landing.warehouse.sellerTitle")}
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {t("landing.warehouse.sellerText")}
          </p>
          {selectedIds.size > 0 ? (
            <div className="mt-2.5 rounded-lg bg-blue-500/10 px-2.5 py-2 text-xs text-blue-900 dark:text-blue-200">
              {t("landing.warehouse.selectedReady", {
                count: selectedIds.size,
                sqm: selectedSqm,
              })}
            </div>
          ) : (
            <div className="mt-2.5 rounded-lg bg-muted/50 px-2.5 py-2 text-[11px] text-muted-foreground">
              {t("landing.warehouse.selectCell")}
            </div>
          )}
        </div>

        <div className="surface flex-1 rounded-xl p-3.5 sm:p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("landing.warehouse.ownerTitle")}
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {t("landing.warehouse.ownerText")}
          </p>
        </div>
      </div>
    </div>
  );
}
