import { jsPDF } from "jspdf";
import type { InvitationProject } from "../types/studio";

export function renderInvitation(project: InvitationProject, scale = 2): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = project.width * scale;
  canvas.height = project.height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("تعذر إنشاء مساحة التصدير");

  ctx.scale(scale, scale);
  ctx.fillStyle = project.background;
  ctx.fillRect(0, 0, project.width, project.height);

  // إطار رفيع بلون الشامبانيا
  ctx.strokeStyle = "#c8b58e";
  ctx.lineWidth = 1;
  ctx.strokeRect(24, 24, project.width - 48, project.height - 48);
  ctx.strokeStyle = "rgba(185,154,98,.45)";
  ctx.lineWidth = 1;
  ctx.strokeRect(32, 32, project.width - 64, project.height - 64);

  for (const layer of project.layers) {
    ctx.save();
    ctx.fillStyle = layer.color;
    ctx.font = `${layer.italic ? "italic " : ""}${layer.bold ? "bold " : ""}${layer.fontSize}px "${layer.fontFamily.split(",")[0].replace(/"/g, "")}"`;
    ctx.textAlign = layer.align;
    ctx.textBaseline = "middle";
    ctx.direction = "rtl";
    ctx.fillText(layer.text, layer.x, layer.y, layer.width);
    ctx.restore();
  }
  return canvas;
}

export async function exportInvitation(project: InvitationProject, format: "png" | "jpg" | "pdf") {
  await document.fonts.ready;
  const canvas = renderInvitation(project, 3);

  if (format === "pdf") {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [project.width, project.height],
    });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, project.width, project.height);
    pdf.save(`${project.name || "roshan-invitation"}.pdf`);
    return;
  }

  const mime = format === "jpg" ? "image/jpeg" : "image/png";
  const link = document.createElement("a");
  link.href = canvas.toDataURL(mime, 0.96);
  link.download = `${project.name || "roshan-invitation"}.${format}`;
  link.click();
}
