"""Generate the four-functions dashboard SVG for §3 of index.html.

Builds f, F, S, h for a Weibull(k=2, scale=14/sqrt(ln 2)) so that median ~ 14 mo.
Writes a single self-contained <svg> block to scripts/fourfns.svg.
"""

from __future__ import annotations

import math
from pathlib import Path

import numpy as np

K = 2.0
LAM = 14.0 / math.sqrt(math.log(2.0))
T_MAX = 30.0
T_STAR = 12.0
N = 400


def weibull(t: np.ndarray) -> dict[str, np.ndarray]:
    z = t / LAM
    S = np.exp(-(z**K))
    F = 1.0 - S
    f = (K / LAM) * (z ** (K - 1)) * S
    h = (K / LAM) * (z ** (K - 1))
    return {"f": f, "F": F, "S": S, "h": h}


def fmt(x: float) -> str:
    return f"{x:.3f}".rstrip("0").rstrip(".")


def path_d(xs: np.ndarray, ys: np.ndarray, x0: float, y0: float, w: float, h: float,
           xmin: float, xmax: float, ymin: float, ymax: float) -> str:
    """Map data (xs, ys) into a sub-rect (x0, y0, w, h) and return SVG path d."""
    sx = w / (xmax - xmin)
    sy = h / (ymax - ymin)
    px = x0 + (xs - xmin) * sx
    py = y0 + h - (ys - ymin) * sy
    parts = [f"M {fmt(px[0])} {fmt(py[0])}"]
    for i in range(1, len(xs)):
        parts.append(f"L {fmt(px[i])} {fmt(py[i])}")
    return " ".join(parts)


def axis_ticks(vmin: float, vmax: float, n: int = 4) -> list[float]:
    """Round-ish ticks between vmin and vmax."""
    step = (vmax - vmin) / n
    return [vmin + step * i for i in range(n + 1)]


def panel(
    label: str,
    expr: str,
    intuition: str,
    t: np.ndarray,
    y: np.ndarray,
    star_t: float,
    star_y: float,
    star_label: str,
    x0: float,
    y0: float,
    w: float,
    h: float,
    ymax: float,
    y_ticks: list[float],
    y_tick_fmt,
) -> str:
    pad_l, pad_r, pad_t, pad_b = 44.0, 14.0, 28.0, 30.0
    plot_x = x0 + pad_l
    plot_y = y0 + pad_t
    plot_w = w - pad_l - pad_r
    plot_h = h - pad_t - pad_b

    xmin, xmax = 0.0, T_MAX

    # Star position in pixel space
    sx = plot_w / (xmax - xmin)
    sy = plot_h / (ymax - 0.0)
    star_px = plot_x + (star_t - xmin) * sx
    star_py = plot_y + plot_h - (star_y - 0.0) * sy

    out: list[str] = []
    out.append(f'<g transform="translate(0,0)">')

    # Panel label (top-left), expression (top-right)
    out.append(
        f'<text x="{fmt(plot_x)}" y="{fmt(y0 + 18)}" '
        f'class="panel-label">{label}</text>'
    )
    out.append(
        f'<text x="{fmt(plot_x + plot_w)}" y="{fmt(y0 + 18)}" '
        f'class="panel-expr" text-anchor="end">{expr}</text>'
    )

    # Plot frame (bottom + left axes only)
    out.append(
        f'<path d="M {fmt(plot_x)} {fmt(plot_y)} L {fmt(plot_x)} {fmt(plot_y + plot_h)} '
        f'L {fmt(plot_x + plot_w)} {fmt(plot_y + plot_h)}" '
        f'class="axis"/>'
    )

    # Horizontal grid lines at y_ticks (faint)
    for yt in y_ticks:
        py = plot_y + plot_h - (yt / ymax) * plot_h
        out.append(
            f'<line x1="{fmt(plot_x)}" y1="{fmt(py)}" '
            f'x2="{fmt(plot_x + plot_w)}" y2="{fmt(py)}" class="grid"/>'
        )
        out.append(
            f'<text x="{fmt(plot_x - 6)}" y="{fmt(py + 3.5)}" '
            f'class="tick-label" text-anchor="end">{y_tick_fmt(yt)}</text>'
        )

    # X-axis ticks (0, 10, 20, 30)
    for xt in [0, 10, 20, 30]:
        px = plot_x + (xt / xmax) * plot_w
        out.append(
            f'<line x1="{fmt(px)}" y1="{fmt(plot_y + plot_h)}" '
            f'x2="{fmt(px)}" y2="{fmt(plot_y + plot_h + 4)}" class="axis"/>'
        )
        out.append(
            f'<text x="{fmt(px)}" y="{fmt(plot_y + plot_h + 16)}" '
            f'class="tick-label" text-anchor="middle">{xt}</text>'
        )

    # X-axis title (centered)
    out.append(
        f'<text x="{fmt(plot_x + plot_w / 2)}" y="{fmt(y0 + h - 4)}" '
        f'class="axis-title" text-anchor="middle">t (months)</text>'
    )

    # Vertical guide-line at t = t*
    out.append(
        f'<line x1="{fmt(star_px)}" y1="{fmt(plot_y)}" '
        f'x2="{fmt(star_px)}" y2="{fmt(plot_y + plot_h)}" class="guide"/>'
    )

    # Curve
    d = path_d(t, y, plot_x, plot_y, plot_w, plot_h, xmin, xmax, 0.0, ymax)
    out.append(f'<path d="{d}" class="curve"/>')

    # Star marker
    out.append(f'<circle cx="{fmt(star_px)}" cy="{fmt(star_py)}" r="3.5" class="star"/>')
    out.append(
        f'<text x="{fmt(star_px + 7)}" y="{fmt(star_py - 6)}" class="star-label">{star_label}</text>'
    )

    # One-line intuition under panel
    out.append(
        f'<text x="{fmt(plot_x)}" y="{fmt(y0 + h - 18)}" class="intuition">{intuition}</text>'
    )

    out.append("</g>")
    return "\n".join(out)


