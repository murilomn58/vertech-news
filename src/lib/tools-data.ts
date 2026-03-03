export interface ToolEntry {
  name: string;
  url: string;
  description: string;
  category: string;
  pricing: string;
  badge?: string;
}

export const TOOL_CATEGORIES = [
  { slug: "coding", name: "AI Coding", namePT: "IA para Programação", color: "#a855f7" },
  { slug: "writing", name: "AI Writing", nameRT: "IA para Escrita", color: "#06b6d4" },
  { slug: "productivity", name: "Productivity", nameRT: "Produtividade", color: "#f59e0b" },
  { slug: "security", name: "Security", nameRT: "Segurança", color: "#ef4444" },
  { slug: "infrastructure", name: "Infrastructure", nameRT: "Infraestrutura", color: "#10b981" },
  { slug: "image", name: "AI Image & Video", nameRT: "IA para Imagem & Vídeo", color: "#ec4899" },
] as const;

export const TOOLS: ToolEntry[] = [
  // AI Coding
  {
    name: "Claude Code",
    url: "https://claude.ai",
    description: "Anthropic's AI assistant with advanced reasoning, coding, and analysis capabilities.",
    category: "coding",
    pricing: "Free / $20/mo Pro",
    badge: "Editor's Pick",
  },
  {
    name: "Cursor",
    url: "https://cursor.com",
    description: "AI-first code editor built on VS Code. Understands your entire codebase.",
    category: "coding",
    pricing: "Free / $20/mo Pro",
  },
  {
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    description: "AI pair programmer that suggests code completions in real-time.",
    category: "coding",
    pricing: "$10/mo",
  },
  {
    name: "Replit",
    url: "https://replit.com",
    description: "Cloud IDE with AI-powered code generation and deployment.",
    category: "coding",
    pricing: "Free / $25/mo",
  },
  {
    name: "Windsurf",
    url: "https://codeium.com/windsurf",
    description: "AI-powered IDE with advanced code completion and refactoring.",
    category: "coding",
    pricing: "Free / $15/mo",
  },

  // AI Writing
  {
    name: "Jasper AI",
    url: "https://jasper.ai",
    description: "Enterprise AI content platform for marketing teams.",
    category: "writing",
    pricing: "$49/mo",
  },
  {
    name: "Copy.ai",
    url: "https://copy.ai",
    description: "AI-powered copywriting tool for marketing, emails, and social media.",
    category: "writing",
    pricing: "Free / $49/mo",
  },
  {
    name: "Grammarly",
    url: "https://grammarly.com",
    description: "AI writing assistant for grammar, tone, and clarity.",
    category: "writing",
    pricing: "Free / $12/mo",
  },

  // Productivity
  {
    name: "Notion AI",
    url: "https://notion.so",
    description: "AI-powered workspace for docs, wikis, projects, and knowledge bases.",
    category: "productivity",
    pricing: "Free / $10/mo",
  },
  {
    name: "Perplexity",
    url: "https://perplexity.ai",
    description: "AI-powered search engine with cited, up-to-date answers.",
    category: "productivity",
    pricing: "Free / $20/mo Pro",
  },
  {
    name: "Otter.ai",
    url: "https://otter.ai",
    description: "AI meeting assistant that records, transcribes, and summarizes meetings.",
    category: "productivity",
    pricing: "Free / $16.99/mo",
  },

  // Security
  {
    name: "NordVPN",
    url: "https://nordvpn.com",
    description: "Premium VPN with military-grade encryption and threat protection.",
    category: "security",
    pricing: "$3.69/mo",
  },
  {
    name: "1Password",
    url: "https://1password.com",
    description: "Secure password manager for teams and individuals.",
    category: "security",
    pricing: "$2.99/mo",
  },
  {
    name: "Proton",
    url: "https://proton.me",
    description: "Privacy-focused email, VPN, drive, and calendar from Switzerland.",
    category: "security",
    pricing: "Free / $3.99/mo",
  },

  // Infrastructure
  {
    name: "Vercel",
    url: "https://vercel.com",
    description: "Frontend cloud platform for deploying web apps. Zero-config, instant deploys.",
    category: "infrastructure",
    pricing: "Free / $20/mo Pro",
    badge: "We Use This",
  },
  {
    name: "DigitalOcean",
    url: "https://digitalocean.com",
    description: "Simple, scalable cloud for developers. Droplets, K8s, and managed databases.",
    category: "infrastructure",
    pricing: "From $4/mo",
  },
  {
    name: "Cloudflare",
    url: "https://cloudflare.com",
    description: "CDN, DDoS protection, DNS, and edge computing platform.",
    category: "infrastructure",
    pricing: "Free / $20/mo Pro",
  },

  // AI Image & Video
  {
    name: "Midjourney",
    url: "https://midjourney.com",
    description: "AI image generation with stunning artistic quality.",
    category: "image",
    pricing: "$10/mo",
  },
  {
    name: "DALL-E",
    url: "https://openai.com/dall-e",
    description: "OpenAI's text-to-image model for generating and editing images.",
    category: "image",
    pricing: "Pay per use",
  },
  {
    name: "Runway",
    url: "https://runwayml.com",
    description: "AI creative suite for video generation, editing, and effects.",
    category: "image",
    pricing: "Free / $12/mo",
  },
];
