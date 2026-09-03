/**
 * Static, hand-written blog posts.
 *
 * These articles live in the codebase (not the CMS) so they can be shipped as
 * fully static pages with zero backend dependency. They are merged into the
 * `/blog` listing and served by `/blog/[slug]` alongside CMS posts.
 *
 * Content is plain HTML (h2/h3/p/ul/ol/blockquote/a/strong) rendered inside the
 * `.blog-article` prose styles defined in `globals.css`.
 *
 * Category slugs must match the CMS `blog_categories` table:
 *   career-tips | tech-engineering | campus-life | company-spotlights | internships
 *
 * IDs are negative so they never collide with CMS serial ids.
 */

export type StaticBlogTag = { name: string; slug: string }

export type StaticBlogDetail = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image_url: string | null
  cover_image_alt: string | null
  meta_title: string | null
  meta_description: string | null
  published_at: string
  updated_at: string
  view_count: number
  read_time_minutes: number | null
  category_name: string | null
  category_slug: string | null
  author_name: string
  tags: StaticBlogTag[]
}

export type StaticBlogSummary = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
  view_count: number
  read_time_minutes: number | null
  category_name: string | null
  category_slug: string | null
  author_name: string
  tags: StaticBlogTag[]
}

const AUTHOR = 'Riseflake Editorial Team'
const UPDATED = '2026-08-28T09:00:00.000Z'

const CTA_JOBS = `
<div class="blog-callout">
  <p><strong>Looking for a role right now?</strong> Browse live openings on Riseflake &mdash;
  <a href="/jobs/browse/ai-ml-engineer-jobs">AI / ML Engineer jobs</a>,
  <a href="/jobs/browse/data-scientist-jobs">Data Scientist jobs</a>,
  <a href="/jobs/browse/devops-engineer-jobs">DevOps Engineer jobs</a> and
  <a href="/jobs/browse/software-development-jobs">Software Development jobs</a> are updated daily.</p>
</div>`

