export interface BarDatum {
  label: string;
  value: number;
}

/**
 * Gráfico de barras em SVG puro (sem libs externas), server component.
 * Usa tokens de cor do design system (orchid-*).
 */
export function BarChart({ data, height = 220 }: { data: BarDatum[]; height?: number }) {
  const width = 640;
  const paddingX = 24;
  const paddingTop = 16;
  const paddingBottom = 36;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingTop - paddingBottom;
  const max = Math.max(1, ...data.map((d) => d.value));
  const n = data.length || 1;
  const gap = 16;
  const barW = Math.max(8, (chartW - gap * (n - 1)) / n);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label="Gráfico de barras de eventos de cultivo por mês"
    >
      <line
        x1={paddingX}
        y1={paddingTop + chartH}
        x2={width - paddingX}
        y2={paddingTop + chartH}
        className="stroke-orchid-100"
        strokeWidth={1}
      />
      {data.map((d, i) => {
        const h = (d.value / max) * chartH;
        const x = paddingX + i * (barW + gap);
        const y = paddingTop + chartH - h;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={Math.max(0, h)} rx={6} className="fill-orchid-500">
              <title>{`${d.label}: ${d.value}`}</title>
            </rect>
            {d.value > 0 && (
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                className="fill-orchid-800 text-xs"
              >
                {d.value}
              </text>
            )}
            <text
              x={x + barW / 2}
              y={paddingTop + chartH + 20}
              textAnchor="middle"
              className="fill-orchid-600 text-xs"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
