export type ExportFormat = "png" | "jpg" | "pdf";

export interface TextLayer {
  id: string;
  type: "text";
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  align: "right" | "center" | "left";
  width: number;
}

export interface InvitationProject {
  id: string;
  name: string;
  width: number;
  height: number;
  background: string;
  layers: TextLayer[];
  updatedAt: number;
}
