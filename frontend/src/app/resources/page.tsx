import { Icon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { workflowSteps } from "@/data/dashboard";

export default function ResourcesPage() {
  return (
    <main className="route-shell">
      <div className="page-width route-page">
        <header className="route-heading">
          <p className="section-overline">GUIDES &amp; REFERENCES</p>
          <h1>Resources</h1>
          <p>Practical guidance for preparing photos and understanding the planned analysis workflow.</p>
        </header>

        <section className="resource-grid" aria-label="ReverseX resources">
          <article className="resource-card" id="documentation">
            <span className="feature-icon feature-icon--violet"><Icon name="upload" /></span>
            <p className="section-overline">PHOTO PREPARATION</p>
            <h2>Image upload guide</h2>
            <p>Use up to {siteConfig.upload.maxPhotos} JPG, PNG or WebP photos, each no larger than {Math.round(siteConfig.upload.maxFileSizeBytes / 1024 / 1024)} MB. Different angles and clear lighting help capture the object.</p>
          </article>
          <article className="resource-card" id="research">
            <span className="feature-icon feature-icon--teal"><Icon name="object" /></span>
            <p className="section-overline">WORKFLOW</p>
            <h2>Analysis stages</h2>
            <ol className="resource-step-list">
              {workflowSteps.map((step) => <li key={step.number}><strong>{step.title}</strong><small>{step.description}</small></li>)}
            </ol>
          </article>
          <article className="resource-card" id="api">
            <span className="feature-icon feature-icon--rose"><Icon name="connections" /></span>
            <p className="section-overline">DEVELOPER STATUS</p>
            <h2>API reference</h2>
            <p>The frontend API base URL is configurable. Upload, saved-project, and analysis endpoints still need to be connected to the backend contract.</p>
            <span className="resource-status"><span /> API integration pending</span>
          </article>
          <article className="resource-card" id="tutorials">
            <span className="feature-icon feature-icon--amber"><Icon name="cube" /></span>
            <p className="section-overline">GETTING STARTED</p>
            <h2>First steps</h2>
            <p>Choose a set of clear photos from several sides. The current page checks type, count, and file size locally; it does not upload them yet.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
