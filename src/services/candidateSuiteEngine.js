import { extractKeywords } from './atsEngine';

/**
 * Generate high-converting Boolean job search queries
 */
export function generateSearchQueries(role, skills = [], location = 'Remote') {
  const cleanRole = role || 'Software Engineer';
  const topSkills = skills.slice(0, 4).join(' AND ');
  
  return [
    {
      platform: 'Google Search (Direct ATS Links)',
      description: 'Finds direct Greenhouse & Lever postings bypassing recruiter agency spam',
      query: `(site:greenhouse.io OR site:lever.co OR site:jobs.ashbyhq.com) "${cleanRole}" ${topSkills ? `"${topSkills}"` : ''} "${location}"`,
      url: `https://www.google.com/search?q=${encodeURIComponent(`(site:greenhouse.io OR site:lever.co OR site:jobs.ashbyhq.com) "${cleanRole}" ${location}`)}`
    },
    {
      platform: 'LinkedIn Boolean Search',
      description: 'Filters LinkedIn jobs for exact title and mandatory skill stack',
      query: `title:("${cleanRole}") AND (${skills.slice(0, 3).map(s => `"${s}"`).join(' OR ')})`,
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`"${cleanRole}" ${skills.slice(0, 2).join(' ')}`)}`
    },
    {
      platform: 'GitHub / YCombinator / HackerNews',
      description: 'Finds engineering roles directly on tech-forward platforms',
      query: `site:news.ycombinator.com "Ask HN: Who is hiring?" "${cleanRole}"`,
      url: `https://www.google.com/search?q=${encodeURIComponent(`site:news.ycombinator.com "Ask HN: Who is hiring?" "${cleanRole}"`)}`
    }
  ];
}

/**
 * Generate Human-Tone Cover Letter (Zero AI Cliché)
 */
export function generateHumanCoverLetter(candidateName, targetRole, targetCompany, resumeText, jdText) {
  const name = candidateName || 'Candidate';
  const role = targetRole || 'Software Engineer';
  const company = targetCompany || 'your team';
  
  // Extract a real metric or achievement from the resume if possible
  const metricMatch = resumeText.match(/(\d+%\s*[^.]+|\$\d+[kKmMbB]?\s*[^.]+)/);
  const concreteWin = metricMatch ? metricMatch[0].trim() : 'scaled production infrastructure with high uptime and low latency';

  return `Dear ${company} Hiring Team,

I am writing to apply for the ${role} position. Over the past several years, my work has focused on building scalable, reliable systems—most notably when I ${concreteWin}. What caught my attention about ${company} is your focus on engineering excellence and solving complex product challenges at scale.

Looking at your requirements, the stack and architectural focus directly align with what I build every day. I thrive in teams where engineers own their features from system design and automated testing to deployment and production monitoring. I value writing clean, maintainable code over quick patches and prefer pragmatic problem-solving over unnecessary complexity.

I'd welcome the chance to speak with your team about how my background can directly contribute to ${company}'s upcoming milestones. Thank you for your time and consideration.

Best regards,
${name}`;
}

/**
 * Generate LinkedIn Profile & Outreach Copy
 */
export function generateLinkedInAssets(targetRole, targetCompany, topSkills = []) {
  const role = targetRole || 'Senior Software Engineer';
  const skillsStr = topSkills.slice(0, 4).map(s => s.toUpperCase()).join(' | ');

  return {
    headline: `${role} | Building Scalable Distributed Systems | ${skillsStr || 'React • TypeScript • Node.js • Cloud Systems'}`,
    aboutSnippet: `I'm a ${role} focused on building high-reliability products that solve real customer problems. I enjoy untangling complex architecture, writing maintainable code, and collaborating with cross-functional teams to ship impactful software. Always open to connecting with fellow engineers, founders, and tech leads.`,
    coldOutreach: `Hi [Name],

I noticed you're leading engineering at ${targetCompany || '[Company]'}. I've been following your recent product launches and really admire how your team approaches [Specific Feature or Engineering Challenge]. 

I recently applied for the ${role} opening. Having built scalable systems in this exact stack, I'd love to share a brief note on how my background aligns with what you're building. 

Would you be open to a quick 5-minute chat next week? Either way, keep up the great work!

Best,
[Your Name]`
  };
}

/**
 * Generate Tailored Interview Questions based on JD and Resume Overlaps
 */
