import Link from "next/link";
import { Icon } from "@/components/icons";

export default function ProjectsPage() {
  return (
    <main className="route-shell">
      <div className="ambient-glow ambient-glow--right" aria-hidden="true" />
      <div className="page-width route-page">
        <header className="route-heading">
          <p className="section-overline">YOUR WORKSPACE</p>
          <h1>Projects</h1>
          <p>Keep your object analyses together and return to their results when they are ready.</p>
        </header>
        <section className="route-empty-state" aria-labelledby="projects-empty-title">
          <span className="analysis-empty-icon"><Icon name="cube" /></span>
          <div>
            <h2 id="projects-empty-title">No projects saved yet</h2>
            <p>Saved projects will appear here after the analysis API and database are connected.</p>
            <Link className="button button--primary" href="/#home"><Icon name="plus" /> Go to Home</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
