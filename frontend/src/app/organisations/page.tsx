import { Icon } from "@/components/icons";

export default function OrganisationsPage() {
  return (
    <main className="route-shell">
      <div className="ambient-glow ambient-glow--left" aria-hidden="true" />
      <div className="page-width route-page">
        <header className="route-heading">
          <p className="section-overline">TEAM WORKSPACES</p>
          <h1>Organisations</h1>
          <p>Shared workspaces for teams reviewing objects and their analysis results.</p>
        </header>
        <section className="route-empty-state" aria-labelledby="organisation-empty-title">
          <span className="analysis-empty-icon"><Icon name="connections" /></span>
          <div>
            <h2 id="organisation-empty-title">No organisation connected</h2>
            <p>Organisation membership and shared project access need authentication and database support. The profile menu currently changes only the local display profile.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
