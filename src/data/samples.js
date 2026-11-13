export const SAMPLE_DATA = [
  {
    id: 'swe-fullstack',
    title: 'Senior Full Stack Engineer (Fintech)',
    targetCompany: 'Stripe',
    targetRole: 'Senior Full Stack Software Engineer',
    resume: `ALEX RIVERA
San Francisco, CA • alex.rivera@email.com • (555) 342-8901 • github.com/alexrivera • linkedin.com/in/alexrivera

SUMMARY
Versatile Software Engineer with 5+ years of experience building scalable web applications, distributed backend services, and modern frontend interfaces. Experienced in React, TypeScript, Node.js, PostgreSQL, and cloud deployments on AWS. Passionate about developer tooling, API design, and system reliability.

EXPERIENCE
FinFlow Systems — Senior Software Engineer
May 2022 – Present | San Francisco, CA
• Spearheaded the development of a multifaceted payment reconciliation platform utilizing React, Node.js, and PostgreSQL.
• Orchestrated seamless cloud migration of legacy microservices into Docker containers on AWS ECS, fostering a collaborative DevOps culture.
• Delved into performance bottlenecks across SQL queries to optimize database response times by 35%.
• Implemented robust automated testing suites with Jest and Cypress, achieving 88% test coverage across core billing modules.
• Mentored junior engineers and conducted code reviews to maintain high engineering standards.

CloudScale Tech — Software Engineer
June 2019 – April 2022 | Austin, TX
• Designed and shipped customer-facing dashboards using React, Redux, and Tailwind CSS used by 45,000 active monthly businesses.
• Built RESTful APIs and GraphQL endpoints in Node.js/Express with Redis caching for real-time analytics.
• Collaborated with product managers to define technical roadmaps and prioritize quarterly feature sprints.
• Integrated Stripe Billing API and webhook listeners to automate invoice generation and recurring subscriptions.

EDUCATION & SKILLS
B.S. in Computer Science — University of Texas at Austin (2019)
Languages: JavaScript, TypeScript, Python, SQL, HTML/CSS
Frameworks & Tools: React, Next.js, Node.js, Express, PostgreSQL, Redis, AWS (ECS, S3, RDS), Docker, Git, CI/CD`,
    jobDescription: `Job Title: Senior Full Stack Engineer - Payment Infrastructure
Company: Stripe
Location: Remote / San Francisco, CA

About the Role:
We are looking for a Senior Full Stack Software Engineer to build high-throughput, fault-tolerant financial infrastructure and intuitive merchant experiences. You will design, develop, and maintain mission-critical APIs and web interfaces that process millions of transactions daily.

Key Responsibilities:
- Architect and scale distributed backend microservices handling high concurrency and idempotent financial operations.
- Build responsive, accessible, and high-performance frontend applications using React, TypeScript, and modern state management.
- Design resilient database schemas and optimize query performance in PostgreSQL and distributed cache layers (Redis).
- Implement robust telemetry, observability, and distributed tracing using Datadog, OpenTelemetry, and Prometheus.
- Collaborate with security, compliance, and product teams to meet PCI-DSS requirements and ensure 99.999% uptime.
- Champion engineering best practices, automated CI/CD pipelines, and rigorous unit/integration testing.

Qualifications:
- 5+ years of production software engineering experience in modern JavaScript/TypeScript, React, and Node.js or Golang.
- Proven track record with distributed systems, API idempotency, rate limiting, and event-driven architecture (Kafka/SQS).
- Strong relational database experience (PostgreSQL schema design, indexing, transaction isolation levels).
- Experience with cloud architecture (AWS or GCP), containerization (Docker, Kubernetes), and CI/CD automation.
- Passion for crafting clean, human-readable code without over-engineering.`
  },
  {
    id: 'product-manager',
    title: 'Senior Product Manager (SaaS)',
    targetCompany: 'Notion',
    targetRole: 'Senior Product Manager - Enterprise Workspace',
    resume: `JORDAN CHEN
New York, NY • jordan.chen@email.com • (555) 789-2341 • linkedin.com/in/jordanchen

SUMMARY
Results-driven Product Manager with 6 years of experience leading cross-functional teams to build SaaS collaboration software. Proven track record in product strategy, user discovery, PLG funnels, and data-driven prioritization.

EXPERIENCE
WorkspaceCo — Lead Product Manager
Jan 2022 – Present | New York, NY
• Spearheaded enterprise workspace features that drove $4.2M in net new ARR across Fortune 500 accounts.
• Orchestrated user discovery sprints with 60+ enterprise IT administrators to define security and access control specs.
• Fostered cross-functional collaboration across 14 engineers, 2 designers, and GTM teams to launch SSO & SCIM integrations.
• Monitored engagement metrics in Mixpanel, improving 30-day team activation rates by 22%.

TeamPulse — Product Manager
Aug 2018 – Dec 2021 | Boston, MA
• Owned core document collaboration workflows, launching real-time multiplayer editing and inline comments.
• Conducted A/B tests on onboarding flow, decreasing time-to-first-collaboration from 8 minutes to 2.4 minutes.
• Authored comprehensive PRDs, user stories, and acceptance criteria in Jira and Confluence.

EDUCATION & SKILLS
B.A. in Economics — Columbia University
Skills: Product Strategy, Enterprise SaaS, PLG, User Research, SQL, Mixpanel, A/B Testing, Roadmapping, Agile/Scrum`,
    jobDescription: `Job Title: Senior Product Manager, Enterprise Collaboration
Company: Notion
Location: New York / Remote

We are seeking a Senior Product Manager to lead our Enterprise Workspace team. You will be responsible for defining the product vision, roadmap, and execution for enterprise-grade governance, team workspaces, permissioning, and collaboration at scale.

Key Responsibilities:
- Own the multi-year product roadmap for enterprise workspace administration, role-based access control (RBAC), and compliance.
- Partner with engineering, design, and enterprise sales leaders to translate customer pain points into elegant, high-impact features.
- Define quantitative success metrics (North Star, retention, adoption, ARR expansion) and drive iterative releases based on data.
- Conduct continuous user research with C-level executives, IT admins, and knowledge workers.
- Drive product-led growth (PLG) expansion inside enterprise accounts while maintaining consumer-grade design simplicity.

Requirements:
- 5+ years of product management experience in B2B SaaS, enterprise collaboration, or productivity tools.
- Demonstrated success scaling enterprise features (SSO, RBAC, audit logs, compliance frameworks like SOC 2).
- Strong analytical foundation with SQL, cohort analysis, and experimentation frameworks.
- Exceptional written and verbal communication; ability to write clear, concise PRDs without corporate jargon.`
  }
];

