import type { InvitationProject } from "../types/studio";

const STORAGE_KEY = "roshan-studio-projects-v1";

export function loadProjects(): InvitationProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as InvitationProject[]) : [];
  } catch {
    return [];
  }
}

export function saveProject(project: InvitationProject): void {
  const projects = loadProjects();
  const next = projects.filter((item) => item.id !== project.id);
  next.unshift({ ...project, updatedAt: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function loadProject(id: string): InvitationProject | undefined {
  return loadProjects().find((project) => project.id === id);
}
