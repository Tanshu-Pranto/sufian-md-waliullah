import type { Project } from "@/data/content";
import ChatVignette from "./vignettes/ChatVignette";
import KanbanVignette from "./vignettes/KanbanVignette";
import ShopVignette from "./vignettes/ShopVignette";

const VIGNETTES = { shop: ShopVignette, kanban: KanbanVignette, chat: ChatVignette };

// Each sketch was drawn for a particular panel color.
const TONES: Record<Project["vignette"], string> = { shop: "bg-ink-2", kanban: "bg-paper-2", chat: "bg-paper-2" };
export const vignetteTone = (kind: Project["vignette"]) => TONES[kind];

export default function Vignette({ kind }: { kind: Project["vignette"] }) {
  const Component = VIGNETTES[kind];
  return <Component />;
}
