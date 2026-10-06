"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { ProductArtwork } from "@/components/product-artwork";
import { siteConfig } from "@/config/site";
import { featureCards, workflowSteps } from "@/data/dashboard";

function formatLimit(bytes: number) {
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

export default function DashboardPage() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState("");
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(null);

  const choosePhotos = () => fileInput.current?.click();

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    if (files.length === 0) return;

    if (files.length > siteConfig.upload.maxPhotos) {
      setNotice(`Choose up to ${siteConfig.upload.maxPhotos} photos for one analysis.`);
      event.currentTarget.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !siteConfig.upload.acceptedImageTypes.includes(
          file.type as (typeof siteConfig.upload.acceptedImageTypes)[number],
        ),
    );
    if (invalidFile) {
      setNotice("Use JPG, PNG or WebP images. The selected file type is not supported.");
      event.currentTarget.value = "";
      return;
    }

    const oversizedFile = files.find((file) => file.size > siteConfig.upload.maxFileSizeBytes);
    if (oversizedFile) {
      setNotice(`Each photo must be ${formatLimit(siteConfig.upload.maxFileSizeBytes)} or smaller.`);
      event.currentTarget.value = "";
      return;
    }

    const countLabel = files.length === 1 ? "photo" : "photos";
    setNotice(`${files.length} ${countLabel} selected. This page validates files only; analysis will start after the upload API is connected.`);
    event.currentTarget.value = "";
  };

  const activeFeature = featureCards.find((feature) => feature.id === activeFeatureId);

  return (
    <main className="dashboard-shell" id="home">
      <div className="ambient-glow ambient-glow--left" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--right" aria-hidden="true" />

      <div className="page-width page-content">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><Icon name="sparkle" /> From photos to understanding</div>
            <h1 id="hero-title">
              Reverse Engineer<br />
              Any Physical Object <span>with AI</span>
            </h1>
            <p className="hero-description">
              Upload a few views of an object. Explore its components, relationships and structure in one AI-assisted report.
            </p>
            <div className="hero-actions">
              <button className="button button--primary" type="button" onClick={choosePhotos}>
                <Icon name="plus" /> New Analysis
              </button>
              <Link className="button button--secondary" href="/projects">
                View Projects <Icon name="arrow" />
              </Link>
            </div>
            <p className="hero-note"><span className="status-dot" /> Start with a few clear photos</p>
          </div>

          <div className="hero-art" aria-label="Illustrated motor shown from several angles">
            <div className="orbit orbit--outer" aria-hidden="true" />
            <div className="orbit orbit--inner" aria-hidden="true" />
            <div className="hero-art-glow" aria-hidden="true" />
            <div className="hero-object-card hero-object-card--top"><ProductArtwork kind="motor" /></div>
            <div className="hero-object-card hero-object-card--left"><ProductArtwork kind="motor" /></div>
            <div className="hero-object-card hero-object-card--right"><ProductArtwork kind="assembly" /></div>
            <div className="hero-object-card hero-object-card--bottom"><ProductArtwork kind="motor" /></div>
            <div className="hero-object-main"><ProductArtwork kind="motor" /></div>
            <div className="scan-label"><span className="scan-label-dot" /> 4 views <span className="scan-label-divider" /> 1 system</div>
          </div>

          <aside className="workflow-card" aria-label="How ReverseX works">
            <div className="workflow-heading">
              <span className="workflow-kicker">YOUR WORKFLOW</span>
              <span className="workflow-time">~ 3 min</span>
            </div>
            <ol className="workflow-list">
              {workflowSteps.map((step, index) => (
                <li className={`workflow-step${index === 0 ? " workflow-step--active" : ""}`} key={step.number}>
                  <span className="step-number">{index === 0 ? <Icon name="upload" /> : step.number}</span>
                  <span className="step-copy"><strong>{step.title}</strong><small>{step.description}</small></span>
                  {index === 0 && <span className="step-pulse" aria-hidden="true" />}
                </li>
              ))}
            </ol>
          </aside>
        </section>

        <section className="content-section" id="projects" aria-labelledby="recent-heading">
          <div className="section-heading">
            <div>
              <p className="section-overline">YOUR SAVED WORK</p>
              <h2 id="recent-heading">Recent Analyses</h2>
            </div>
          </div>
          <div className="analysis-empty" role="status">
            <span className="analysis-empty-icon"><Icon name="cube" /></span>
            <div>
              <strong>No saved analyses yet</strong>
              <p>Your real projects will appear here when the analyses API and database are connected.</p>
            </div>
            <button className="button button--secondary" type="button" onClick={choosePhotos}>
              <Icon name="plus" /> Start an Analysis
            </button>
          </div>
        </section>

        <section className="content-section feature-section" id="features" aria-labelledby="features-heading">
          <div className="section-heading section-heading--features">
            <div>
              <p className="section-overline">BUILT FOR EXPLORATION</p>
              <h2 id="features-heading">Explore Features</h2>
            </div>
            <span className="feature-section-note"><Icon name="sparkle" /> One clear view of every object</span>
          </div>
          <div className="feature-grid">
            {featureCards.map((feature) => (
              <button
                className={`feature-card${activeFeatureId === feature.id ? " feature-card--selected" : ""}`}
                type="button"
                key={feature.id}
                aria-expanded={activeFeatureId === feature.id}
                aria-controls="feature-detail"
                onClick={() => setActiveFeatureId(activeFeatureId === feature.id ? null : feature.id)}
              >
                <span className={`feature-icon feature-icon--${feature.tone}`}><Icon name={feature.icon as IconName} /></span>
                <span className="feature-copy"><strong>{feature.title}</strong><small>{feature.description}</small></span>
                <Icon name="arrow" className="feature-arrow" />
              </button>
            ))}
          </div>
          {activeFeature && (
            <div className="feature-detail-panel" id="feature-detail" role="region" aria-live="polite" aria-labelledby="feature-detail-title">
              <span className={`feature-icon feature-icon--${activeFeature.tone}`}>
                <Icon name={activeFeature.icon as IconName} />
              </span>
              <div className="feature-detail-copy">
                <span className="feature-detail-status">
                  {activeFeature.id === "upload" ? "AVAILABLE NOW" : "NEEDS REAL ANALYSIS DATA"}
                </span>
                <h3 id="feature-detail-title">{activeFeature.title}</h3>
                <p>{activeFeature.details}</p>
                {activeFeature.id === "upload" && (
                  <button className="button button--primary feature-detail-action" type="button" onClick={choosePhotos}>
                    <Icon name="upload" /> Choose Photos
                  </button>
                )}
              </div>
              <button
                className="feature-detail-close"
                type="button"
                aria-label="Close feature details"
                onClick={() => setActiveFeatureId(null)}
              >
                <Icon name="close" />
              </button>
            </div>
          )}
        </section>
      </div>

      <input
        ref={fileInput}
        className="visually-hidden"
        type="file"
        accept={siteConfig.upload.acceptedImageTypes.join(",")}
        multiple
        onChange={handleFiles}
        aria-label="Choose photos to analyze"
      />
      {notice && (
        <div className="notice" role="status" aria-live="polite">
          <span className="notice-mark"><Icon name="check" /></span>
          <p>{notice}</p>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message"><Icon name="close" /></button>
        </div>
      )}
    </main>
  );
}