def main() -> None:
    t = np.linspace(0.0, T_MAX, N)
    vals = weibull(t)
    star = weibull(np.array([T_STAR]))
    fS, FS, SS, hS = star["f"][0], star["F"][0], star["S"][0], star["h"][0]

    # Panel dimensions
    pad_outer = 24.0
    gap = 24.0
    cell_w = 360.0
    cell_h = 240.0
    caption_h = 56.0
    total_w = pad_outer * 2 + cell_w * 2 + gap
    total_h = pad_outer * 2 + cell_h * 2 + gap + caption_h

    # Cell positions (2x2)
    tl_x = pad_outer
    tl_y = pad_outer
    tr_x = pad_outer + cell_w + gap
    tr_y = pad_outer
    bl_x = pad_outer
    bl_y = pad_outer + cell_h + gap
    br_x = pad_outer + cell_w + gap
    br_y = pad_outer + cell_h + gap

    # ymax per panel
    f_max = float(vals["f"].max()) * 1.15
    h_max = float(vals["h"].max()) * 1.05
    h_max = min(h_max, 0.4)  # clip for visual sanity

    # Pre-clip h curve so it doesn't run off
    h_curve = np.minimum(vals["h"], h_max)

    panels = []
    panels.append(panel(
        "f(t)", "density of T",
        "where the events tend to fall",
        t, vals["f"], T_STAR, fS, f"f({int(T_STAR)}) ≈ {fS:.3f}",
        tl_x, tl_y, cell_w, cell_h,
        f_max, [0.0, f_max * 0.5, f_max], lambda v: f"{v:.2f}",
    ))
    panels.append(panel(
        "F(t)", "P(T ≤ t)",
        "fraction that have failed by t",
        t, vals["F"], T_STAR, FS, f"F({int(T_STAR)}) ≈ {FS:.3f}",
        tr_x, tr_y, cell_w, cell_h,
        1.0, [0.0, 0.25, 0.5, 0.75, 1.0], lambda v: f"{v:.2f}",
    ))
    panels.append(panel(
        "S(t)", "P(T > t) = 1 − F(t)",
        "fraction still surviving at t",
        t, vals["S"], T_STAR, SS, f"S({int(T_STAR)}) ≈ {SS:.3f}",
        bl_x, bl_y, cell_w, cell_h,
        1.0, [0.0, 0.25, 0.5, 0.75, 1.0], lambda v: f"{v:.2f}",
    ))
    panels.append(panel(
        "h(t)", "f(t) / S(t)",
        "instantaneous failure rate among survivors",
        t, h_curve, T_STAR, hS, f"h({int(T_STAR)}) ≈ {hS:.3f}",
        br_x, br_y, cell_w, cell_h,
        h_max, [0.0, h_max * 0.5, h_max], lambda v: f"{v:.2f}",
    ))

    # Caption strip at bottom
    cap_y = pad_outer + cell_h * 2 + gap + 28
    cap_text = (
        f"All four built from one Weibull(k=2, λ≈{LAM:.1f}). "
        f"Vertical guide at t* = {int(T_STAR)}. "
        f"Sanity: f/S = {fS:.3f}/{SS:.3f} = {fS/SS:.3f} = h."
    )

    inner = "\n".join(panels)
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(total_w)} {fmt(total_h)}" class="fourfns-svg" role="img" aria-label="Four functions dashboard: f, F, S, h">
  <style>
    .fourfns-svg {{ font-family: 'Geist Mono', ui-monospace, monospace; }}
    .axis {{ fill: none; stroke: #4A4D55; stroke-width: 1; }}
    .grid {{ fill: none; stroke: #2A2C32; stroke-width: 1; stroke-dasharray: 2 4; }}
    .curve {{ fill: none; stroke: #E6E7EA; stroke-width: 1.6; stroke-linejoin: round; stroke-linecap: round; }}
    .guide {{ stroke: #7A7E88; stroke-width: 0.8; stroke-dasharray: 3 3; }}
    .star {{ fill: #F2B14C; stroke: #0D0E10; stroke-width: 1; }}
    .star-label {{ fill: #F2B14C; font-size: 10.5px; }}
    .panel-label {{ fill: #E6E7EA; font-size: 14px; font-weight: 500; }}
    .panel-expr {{ fill: #9498A2; font-size: 11px; }}
    .tick-label {{ fill: #7A7E88; font-size: 10px; }}
    .axis-title {{ fill: #9498A2; font-size: 10.5px; }}
    .intuition {{ fill: #B6B9C2; font-size: 11px; font-style: italic; font-family: 'Geist', 'Inter', system-ui, sans-serif; }}
    .caption {{ fill: #9498A2; font-size: 11.5px; font-family: 'Geist', 'Inter', system-ui, sans-serif; }}
  </style>
{inner}
  <text x="{fmt(total_w / 2)}" y="{fmt(cap_y)}" class="caption" text-anchor="middle">{cap_text}</text>
</svg>
"""

    out_path = Path(__file__).parent / "fourfns.svg"
    out_path.write_text(svg)
    print(f"wrote {out_path} ({len(svg)} bytes)")
    print(f"sanity: f({T_STAR})/S({T_STAR}) = {fS/SS:.4f}; h({T_STAR}) = {hS:.4f}")


if __name__ == "__main__":
    main()
