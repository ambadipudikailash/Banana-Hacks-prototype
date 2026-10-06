export type ProductKind = "motor" | "drone" | "camera" | "assembly";
export type DashboardIcon = "upload" | "object" | "connections" | "cube";

export const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Resources", href: "/resources" },
  { label: "Organisations", href: "/organisations" },
  { label: "About", href: "/about" },
] as const;

export const workflowSteps = [
  { number: "01", title: "Upload Photos", description: "Add clear images from different angles", icon: "upload" },
  { number: "02", title: "AI Analysis", description: "Identify the object, parts and relationships", icon: "object" },
  { number: "03", title: "3D Reconstruction", description: "Generate an interactive 3D model", icon: "cube" },
  { number: "04", title: "Interactive Report", description: "Explore and download your results", icon: "connections" },
] satisfies ReadonlyArray<{
  number: string;
  title: string;
  description: string;
  icon: DashboardIcon;
}>;

export const featureCards = [
  {
    id: "upload",
    icon: "upload",
    title: "Upload & Validate",
    description: "Check image quality before you start an analysis.",
    details: "Choose JPG, PNG or WebP photos. The browser checks file type, count and size before upload. Files are not sent to a server yet.",
    tone: "violet",
  },
  {
    id: "object",
    icon: "object",
    title: "Object & Component Analysis",
    description: "Explore detected parts, materials and confidence.",
    details: "Component results will appear after the analysis API is connected and returns real project data. There are no saved analysis results in this workspace yet.",
    tone: "teal",
  },
  {
    id: "relationships",
    icon: "connections",
    title: "Relationship Mapping",
    description: "Understand how components connect and interact.",
    details: "The relationship view needs component connection data from a completed analysis. No relationship data is connected yet.",
    tone: "rose",
  },
  {
    id: "model",
    icon: "cube",
    title: "Interactive 3D Model",
    description: "Rotate, inspect and explore a reconstructed object.",
    details: "The 3D viewer needs a model file or model data from a saved analysis. No project model is available in this workspace yet.",
    tone: "amber",
  },
] satisfies ReadonlyArray<{
  id: string;
  icon: DashboardIcon;
  title: string;
  description: string;
  details: string;
  tone: "violet" | "teal" | "rose" | "amber";
}>;

export const footerGroups = [
  {
    id: "explore",
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects" },
      { label: "Resources", href: "/resources" },
      { label: "About", href: "/about" },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    links: [
      { label: "Documentation", href: "/resources#documentation" },
      { label: "Research Papers", href: "/resources#research" },
      { label: "API Reference", href: "/resources#api" },
      { label: "Tutorials", href: "/resources#tutorials" },
    ],
  },
] as const;
