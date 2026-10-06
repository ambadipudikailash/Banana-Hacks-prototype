import { Icon } from "@/components/icons";
import { siteConfig } from "@/config/site";

const projectStages = [
  { number: "01", title: "Visual input", description: "Collect clear photos of an object from useful angles." },
  { number: "02", title: "System representation", description: "Describe components, relationships, evidence, and uncertainty." },
  { number: "03", title: "Interactive exploration", description: "Inspect real results through project, graph, and model views." },
];

export default function AboutPage() {
  return (
    <main className="route-shell">
      <div className="page-width route-page">
        <header className="route-heading">
          <p className="section-overline">ABOUT THE PROJECT</p>
          <h1>{siteConfig.name}</h1>
          <p>{siteConfig.description}</p>
        </header>
        <section className="about-intro">
          <div className="about-mark"><Icon name="logo" /></div>
          <div>
            <p className="section-overline">THE IDEA</p>
            <h2>Turn visual inputs into an understandable system.</h2>
            <p>ReverseX is being built to help people inspect objects by understanding their parts and how those parts connect. The current deliverable is the frontend foundation; analysis, persistence, and 3D results will follow their data integrations.</p>
          </div>
        </section>
        <section className="about-stage-grid" aria-label="Project workflow">
          {projectStages.map((stage) => (
            <article className="about-stage" key={stage.number}>
              <span>{stage.number}</span>
              <h2>{stage.title}</h2>
              <p>{stage.description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