export function generateInterviewQuestions(role, jdText, resumeText) {
  const isEngineering = /software|engineer|developer|full stack|backend|frontend/i.test(role + ' ' + jdText);
  
  if (isEngineering) {
    return [
      {
        type: 'System Design & Architecture',
        question: 'How would you design a distributed, idempotent payment or event processing service that guarantees at-least-once delivery without duplicate processing?',
        whyAsked: 'Directly tests requirements from the JD regarding reliability, concurrency, and idempotency.',
        suggestedResponse: 'Discuss unique idempotency keys stored in Redis/PostgreSQL with transactional locks, exponential backoff retries, and dead-letter queues.'
      },
      {
        type: 'Database Performance',
        question: 'Walk me through a scenario where a relational database query became a production bottleneck. How did you diagnose and resolve it?',
        whyAsked: 'Evaluates your practical debugging skills with PostgreSQL/MySQL indexes, explain plans, and connection pooling.',
        suggestedResponse: 'Use your resume bullet: Explain diagnosing with EXPLAIN ANALYZE, missing composite indexes, and implementing a Redis cache layer.'
      },
      {
        type: 'Behavioral / Leadership (STAR)',
        question: 'Tell me about a time you strongly disagreed with a product specification or technical decision. How did you handle it?',
        whyAsked: 'Hiring managers check if you can collaborate constructively without ego while prioritizing system stability.',
        suggestedResponse: 'Focus on gathering concrete data, presenting alternative lightweight solutions, and aligning on team goals.'
      },
      {
        type: 'Production Outage / Resilience',
        question: 'Describe the worst production incident you investigated. What was the root cause and how did you prevent it from recurring?',
        whyAsked: 'Tests blameless post-mortem culture and observability practices (Datadog, OpenTelemetry).',
        suggestedResponse: 'Structure via STAR: Incident detection, triage, rollback/mitigation, root cause analysis, and automated guardrail addition.'
      },
      {
        type: 'Culture & Clean Code',
        question: 'How do you balance shipping fast versus writing clean, well-tested code in high-growth environments?',
        whyAsked: 'Verifies whether you align with their engineering standards without over-engineering simple features.',
        suggestedResponse: 'Emphasize automated CI/CD unit testing for core business logic, modular components, and deliberate technical debt management.'
      }
    ];
  } else {
    return [
      {
        type: 'Product Strategy & Vision',
        question: 'How do you prioritize between enterprise customer feature requests and core product-led growth (PLG) initiatives?',
        whyAsked: 'Assesses your ability to protect the product vision while meeting revenue goals.',
        suggestedResponse: 'Use an impact vs effort scoring framework, evaluating revenue potential, customer retention, and long-term architectural debt.'
      },
      {
        type: 'Cross-Functional Execution (STAR)',
        question: 'Tell me about a time an engineering team pushed back on a product requirement. How did you resolve the deadlock?',
        whyAsked: 'Tests technical empathy and ability to negotiate scope without damaging team morale.',
        suggestedResponse: 'Explain breaking down the requirement into phased MVPs, understanding technical constraints, and co-designing the solution.'
      },
      {
        type: 'Data & Experimentation',
        question: 'Describe an A/B test or experiment you ran that had unexpected negative results. What did you learn?',
        whyAsked: 'Evaluates intellectual honesty, data fluency, and speed of iteration.',
        suggestedResponse: 'Walk through the hypothesis, metric movement, qualitative user feedback investigation, and pivot decision.'
      }
    ];
  }
}

/**
 * Generate Salary Negotiation Scripts & Counter-Offers
 */
export function generateSalaryNegotiation(role, company) {
  return {
    strategyTip: 'Never reveal your current salary or first number. Always anchor to market rates and total compensation (base + bonus + equity + benefits).',
    scripts: [
      {
        title: 'Polite Counter-Offer (Email)',
        scenario: 'When you receive an initial offer that is 10-15% below your target',
        text: `Dear [Recruiter / Hiring Manager Name],

Thank you so much for extending this offer. I am genuinely excited about the opportunity to join ${company || '[Company]'} as ${role || '[Role]'} and contribute to the team's upcoming goals.

After reviewing the details of the offer and taking into account the scope of the responsibilities and current market data for this role, I was hoping we could get closer to $[Target Base Salary] in base compensation (or [Alternative: an increase in signing bonus / equity grant]). 

Given my background in [mention key relevant strength or accomplishment], I am confident I will make an immediate impact on the team. If we can reach this number, I am ready to sign today.

Looking forward to your thoughts!

Best regards,
[Your Name]`
      },
      {
        title: 'Competing Offer Leverage',
        scenario: 'When you have another offer in progress or on the table',
        text: `Hi [Recruiter Name],

I wanted to provide a transparent update on my search. I have received another offer with a base salary of $[Amount], but ${company || '[Company]'} remains my top choice due to the team culture and product direction. 

Is there flexibility to bridge the gap in total compensation? I'd love to finalize things with ${company || 'your team'} if we can make the numbers align.

Thank you!`
      }
    ]
  };
}

/**
 * Follow-up Emails (Thank You, Status Check, Extension)
 */
export function generateFollowUpEmails(candidateName, targetCompany, targetRole, interviewerName = 'Interviewer') {
  return [
    {
      title: 'Post-Interview Thank You (Send within 24h)',
      subject: `Thank you - ${targetRole} Interview - ${candidateName || 'Candidate'}`,
      body: `Hi ${interviewerName},

Thank you for taking the time to speak with me today about the ${targetRole} role at ${targetCompany}. I really enjoyed our conversation, especially learning more about your team's approach to [insert specific topic discussed, e.g. database scaling or Q3 priorities].

Our discussion further confirmed my excitement about the position. I'm confident my experience in [key skill] will allow me to hit the ground running.

Please let me know if you need any additional information from my side. Looking forward to hearing from you.

Best regards,
${candidateName}`
    },
    {
      title: '7-Day Follow-Up / Polite Nudge',
      subject: `Checking in regarding ${targetRole} Application - ${candidateName || 'Candidate'}`,
      body: `Hi [Recruiter/Hiring Manager Name],

I hope you're having a productive week! 

I'm following up to see if there are any updates regarding the ${targetRole} position. I remain very enthusiastic about the opportunity to join ${targetCompany} and would love to know the next steps in the process.

Thanks again for your time and guidance throughout the process.

Warm regards,
${candidateName}`
    }
  ];
}