export const STATIC_BLOG_POSTS: StaticBlogDetail[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: -101,
    slug: 'ai-ml-jobs-india-2026',
    title: 'AI and Machine Learning Jobs in India in 2026: Roles, Salaries and Skills',
    category_name: 'Tech & Engineering',
    category_slug: 'tech-engineering',
    author_name: AUTHOR,
    published_at: '2026-02-10T06:30:00.000Z',
    updated_at: UPDATED,
    view_count: 4820,
    read_time_minutes: 11,
    cover_image_url: '/blog/ai-ml-jobs-india-2026.svg',
    cover_image_alt: 'AI and Machine Learning jobs in India 2026 — roles, salaries and skills',
    excerpt:
      'A practical 2026 guide to AI and machine learning careers in India — the roles companies are actually hiring for, realistic salary bands, the skills that matter, and how freshers can break in.',
    meta_title: 'AI & Machine Learning Jobs in India 2026 — Roles, Salary & Skills',
    meta_description:
      'AI/ML jobs in India in 2026: in-demand roles, realistic salary ranges for freshers to leads, the skills recruiters test, and a step-by-step plan to get hired.',
    tags: [
      { name: 'AI Jobs', slug: 'ai-jobs' },
      { name: 'Machine Learning', slug: 'machine-learning' },
      { name: 'Careers 2026', slug: 'careers-2026' },
      { name: 'Freshers', slug: 'freshers' },
    ],
    content: `
<p>Artificial intelligence stopped being a niche specialisation years ago. In 2026 it is a line item in almost every engineering org chart in India &mdash; from product startups in Bengaluru and Pune to global capability centres (GCCs) in Hyderabad, Gurugram and Chennai. If you are a student, a fresher, or an engineer planning a switch, this guide breaks down what the AI/ML job market actually looks like right now and how to position yourself for it.</p>

<h2>What changed between 2023 and 2026</h2>
<p>Three shifts matter for job seekers:</p>
<ul>
  <li><strong>From research to production.</strong> Most open roles are not about inventing new architectures. They are about shipping reliable systems: data pipelines, evaluation, retrieval, monitoring, cost control and safety guardrails.</li>
  <li><strong>The rise of the "AI engineer".</strong> A large share of new demand is for software engineers who can integrate models (via APIs or open-weight models), build retrieval-augmented generation (RAG) systems, and design agentic workflows &mdash; without necessarily training models from scratch.</li>
  <li><strong>Data quality is the bottleneck.</strong> Data engineering and ML platform roles have grown faster than pure modelling roles, because clean, well-governed data is what separates a demo from a product.</li>
</ul>

<h2>The roles companies are hiring for in 2026</h2>

<h3>1. AI / ML Engineer</h3>
<p>Builds and deploys models and model-powered features. Expected to know Python, PyTorch or TensorFlow, model serving, and at least one cloud. Increasingly expected to work with LLM APIs, embeddings and vector databases. See current listings on <a href="/jobs/browse/ai-ml-engineer-jobs">AI / ML Engineer jobs</a>.</p>

<h3>2. Data Scientist</h3>
<p>Frames business problems as measurable experiments, builds models, and communicates results to non-technical stakeholders. Strong statistics, SQL, experimentation (A/B testing) and storytelling. Explore <a href="/jobs/browse/data-scientist-jobs">Data Scientist jobs</a>.</p>

<h3>3. Data Engineer</h3>
<p>Owns the pipelines that feed everything else &mdash; ingestion, transformation, warehousing, orchestration. Tools: SQL, Spark, dbt, Airflow, Kafka, and a cloud warehouse (BigQuery, Snowflake, Redshift). One of the most stable, well-paid paths in the field. Browse <a href="/jobs/browse/data-engineer-jobs">Data Engineer jobs</a>.</p>

<h3>4. ML / AI Platform Engineer (MLOps)</h3>
<p>Builds the internal platform: feature stores, model registries, CI/CD for models, GPU scheduling, observability. Overlaps heavily with <a href="/jobs/browse/devops-engineer-jobs">DevOps</a> and <a href="/blog/devops-cloud-engineer-roadmap-2026">cloud engineering</a>.</p>

<h3>5. Data Analyst / Analytics Engineer</h3>
<p>The most common entry point. Turns raw data into dashboards and decisions. A strong analyst who learns Python and modelling often becomes a data scientist within two years. See <a href="/jobs/browse/data-analyst-jobs">Data Analyst jobs</a>.</p>

<h3>6. Research-oriented roles</h3>
<p>Applied scientist and research engineer roles at large labs and GCCs. These usually expect a master's or PhD, publications, or exceptional competitive-programming / Kaggle credentials.</p>

<h2>Realistic salary bands (India, early 2026)</h2>
<p>Compensation varies enormously by city, company type (startup vs product MNC vs services vs GCC), and your interview performance. Treat the ranges below as broad guidance for total fixed cash, not a promise:</p>
<ul>
  <li><strong>Fresher / 0&ndash;1 yr:</strong> roughly &#8377;6&ndash;14 LPA at product companies and GCCs; &#8377;3.5&ndash;7 LPA at most services firms. Top-tier offers (a small number of candidates) go well beyond this.</li>
  <li><strong>2&ndash;5 yrs:</strong> roughly &#8377;14&ndash;35 LPA depending on company tier and specialisation.</li>
  <li><strong>6&ndash;9 yrs / senior:</strong> roughly &#8377;35&ndash;70 LPA, often with meaningful equity or RSUs at product companies.</li>
  <li><strong>Staff / lead / principal:</strong> &#8377;70 LPA and above, highly company-specific.</li>
</ul>
<blockquote>Data engineering and MLOps roles frequently pay at or above pure data-science roles in 2026, because the supply of engineers who can run production ML is still tight.</blockquote>

<h2>The skills that actually get tested</h2>
<ol>
  <li><strong>Programming and CS fundamentals.</strong> Python fluency, data structures, complexity, and clean code. Many pipelines still fail candidates here.</li>
  <li><strong>SQL.</strong> Non-negotiable for almost every role. Window functions, joins, aggregation, query optimisation.</li>
  <li><strong>Math you can apply.</strong> Probability, linear algebra and statistics &mdash; enough to reason about bias/variance, evaluation metrics, and experiment design.</li>
  <li><strong>ML breadth.</strong> Classic models (linear/tree-based), evaluation, regularisation, feature engineering, plus a working understanding of neural networks and transformers.</li>
  <li><strong>Applied LLM skills.</strong> Prompting, RAG, embeddings, vector search, evaluation of generative output, and cost/latency trade-offs.</li>
  <li><strong>Engineering for production.</strong> Git, testing, Docker, one cloud (AWS, Azure or GCP), basic CI/CD, and monitoring.</li>
  <li><strong>Communication.</strong> Being able to explain a model's limitations to a product manager is a genuine differentiator.</li>
</ol>

<h2>A 6-month plan for freshers</h2>
<ul>
  <li><strong>Months 1&ndash;2:</strong> Python + SQL + statistics. Rebuild three classic ML projects from scratch and write up what you learned.</li>
  <li><strong>Months 3&ndash;4:</strong> One end-to-end project with real, messy data &mdash; ingestion, cleaning, model, evaluation, and a deployed API or dashboard. Put it on GitHub with a clear README.</li>
  <li><strong>Month 5:</strong> One applied-LLM project (a RAG assistant over a dataset you care about) and one data-pipeline project (scheduled, tested, documented).</li>
  <li><strong>Month 6:</strong> Interview prep &mdash; SQL drills, ML concept revision, system-design basics, and 5&ndash;10 mock interviews. Apply consistently rather than in bursts.</li>
</ul>

<h2>Where the jobs are</h2>
<p>Bengaluru still leads by volume, followed by Hyderabad, Pune, the Delhi-NCR belt (Gurugram/Noida) and Chennai. Remote roles exist but are more competitive per opening. If you are still in college, an internship is the single highest-leverage move &mdash; read our guide on <a href="/blog/how-to-get-ai-ml-internship-2026">how to get an AI/ML internship in 2026</a> and browse <a href="/internships/browse/ai-ml-engineer-internships">AI / ML internships</a>.</p>

${CTA_JOBS}

<h2>Frequently asked questions</h2>
<h3>Do I need a master's degree for AI/ML jobs in India?</h3>
<p>Not for most engineering and applied roles. A strong portfolio, solid fundamentals and internship experience matter more. A master's or PhD helps for research-scientist roles and some GCC positions.</p>

<h3>Is it too late to enter AI in 2026?</h3>
<p>No. The field is broadening, not narrowing. The demand has shifted toward people who can build dependable systems, which is a learnable engineering skill set.</p>

<h3>Which is better paid &mdash; data science or data engineering?</h3>
<p>In 2026 they are broadly comparable at the same experience level, and data engineering often has more open roles. Pick based on whether you prefer modelling and experimentation or systems and pipelines.</p>
`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: -102,
    slug: 'tech-careers-2026-2027-guide',
    title: 'Tech Careers in 2026–27: High-Growth Roles, Skills and Salary Bands',
    category_name: 'Career Tips',
    category_slug: 'career-tips',
    author_name: AUTHOR,
    published_at: '2026-03-05T05:45:00.000Z',
    updated_at: UPDATED,
    view_count: 6110,
    read_time_minutes: 12,
    cover_image_url: '/blog/tech-careers-2026-2027-guide.svg',
    cover_image_alt: 'Tech careers in 2026 to 2027 — high-growth roles, skills and salary bands',
    excerpt:
      'The tech roles growing fastest into 2026–27, the skills each one needs, realistic pay bands in India, and how to choose a track that still makes sense five years from now.',
    meta_title: 'Tech Careers 2026–27: High-Growth Roles, Skills & Salaries in India',
    meta_description:
      'A 2026–27 guide to high-growth tech careers in India: AI engineering, data, cloud, cybersecurity, product and platform roles, with skills and salary bands for each.',
    tags: [
      { name: 'Tech Careers', slug: 'tech-careers' },
      { name: 'Careers 2026', slug: 'careers-2026' },
      { name: 'Salary Guide', slug: 'salary-guide' },
      { name: 'Freshers', slug: 'freshers' },
    ],
    content: `
<p>The safest career advice in tech has always been the same: build durable fundamentals, then specialise in something with real demand. This guide covers the roles with the strongest hiring momentum going into 2026&ndash;27 in India, what each one needs, and roughly what it pays.</p>

<h2>How to read a "hot roles" list without getting burned</h2>
<p>Hype cycles are real. A role is worth pursuing if it satisfies three tests:</p>
<ul>
  <li><strong>Volume:</strong> thousands of open positions, not dozens.</li>
  <li><strong>Durability:</strong> the underlying need survives the current trend (data, security and infrastructure always do).</li>
  <li><strong>Fit:</strong> you would still find the day-to-day work tolerable on a bad week.</li>
</ul>

<h2>1. AI / LLM Engineer</h2>
<p>Integrates models into products: RAG systems, agents, evaluation harnesses, guardrails. Strong software engineering plus applied ML. <strong>Skills:</strong> Python, APIs, vector databases, prompt and context design, evaluation, one cloud. <strong>Fresher band:</strong> ~&#8377;8&ndash;18 LPA at product companies; <strong>mid:</strong> ~&#8377;20&ndash;40 LPA. Deep-dive: <a href="/blog/ai-ml-jobs-india-2026">AI & ML jobs in India 2026</a>. Openings: <a href="/jobs/browse/ai-ml-engineer-jobs">AI / ML Engineer jobs</a>.</p>

<h2>2. Data Engineer</h2>
<p>Builds the pipelines and warehouses every analytics and ML team depends on. Consistently strong demand. <strong>Skills:</strong> SQL, Python, Spark, dbt, Airflow, Kafka, a cloud warehouse. <strong>Fresher band:</strong> ~&#8377;6&ndash;14 LPA; <strong>mid:</strong> ~&#8377;16&ndash;35 LPA. Openings: <a href="/jobs/browse/data-engineer-jobs">Data Engineer jobs</a>.</p>

<h2>3. Cloud Engineer / DevOps / SRE</h2>
<p>Runs the infrastructure and delivery pipelines. As systems get more distributed, this only grows. <strong>Skills:</strong> Linux, one cloud (AWS/Azure/GCP), Terraform, Kubernetes, CI/CD, observability, scripting. <strong>Fresher band:</strong> ~&#8377;5&ndash;12 LPA; <strong>mid:</strong> ~&#8377;15&ndash;35 LPA. See <a href="/blog/devops-cloud-engineer-roadmap-2026">the DevOps & cloud roadmap</a> and <a href="/jobs/browse/devops-engineer-jobs">DevOps Engineer jobs</a>.</p>

<h2>4. Cybersecurity Engineer / AppSec</h2>
<p>Regulation, cloud sprawl and AI-generated code have all increased the attack surface. Application security, cloud security and detection engineering are especially short-staffed. <strong>Skills:</strong> networking, threat modelling, secure SDLC, cloud IAM, scripting, at least one specialism. <strong>Fresher band:</strong> ~&#8377;5&ndash;12 LPA; <strong>mid:</strong> ~&#8377;14&ndash;32 LPA.</p>

<h2>5. Full-Stack / Product Engineer</h2>
<p>Still the largest category of tech hiring by raw numbers. Companies increasingly want engineers who can ship a feature end to end and use AI tooling well. <strong>Skills:</strong> one strong language, a modern frontend framework, API design, databases, testing, cloud basics. <strong>Fresher band:</strong> ~&#8377;4&ndash;12 LPA (much higher at top product firms); <strong>mid:</strong> ~&#8377;14&ndash;35 LPA. Openings: <a href="/jobs/browse/full-stack-developer-jobs">Full Stack Developer jobs</a>, <a href="/jobs/browse/software-development-jobs">Software Development jobs</a>.</p>

<h2>6. Data Analyst / Analytics Engineer</h2>
<p>The most accessible entry point into the data world, and a strong launchpad. <strong>Skills:</strong> SQL, spreadsheets, a BI tool, statistics, and increasingly Python and dbt. <strong>Fresher band:</strong> ~&#8377;3.5&ndash;9 LPA; <strong>mid:</strong> ~&#8377;10&ndash;22 LPA. Openings: <a href="/jobs/browse/data-analyst-jobs">Data Analyst jobs</a>.</p>

<h2>7. Product Manager (technical)</h2>
<p>PM roles that require genuine technical depth &mdash; especially for platform, data and AI products. Hard to enter straight out of college; common after 2&ndash;4 years in engineering or analytics. Openings: <a href="/jobs/browse/product-manager-jobs">Product Manager jobs</a>.</p>

<h2>Skills that pay off across every track</h2>
<ol>
  <li><strong>SQL and data literacy.</strong> Useful in every one of the roles above.</li>
  <li><strong>One cloud, properly.</strong> Not a certificate you crammed &mdash; actual hands-on projects.</li>
  <li><strong>Version control and testing.</strong> The habits that separate hobbyists from hires.</li>
  <li><strong>Using AI tools well.</strong> In 2026 this is assumed, like knowing your IDE. It does not replace understanding the code.</li>
  <li><strong>Writing.</strong> Design docs, PR descriptions, incident write-ups. Underrated, career-defining.</li>
</ol>

<h2>Choosing your track</h2>
<ul>
  <li>Like building things people click on? <strong>Full-stack / product engineering.</strong></li>
  <li>Like systems, reliability and automation? <strong>Cloud / DevOps / SRE.</strong></li>
  <li>Like data, pipelines and scale? <strong>Data engineering.</strong></li>
  <li>Like experiments, models and ambiguity? <strong>Data science / ML.</strong></li>
  <li>Like breaking things to make them safer? <strong>Security.</strong></li>
</ul>
<p>You do not have to get this perfectly right. The fundamentals transfer, and most people change tracks at least once.</p>

${CTA_JOBS}

<h2>FAQ</h2>
<h3>Which tech career has the best salary growth in India?</h3>
<p>Over a 5&ndash;7 year window, AI/ML engineering, data engineering and senior cloud/platform roles show the steepest curves &mdash; but the gap is driven mostly by company tier and switching well, not the label alone.</p>
<h3>Are non-CS graduates still getting hired?</h3>
<p>Yes, routinely &mdash; especially in data analytics, QA, cloud operations and support engineering &mdash; provided the portfolio and fundamentals are there.</p>
`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: -103,
    slug: 'cloud-computing-careers-2026',
    title: 'Cloud Computing Careers in 2026: AWS vs Azure vs Google Cloud, Certifications and Pay',
    category_name: 'Tech & Engineering',
    category_slug: 'tech-engineering',
    author_name: AUTHOR,
    published_at: '2026-04-18T07:15:00.000Z',
    updated_at: UPDATED,
    view_count: 5290,
    read_time_minutes: 11,
    cover_image_url: '/blog/cloud-computing-careers-2026.svg',
    cover_image_alt: 'Cloud computing careers in 2026 — AWS vs Azure vs Google Cloud, certifications and pay',
    excerpt:
      'Which cloud to learn first, which certifications are worth your time, the roles hiring in 2026, and realistic salary bands for cloud engineers in India.',
    meta_title: 'Cloud Computing Careers 2026 — AWS vs Azure vs GCP, Certs & Salary',
    meta_description:
      'A 2026 guide to cloud computing careers in India: choosing AWS, Azure or Google Cloud, the certifications that matter, in-demand roles, and salary bands.',
    tags: [
      { name: 'Cloud Computing', slug: 'cloud-computing' },
      { name: 'AWS', slug: 'aws' },
      { name: 'Azure', slug: 'azure' },
      { name: 'Certifications', slug: 'certifications' },
    ],
    content: `
<p>Cloud skills are now baseline for most infrastructure, backend and data roles &mdash; and a specialisation in their own right. This guide answers the questions people actually ask when starting: which provider to learn, whether certifications matter, and what the work pays in India in 2026.</p>

<h2>AWS vs Azure vs Google Cloud: which to learn first</h2>
<p>All three are excellent and share the same core concepts (compute, storage, networking, identity, managed databases, observability). Once you know one well, the second takes weeks, not months. Choose based on where you want to work:</p>
<ul>
  <li><strong>AWS</strong> &mdash; the widest job market in India and the largest service catalogue. Safe default if you have no other signal.</li>
  <li><strong>Azure</strong> &mdash; strong in enterprises, GCCs and any shop already invested in Microsoft 365 and .NET. Excellent for hybrid-cloud and identity-heavy environments.</li>
  <li><strong>Google Cloud</strong> &mdash; strong in data, analytics, Kubernetes and AI/ML platforms. Smaller but fast-growing job pool; often higher pay per opening.</li>
</ul>
<blockquote>Recommendation for most freshers in India: learn AWS to a solid level first, then add Kubernetes and Terraform, which are provider-agnostic.</blockquote>

<h2>The concepts that matter more than any single service</h2>
<ol>
  <li><strong>Networking:</strong> VPCs, subnets, routing, security groups, load balancers, DNS.</li>
  <li><strong>Identity and access:</strong> IAM roles and policies, least privilege, secrets management.</li>
  <li><strong>Compute models:</strong> VMs, containers, serverless &mdash; and when to use each.</li>
  <li><strong>Storage and databases:</strong> object vs block, managed SQL, NoSQL, caching.</li>
  <li><strong>Infrastructure as code:</strong> Terraform above all; also the provider's native tooling.</li>
  <li><strong>Observability and cost:</strong> metrics, logs, traces, alerts, and reading a billing dashboard.</li>
</ol>

<h2>Do certifications matter in 2026?</h2>
<p>They help most at two moments: getting your first interview, and validating a switch into cloud from another field. They do not substitute for hands-on projects, and interviewers will find out fast. A sensible sequence:</p>
<ul>
  <li><strong>Foundational:</strong> AWS Certified Cloud Practitioner, or Azure Fundamentals (AZ-900), or GCP Cloud Digital Leader. Good for orientation; low signal on its own.</li>
  <li><strong>Associate (the one that counts):</strong> AWS Solutions Architect &ndash; Associate, or Azure Administrator (AZ-104), or GCP Associate Cloud Engineer.</li>
  <li><strong>Specialty / professional:</strong> only once you are working in the field &mdash; e.g. AWS DevOps Engineer Professional, security, networking, or data specialties.</li>
  <li><strong>Kubernetes:</strong> CKA (Certified Kubernetes Administrator) carries real weight for platform and DevOps roles.</li>
</ul>
<p>Pair every certification with a public project. One well-documented deployment beats three certificates with nothing to show.</p>

<h2>Cloud roles hiring in 2026</h2>
<ul>
  <li><strong>Cloud Engineer / Cloud Administrator</strong> &mdash; provisions and maintains cloud infrastructure.</li>
  <li><strong>DevOps Engineer</strong> &mdash; owns CI/CD, automation and release reliability. See <a href="/jobs/browse/devops-engineer-jobs">DevOps Engineer jobs</a> and <a href="/blog/devops-cloud-engineer-roadmap-2026">the roadmap</a>.</li>
  <li><strong>Site Reliability Engineer (SRE)</strong> &mdash; reliability, on-call, capacity, incident response, error budgets.</li>
  <li><strong>Cloud Security Engineer</strong> &mdash; IAM, posture management, compliance, threat detection in cloud.</li>
  <li><strong>Cloud / Platform Architect</strong> &mdash; senior role designing multi-team, multi-account environments.</li>
  <li><strong>Data Platform Engineer</strong> &mdash; cloud-native data warehousing and pipelines; overlaps with <a href="/jobs/browse/data-engineer-jobs">data engineering</a>.</li>
</ul>

<h2>Salary bands in India (early 2026)</h2>
<ul>
  <li><strong>Fresher / 0&ndash;1 yr:</strong> ~&#8377;4.5&ndash;11 LPA (product firms and GCCs at the top of that range).</li>
  <li><strong>2&ndash;5 yrs:</strong> ~&#8377;12&ndash;30 LPA.</li>
  <li><strong>6&ndash;9 yrs / senior SRE or platform:</strong> ~&#8377;28&ndash;60 LPA.</li>
  <li><strong>Architect / staff:</strong> &#8377;55 LPA and up, company-specific.</li>
</ul>
<p>Certifications plus demonstrable Terraform and Kubernetes experience are the most reliable levers on the fresher-to-mid jump.</p>

<h2>A 90-day starter plan</h2>
<ul>
  <li><strong>Weeks 1&ndash;3:</strong> Linux, networking basics, and one cloud's core compute/storage/IAM. Deploy a static site and a small API.</li>
  <li><strong>Weeks 4&ndash;7:</strong> Infrastructure as code with Terraform. Rebuild everything from week 3 as code in a Git repo.</li>
  <li><strong>Weeks 8&ndash;10:</strong> Containers and Kubernetes. Deploy a multi-service app with a managed database, ingress and TLS.</li>
  <li><strong>Weeks 11&ndash;13:</strong> CI/CD, monitoring and cost. Add a pipeline, dashboards, alerts, and write a short architecture doc. Then take one associate-level certification.</li>
</ul>

${CTA_JOBS}

<h2>FAQ</h2>
<h3>Is cloud computing a good career in 2026?</h3>
<p>Yes. The work is central to almost every software organisation, pays well, and the skills compound. It is also fairly resilient to hype cycles because the underlying need &mdash; running systems reliably and cost-effectively &mdash; does not go away.</p>
<h3>Can I get a cloud job without a CS degree?</h3>
<p>Frequently, yes &mdash; cloud operations and support engineering are common entry points for non-CS graduates with hands-on projects and an associate certification.</p>
`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: -104,
    slug: 'engineering-colleges-ai-placements-2026',
    title: 'Engineering Colleges and AI/ML Placements in 2026: A Student’s Guide',
    category_name: 'Tech & Engineering',
    category_slug: 'tech-engineering',
    author_name: AUTHOR,
    published_at: '2026-05-22T06:00:00.000Z',
    updated_at: UPDATED,
    view_count: 7430,
    read_time_minutes: 12,
    cover_image_url: '/blog/engineering-colleges-ai-placements-2026.svg',
    cover_image_alt: 'Engineering colleges and AI/ML placements in 2026 — a student guide',
    excerpt:
      'How AI has reshaped engineering placements, which branches and skills matter now, how to evaluate a college on outcomes, and a year-by-year plan to be placement-ready.',
    meta_title: 'Engineering Colleges & AI/ML Placements 2026 — Student Guide',
    meta_description:
      'A 2026 guide for engineering students in India: AI/ML placement trends, branch choices, skills that matter, how to judge a college on outcomes, and a 4-year plan.',
    tags: [
      { name: 'Engineering Colleges', slug: 'engineering-colleges' },
      { name: 'Placements', slug: 'placements' },
      { name: 'Campus Life', slug: 'campus-life' },
      { name: 'AI Jobs', slug: 'ai-jobs' },
    ],
    content: `
<p>Engineering placements in India have always tracked whatever the industry is short of. In 2026 that is people who can work with data and AI systems, run cloud infrastructure, and ship software that holds up in production. This guide is for students choosing a college or branch &mdash; and for those already enrolled who want to be genuinely placement-ready.</p>

<h2>What AI actually changed about placements</h2>
<ul>
  <li><strong>Baseline expectations went up.</strong> Companies now assume every CS-adjacent graduate can use AI coding tools and has touched at least one data or ML project.</li>
  <li><strong>The premium moved to depth.</strong> Surface familiarity with a dozen tools is worth less than one project you can defend in detail.</li>
  <li><strong>Non-CS branches are still in the game.</strong> Electronics, mechanical, electrical and civil students are being placed into software, data and cloud roles &mdash; but they have to close the gap themselves through projects and internships.</li>
  <li><strong>Internships became the real filter.</strong> A strong summer internship after third year is now the most reliable predictor of a good final placement.</li>
</ul>

<h2>Branch choice in 2026</h2>
<p>If your goal is a tech career, the ranking by <em>ease of access</em> to software/data/AI roles is roughly:</p>
<ol>
  <li><strong>CSE / IT / AI-DS / ECE</strong> &mdash; most direct path, most on-campus opportunities.</li>
  <li><strong>EEE / Electronics variants</strong> &mdash; strong for embedded, hardware-software, and with effort, pure software.</li>
  <li><strong>Mechanical / Civil / Chemical</strong> &mdash; core roles still exist; a software pivot is very doable but is on you, not the curriculum.</li>
</ol>
<blockquote>A motivated student in a "non-CS" branch at a decent college routinely out-places an unmotivated CSE student. Branch sets the default difficulty, not the ceiling.</blockquote>
<p>Specialised "AI &amp; Data Science" branches can be good, but evaluate the actual syllabus and faculty &mdash; some are relabelled IT programmes. The fundamentals (maths, DSA, systems) matter more than the branch name.</p>

<h2>How to evaluate a college on outcomes</h2>
<p>Marketing brochures quote the highest package and a misleading average. Ask for:</p>
<ul>
  <li><strong>Median</strong> package, not mean &mdash; and the <strong>percentage placed</strong> in a role you would actually want.</li>
  <li>The <strong>list of recruiters</strong> from the last two years, and how many hires each made.</li>
  <li><strong>Internship conversion</strong> rates &mdash; how many pre-placement offers came from summer internships.</li>
  <li>Whether <strong>core</strong> (non-software) companies still visit, if that matters to you.</li>
  <li>The strength of <strong>coding culture</strong> &mdash; active clubs, ICPC/hackathon participation, senior mentorship.</li>
</ul>
<p>You can compare institutions and shortlist by branch and location on the Riseflake <a href="/colleges/browse">college directory</a> &mdash; including <a href="/colleges/browse/engineering-colleges-in-india">engineering colleges in India</a>.</p>

<h2>The skills that clear placement rounds</h2>
<ol>
  <li><strong>Data structures &amp; algorithms.</strong> Still the gate for most software roles. Consistent practice from second year beats a panic sprint.</li>
  <li><strong>One language, deeply.</strong> C++, Java or Python &mdash; know its standard library and quirks.</li>
  <li><strong>SQL and databases.</strong> Tested in almost every data, backend and analyst interview.</li>
  <li><strong>CS core.</strong> OS, networks, DBMS, OOP &mdash; short-answer rounds lean heavily here.</li>
  <li><strong>One real project per year</strong> that you built, deployed and can explain end to end.</li>
  <li><strong>Applied AI literacy.</strong> One project involving data pipelines or an ML/LLM component &mdash; see <a href="/blog/how-to-get-ai-ml-internship-2026">our AI/ML internship guide</a>.</li>
</ol>

<h2>A year-by-year plan</h2>
<ul>
  <li><strong>Year 1:</strong> Get comfortable with one language and basic maths. Start DSA slowly. Join a coding or robotics club.</li>
  <li><strong>Year 2:</strong> Serious DSA. Build two projects. Learn Git, SQL and Linux. Do a small winter internship or open-source contribution.</li>
  <li><strong>Year 3:</strong> Target a strong summer internship &mdash; this is the priority of the year. Deepen one track (web, data, cloud, ML). Start mock interviews. Browse <a href="/internships/browse">internships</a> early.</li>
  <li><strong>Year 4:</strong> Convert the internship or interview widely. Polish your resume and GitHub. Prepare system-design basics. Apply consistently through campus and off-campus (Riseflake, referrals, company portals).</li>
</ul>

<h2>Off-campus is a real path</h2>
<p>If your campus placements are thin, off-campus hiring has never been more accessible. A clean resume, a GitHub with two solid projects, and steady applications through job platforms and referrals can match or beat an average campus outcome. Start with <a href="/jobs/browse/software-development-jobs">software development jobs</a> and <a href="/jobs/browse/data-analyst-jobs">data analyst jobs</a> for freshers.</p>

${CTA_JOBS}

<h2>FAQ</h2>
<h3>Does college tier still matter in 2026?</h3>
<p>It affects which companies come to campus and your first interview call rate off-campus. After your first job, your work and skills dominate. A strong portfolio narrows the gap considerably.</p>
<h3>Should I pick a new "AI/Data Science" branch over CSE?</h3>
<p>Only if the syllabus and faculty are genuinely strong. Otherwise CSE or IT with self-driven AI projects is the safer, more flexible choice.</p>
`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: -105,
    slug: 'how-to-get-ai-ml-internship-2026',
    title: 'How to Get an AI/ML Internship in 2026: A Step-by-Step Guide for Engineering Students',
    category_name: 'Internships',
    category_slug: 'internships',
    author_name: AUTHOR,
    published_at: '2026-06-30T05:30:00.000Z',
    updated_at: UPDATED,
    view_count: 8940,
    read_time_minutes: 10,
    cover_image_url: '/blog/how-to-get-ai-ml-internship-2026.svg',
    cover_image_alt: 'How to get an AI/ML internship in 2026 — step-by-step guide for engineering students',
    excerpt:
      'A concrete plan to land an AI/ML internship in 2026 — the skills to build, the portfolio that gets replies, how to apply, and how to handle the interview.',
    meta_title: 'How to Get an AI/ML Internship in 2026 — Step-by-Step Guide',
    meta_description:
      'Step-by-step guide to landing an AI/ML internship in 2026 for engineering students in India: skills, portfolio projects, where to apply, resume and interview tips.',
    tags: [
      { name: 'Internships', slug: 'internships' },
      { name: 'AI Jobs', slug: 'ai-jobs' },
      { name: 'Machine Learning', slug: 'machine-learning' },
      { name: 'Freshers', slug: 'freshers' },
    ],
    content: `
<p>An AI/ML internship is the highest-leverage thing an engineering student can do for their career right now. It converts into pre-placement offers, it de-risks your resume, and it teaches you what the classroom cannot. Here is a concrete, no-fluff plan to get one in 2026.</p>

<h2>Step 1: Get the prerequisites to a real level</h2>
<p>Not expert &mdash; <em>functional</em>. You should be able to:</p>
<ul>
  <li>Write clean Python and use NumPy, pandas and scikit-learn without constant reference.</li>
  <li>Write non-trivial SQL &mdash; joins, aggregation, window functions.</li>
  <li>Explain bias/variance, train/validation/test splits, overfitting, and why a metric like accuracy can mislead.</li>
  <li>Describe how a decision tree, logistic regression and a basic neural network work.</li>
  <li>Use Git and the command line comfortably.</li>
</ul>
<p>Give this 6&ndash;8 weeks of consistent effort if you are starting fresh.</p>

<h2>Step 2: Build a portfolio that earns a reply</h2>
<p>Three projects, quality over quantity. Each one lives in its own GitHub repo with a clear README (problem, data, approach, results, how to run) and, ideally, a live demo.</p>
<ol>
  <li><strong>An end-to-end ML project on messy, real data.</strong> Not the Titanic dataset. Scrape or download something you care about, clean it, model it, evaluate honestly, and deploy a small API or Streamlit app.</li>
  <li><strong>An applied-LLM project.</strong> A retrieval-augmented assistant over a document set, with a basic evaluation of answer quality. Show you understand chunking, embeddings, vector search and prompt design.</li>
  <li><strong>A data-pipeline or analysis project.</strong> A scheduled pipeline (Airflow or a cron + script) that ingests data, transforms it, and produces a dashboard or report. This signals you can be trusted with production work.</li>
</ol>
<blockquote>One project you can whiteboard from memory &mdash; every decision, every trade-off &mdash; is worth more than five you copied from a tutorial.</blockquote>

<h2>Step 3: Fix your resume</h2>
<ul>
  <li>One page. Projects section above coursework.</li>
  <li>Each project: what it does, the stack, and a <strong>quantified</strong> result ("reduced error 18%", "handles 50k rows/run", "p95 latency 400ms").</li>
  <li>Link every project. A reviewer spends seconds &mdash; make the GitHub and demo one click away.</li>
  <li>List skills you can actually be interviewed on. Remove the rest.</li>
</ul>

<h2>Step 4: Apply in volume, but target</h2>
<p>Where AI/ML internships come from in 2026:</p>
<ul>
  <li><strong>Job platforms.</strong> Browse and set alerts for <a href="/internships/browse/ai-ml-engineer-internships">AI / ML internships</a> and <a href="/internships/data-science">data science internships</a> on Riseflake.</li>
  <li><strong>Startups.</strong> Smaller teams give interns real work and respond faster. Email the founder or eng lead directly with a two-line pitch and your best project link.</li>
  <li><strong>College network.</strong> Seniors who interned last year are your best referral source.</li>
  <li><strong>Open source and competitions.</strong> A merged PR to a known ML library, or a strong Kaggle finish, opens doors.</li>
  <li><strong>Research labs.</strong> Email professors whose work you have actually read, with a specific idea.</li>
</ul>
<p>Aim for a steady cadence &mdash; a handful of well-targeted applications per day beats 100 in one weekend and then nothing.</p>

<h2>Step 5: Handle the interview</h2>
<p>Typical AI/ML internship loop:</p>
<ol>
  <li><strong>Coding screen:</strong> one or two DSA problems, easy to medium. Practise arrays, strings, hashing, and basic dynamic programming.</li>
  <li><strong>ML fundamentals:</strong> metrics, overfitting, regularisation, handling imbalance, feature engineering, evaluation design.</li>
  <li><strong>Project deep-dive:</strong> they pick your strongest project and push. Know why you chose each model, what you would do differently, and what broke.</li>
  <li><strong>SQL / data round:</strong> common for data-leaning teams.</li>
  <li><strong>Behavioural:</strong> a time you were stuck, a time you disagreed, why this company.</li>
</ol>

<h2>Step 6: Once you are in</h2>
<p>Ship something small in the first two weeks. Ask for a conversion conversation at the mid-point, not the last day. Keep a brag document of what you delivered &mdash; you will need it for the PPO discussion and your resume.</p>

<div class="blog-callout">
  <p><strong>Start now:</strong> browse <a href="/internships/browse/ai-ml-engineer-internships">AI / ML internships</a>,
  <a href="/internships/data-science">data science internships</a> and
  <a href="/internships/software-development">software development internships</a> on Riseflake, and read
  <a href="/blog/ai-ml-jobs-india-2026">AI &amp; ML jobs in India 2026</a> for the roles this leads to.</p>
</div>

<h2>FAQ</h2>
<h3>Which year should I do an AI/ML internship?</h3>
<p>The summer after third year is the classic high-value slot because it can convert into a pre-placement offer. A smaller internship or open-source stint after second year builds the resume that gets you there.</p>
<h3>Do I need to have trained a large model?</h3>
<p>No. Interviewers want to see that you can frame a problem, handle real data, evaluate honestly and ship. Training from scratch is rarely part of an internship.</p>
`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: -106,
    slug: 'devops-cloud-engineer-roadmap-2026',
    title: 'DevOps and Cloud Engineer Roadmap 2026 for Freshers in India',
    category_name: 'Tech & Engineering',
    category_slug: 'tech-engineering',
    author_name: AUTHOR,
    published_at: '2026-07-25T06:45:00.000Z',
    updated_at: UPDATED,
    view_count: 4360,
    read_time_minutes: 11,
    cover_image_url: '/blog/devops-cloud-engineer-roadmap-2026.svg',
    cover_image_alt: 'DevOps and cloud engineer roadmap 2026 for freshers in India',
    excerpt:
      'A step-by-step DevOps and cloud engineering roadmap for 2026 — the exact order to learn Linux, cloud, Terraform, Docker, Kubernetes and CI/CD, with projects and job targets.',
    meta_title: 'DevOps & Cloud Engineer Roadmap 2026 for Freshers (India)',
    meta_description:
      'A practical 2026 DevOps and cloud engineering roadmap for freshers in India: what to learn in what order, portfolio projects, certifications and how to get hired.',
    tags: [
      { name: 'DevOps', slug: 'devops' },
      { name: 'Cloud Computing', slug: 'cloud-computing' },
      { name: 'Roadmap', slug: 'roadmap' },
      { name: 'Freshers', slug: 'freshers' },
    ],
    content: `
<p>DevOps and cloud engineering are among the most reliable ways into a well-paid tech career in India &mdash; the demand is steady, the work is concrete, and you can learn most of it with a laptop and a free-tier cloud account. This roadmap gives you the order to learn things in, and what to build at each stage.</p>

<h2>First, the mindset</h2>
<p>DevOps is not a tool. It is the practice of shipping software reliably and repeatedly &mdash; automation, feedback, and treating operations as an engineering problem. The tools below are how that practice gets implemented in 2026.</p>

<h2>Stage 1 &mdash; Foundations (4&ndash;6 weeks)</h2>
<ul>
  <li><strong>Linux:</strong> the shell, file system, permissions, processes, systemd, networking commands, log files. Live in the terminal.</li>
  <li><strong>Networking:</strong> IP, subnets, DNS, HTTP/HTTPS, TLS, load balancing, firewalls, the OSI model at a working level.</li>
  <li><strong>Scripting:</strong> Bash for glue, Python for anything non-trivial.</li>
  <li><strong>Git:</strong> branching, merging, rebasing, pull requests, resolving conflicts.</li>
</ul>
<p><strong>Project:</strong> set up a Linux VM, host a static site behind Nginx with HTTPS, and write a Bash script that backs up and rotates its logs.</p>

<h2>Stage 2 &mdash; One cloud, properly (5&ndash;7 weeks)</h2>
<p>Pick AWS unless you have a reason not to (see <a href="/blog/cloud-computing-careers-2026">AWS vs Azure vs GCP</a>). Learn:</p>
<ul>
  <li>Identity (IAM), compute (EC2/equivalent), networking (VPC), storage (S3/equivalent), managed databases.</li>
  <li>Serverless functions and managed container services.</li>
  <li>Billing, budgets and cost alarms &mdash; from day one.</li>
</ul>
<p><strong>Project:</strong> deploy a small three-tier app (frontend, API, database) using only cloud-managed services, with a custom domain and TLS.</p>

<h2>Stage 3 &mdash; Infrastructure as Code (3&ndash;4 weeks)</h2>
<ul>
  <li><strong>Terraform:</strong> providers, resources, variables, outputs, modules, remote state, workspaces.</li>
  <li>Understand drift, plan/apply, and why manual console changes are a problem.</li>
</ul>
<p><strong>Project:</strong> recreate your entire Stage 2 deployment as Terraform code in a Git repo. Tear it down and stand it back up from code alone.</p>

<h2>Stage 4 &mdash; Containers and orchestration (5&ndash;7 weeks)</h2>
<ul>
  <li><strong>Docker:</strong> images, layers, multi-stage builds, volumes, networks, Compose, registry basics.</li>
  <li><strong>Kubernetes:</strong> pods, deployments, services, ingress, config maps, secrets, probes, resource limits, namespaces. Then Helm.</li>
</ul>
<p><strong>Project:</strong> containerise a multi-service app, deploy it to a managed Kubernetes cluster with ingress, TLS, autoscaling and a managed database. Document the architecture.</p>

<h2>Stage 5 &mdash; CI/CD and observability (3&ndash;4 weeks)</h2>
<ul>
  <li><strong>CI/CD:</strong> GitHub Actions or GitLab CI &mdash; build, test, scan, and deploy on merge. Environments, approvals, rollbacks.</li>
  <li><strong>Observability:</strong> Prometheus and Grafana for metrics, centralised logs, distributed tracing, and alerting that a human can act on.</li>
  <li><strong>Security basics:</strong> image scanning, secret scanning, least-privilege IAM, dependency updates.</li>
</ul>
<p><strong>Project:</strong> add a full pipeline to your Stage 4 app &mdash; automated tests, image build and scan, deploy to staging then production, plus dashboards and alerts. This is your flagship portfolio piece.</p>

<h2>Certifications (optional, well-timed)</h2>
<ul>
  <li>AWS Solutions Architect &ndash; Associate <em>or</em> AWS SysOps, after Stage 2&ndash;3.</li>
  <li>Terraform Associate, after Stage 3.</li>
  <li>CKA (Certified Kubernetes Administrator), after Stage 4 &mdash; this one carries real weight.</li>
</ul>

<h2>Getting hired</h2>
<p>Entry titles to target: <strong>Cloud Engineer</strong>, <strong>DevOps Engineer (Junior)</strong>, <strong>Build &amp; Release Engineer</strong>, <strong>Platform Engineer (Associate)</strong>, <strong>Cloud Support Engineer</strong>. Browse <a href="/jobs/browse/devops-engineer-jobs">DevOps Engineer jobs</a> and <a href="/jobs/browse/information-technology-it-jobs">IT jobs</a>, and set alerts. Salary expectations for freshers and beyond are in the <a href="/blog/cloud-computing-careers-2026">cloud careers guide</a>; the broader role landscape is in <a href="/blog/tech-careers-2026-2027-guide">tech careers 2026&ndash;27</a>.</p>
<p>In interviews you will get scenario questions ("a deploy failed at 2am, walk me through it"), a Linux/troubleshooting round, and a discussion of your flagship project. Depth on one real pipeline beats name-dropping ten tools.</p>

${CTA_JOBS}

<h2>FAQ</h2>
<h3>How long does this roadmap take?</h3>
<p>Around 6&ndash;8 months at 10&ndash;15 focused hours a week, including projects. Faster if you already know Linux and one programming language well.</p>
<h3>Can freshers get DevOps roles, or is it experience-only?</h3>
<p>Junior DevOps, cloud support and build/release roles do hire freshers &mdash; especially with a strong project portfolio and one associate-level certification. Many people also move in after 1&ndash;2 years in software development or IT operations.</p>
`,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSummary(p: StaticBlogDetail): StaticBlogSummary {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    cover_image_url: p.cover_image_url,
    published_at: p.published_at,
    view_count: p.view_count,
    read_time_minutes: p.read_time_minutes,
    category_name: p.category_name,
    category_slug: p.category_slug,
    author_name: p.author_name,
    tags: p.tags,
  }
}