export const AI_BUZZWORDS = [
  { word: 'spearheaded', replacement: 'led / built / directed', reason: 'Overused AI resume cliche; sounds unnatural.' },
  { word: 'orchestrated', replacement: 'organized / coordinated / managed', reason: 'Typical ChatGPT resume word.' },
  { word: 'delved', replacement: 'analyzed / investigated / researched', reason: 'Dead giveaway AI vocabulary marker.' },
  { word: 'tapestry', replacement: 'system / range / ecosystem', reason: 'Artificial poetic language inappropriate for resumes.' },
  { word: 'fostered', replacement: 'built / developed / established', reason: 'Frequent AI filler verb.' },
  { word: 'leveraged', replacement: 'used / applied / deployed', reason: 'Corporate AI jargon; use direct action verbs.' },
  { word: 'beacon', replacement: 'standard / benchmark', reason: 'Poetic AI phrase.' },
  { word: 'pivotal', replacement: 'key / critical / essential', reason: 'High AI frequency modifier.' },
  { word: 'multifaceted', replacement: 'comprehensive / multi-tier', reason: 'Robotic descriptor.' },
  { word: 'synergy', replacement: 'coordination / alignment', reason: 'Cliche corporate buzzword.' },
  { word: 'testament', replacement: 'demonstration / proof', reason: 'Common ChatGPT concluding phrase.' },
  { word: 'robust', replacement: 'scalable / reliable / fault-tolerant', reason: 'Overused vague AI adjective; replace with technical specifics.' },
  { word: 'harnessed', replacement: 'utilized / employed', reason: 'Classic generative AI cadence.' },
  { word: 'seamless', replacement: 'automated / frictionless', reason: 'Vague marketing buzzword flagged by screening algorithms.' },
  { word: 'navigated', replacement: 'managed / solved / resolved', reason: 'AI filler verb.' }
];
