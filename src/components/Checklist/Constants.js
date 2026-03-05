export const CHECKLIST_DATA = [
  {
    category: "Resume Preparation",
    key: "resume",
    icon: "📄",
    items: [
      { id: "ats_friendly", label: "Create ATS-friendly resume" },
      { id: "standard_format", label: "Use a standard resume format" },
      { id: "clear_headings", label: "Use clear section headings" },
      { id: "keywords", label: "Use keywords from job description" },
      {
        id: "contact_info",
        label: "Include contact info (email, phone, LinkedIn, portfolio)",
      },
      { id: "summary", label: "Write a short professional summary" },
      {
        id: "praq_rule",
        label: "Use PRAQ rule (Power Verb, Result, Action, Quantify)",
      },
      { id: "bullets", label: "Use 3–5 bullet points per experience" },
      { id: "simple_fonts", label: "Use simple fonts and formatting" },
      { id: "export_pdf", label: "Export resume as PDF" },
      { id: "spelling", label: "Check spelling and grammar" },
      { id: "highlight", label: "Highlight relevant skills and achievements" },
      { id: "education", label: "Add education and project experience" },
    ],
  },
  {
    category: "Cover Letter",
    key: "cover_letter",
    icon: "✉️",
    items: [
      { id: "address_title", label: "Address the job title correctly" },
      {
        id: "address_manager",
        label: "Address the hiring manager if possible",
      },
      { id: "customize", label: "Customize the letter for the job" },
      {
        id: "explain_interest",
        label: "Explain why you are interested in the company",
      },
      { id: "explain_fit", label: "Explain why you are a good fit" },
      {
        id: "highlight_exp",
        label: "Highlight relevant experience and skills",
      },
      { id: "concise", label: "Keep it concise and professional" },
      { id: "spelling", label: "Check spelling and grammar" },
    ],
  },
  {
    category: "Portfolio",
    key: "portfolio",
    icon: "📁",
    items: [
      { id: "platform", label: "Choose a portfolio platform" },
      { id: "best_projects", label: "Select best projects to showcase" },
      { id: "descriptions", label: "Write clear project descriptions" },
      { id: "metrics", label: "Include measurable results or metrics" },
      { id: "unique_skills", label: "Highlight unique skills" },
      { id: "navigation", label: "Make portfolio easy to navigate" },
      {
        id: "explanation",
        label: "Prepare explanation of portfolio for interviews",
      },
    ],
  },
  {
    category: "LinkedIn Profile",
    key: "linkedin",
    icon: "🔗",
    items: [
      { id: "photo", label: "Use professional profile photo" },
      { id: "headline", label: "Write a strong headline" },
      { id: "about", label: "Write engaging About section" },
      { id: "experience", label: "List relevant work experience" },
      { id: "skills", label: "Add skills and endorsements" },
      { id: "recommendations", label: "Request recommendations" },
      { id: "connect", label: "Connect with recruiters and professionals" },
      { id: "share_posts", label: "Share posts about projects or learning" },
    ],
  },
  {
    category: "Company Research",
    key: "company_research",
    icon: "🏢",
    items: [
      { id: "website", label: "Review company website" },
      { id: "social_media", label: "Check company social media" },
      { id: "news", label: "Read recent news about company" },
      { id: "glassdoor", label: "Check Glassdoor reviews" },
      { id: "competitors", label: "Research competitors" },
      { id: "products", label: "Understand company products/services" },
    ],
  },
  {
    category: "Job Application",
    key: "application",
    icon: "📝",
    items: [
      { id: "review_jd", label: "Review job description carefully" },
      { id: "customize_docs", label: "Customize CV and cover letter" },
      { id: "double_check", label: "Double-check application documents" },
      { id: "track", label: "Track job applications" },
      { id: "monitor", label: "Monitor email and phone for responses" },
    ],
  },
  {
    category: "Interview Preparation",
    key: "interview",
    icon: "🎯",
    items: [
      { id: "common_qa", label: "Prepare answers for common questions" },
      { id: "mock_interview", label: "Practice mock interview" },
      { id: "prep_questions", label: "Prepare questions for interviewer" },
      { id: "prep_materials", label: "Prepare CV and portfolio" },
      { id: "thank_you", label: "Send thank-you email after interview" },
    ],
  },
];

export const STATUS_OPTIONS = [
  {
    id: "NOT_STARTED",
    label: "Not Started",
    color:
      "bg-neutral-800 text-neutral-400 border-neutral-700 hover:border-neutral-500",
  },
  {
    id: "IN_PROGRESS",
    label: "In Progress",
    color:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:border-yellow-400/50",
  },
  {
    id: "DONE",
    label: "Done",
    color:
      "bg-green-500/10 text-green-400 border-green-500/30 hover:border-green-400/50",
  },
];