const BY_DATE_DESC = (a: StaticBlogDetail, b: StaticBlogDetail) =>
  (b.published_at ?? '').localeCompare(a.published_at ?? '')

/** Full post for `/blog/[slug]`, or null if not a static post. */
export function getStaticBlogPost(slug: string): StaticBlogDetail | null {
  return STATIC_BLOG_POSTS.find((p) => p.slug === slug) ?? null
}

export function isStaticBlogSlug(slug: string): boolean {
  return STATIC_BLOG_POSTS.some((p) => p.slug === slug)
}

/**
 * Static post summaries for the `/blog` listing, newest first.
 * Optionally filtered by category slug.
 */
export function getStaticBlogSummaries(categorySlug?: string): StaticBlogSummary[] {
  return [...STATIC_BLOG_POSTS]
    .filter((p) => !categorySlug || p.category_slug === categorySlug)
    .sort(BY_DATE_DESC)
    .map(toSummary)
}

/** Related static posts — same category first, then newest others. */
export function getStaticBlogRelated(slug: string, limit = 3): StaticBlogSummary[] {
  const current = getStaticBlogPost(slug)
  const others = [...STATIC_BLOG_POSTS].filter((p) => p.slug !== slug).sort(BY_DATE_DESC)
  const sameCat = others.filter((p) => current && p.category_slug === current.category_slug)
  const rest = others.filter((p) => !sameCat.includes(p))
  return [...sameCat, ...rest].slice(0, limit).map(toSummary)
}

/** `{ slug, updated_at }` list for the XML sitemap. */
export const STATIC_BLOG_SITEMAP_ENTRIES = STATIC_BLOG_POSTS.map((p) => ({
  slug: p.slug,
  updated_at: p.updated_at,
}))
