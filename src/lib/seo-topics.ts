export interface SEOTopic {
  slug: string;
  titlePT: string;
  titleEN: string;
  keywords: string[];
}

/**
 * Portuguese long-tail SEO topics targeting "O que é [topic]?" searches.
 * Each page targets underserved Portuguese queries about AI and tech.
 */
export const SEO_TOPICS: SEOTopic[] = [
  // AI Fundamentals
  { slug: "inteligencia-artificial", titlePT: "Inteligência Artificial", titleEN: "Artificial Intelligence", keywords: ["IA", "inteligência artificial", "artificial intelligence"] },
  { slug: "machine-learning", titlePT: "Machine Learning", titleEN: "Machine Learning", keywords: ["aprendizado de máquina", "ML", "machine learning"] },
  { slug: "deep-learning", titlePT: "Deep Learning", titleEN: "Deep Learning", keywords: ["aprendizado profundo", "redes neurais", "deep learning"] },
  { slug: "redes-neurais", titlePT: "Redes Neurais", titleEN: "Neural Networks", keywords: ["redes neurais artificiais", "neural networks"] },
  { slug: "nlp-processamento-linguagem-natural", titlePT: "Processamento de Linguagem Natural (NLP)", titleEN: "Natural Language Processing", keywords: ["NLP", "processamento de linguagem", "PLN"] },
  { slug: "computer-vision", titlePT: "Visão Computacional", titleEN: "Computer Vision", keywords: ["visão computacional", "computer vision", "reconhecimento de imagem"] },

  // AI Models & Companies
  { slug: "chatgpt", titlePT: "ChatGPT", titleEN: "ChatGPT", keywords: ["ChatGPT", "OpenAI", "GPT-4"] },
  { slug: "claude-ai", titlePT: "Claude AI", titleEN: "Claude AI", keywords: ["Claude", "Anthropic", "Claude AI"] },
  { slug: "gemini-google", titlePT: "Gemini do Google", titleEN: "Google Gemini", keywords: ["Gemini", "Google AI", "Bard"] },
  { slug: "llm-modelos-linguagem", titlePT: "Modelos de Linguagem (LLM)", titleEN: "Large Language Models", keywords: ["LLM", "modelos de linguagem", "large language models"] },
  { slug: "gpt", titlePT: "GPT", titleEN: "GPT", keywords: ["GPT", "Generative Pre-trained Transformer", "OpenAI GPT"] },
  { slug: "transformers", titlePT: "Transformers em IA", titleEN: "Transformer Models", keywords: ["transformer", "attention mechanism", "arquitetura transformer"] },

  // AI Applications
  { slug: "ia-generativa", titlePT: "IA Generativa", titleEN: "Generative AI", keywords: ["IA generativa", "generative AI", "GenAI"] },
  { slug: "agentes-ia", titlePT: "Agentes de IA", titleEN: "AI Agents", keywords: ["agentes IA", "AI agents", "agentes autônomos"] },
  { slug: "rag-retrieval-augmented-generation", titlePT: "RAG (Retrieval Augmented Generation)", titleEN: "RAG", keywords: ["RAG", "retrieval augmented generation", "geração aumentada por recuperação"] },
  { slug: "prompt-engineering", titlePT: "Engenharia de Prompt", titleEN: "Prompt Engineering", keywords: ["prompt engineering", "engenharia de prompt", "prompts IA"] },
  { slug: "fine-tuning", titlePT: "Fine-tuning de Modelos de IA", titleEN: "Model Fine-tuning", keywords: ["fine-tuning", "ajuste fino", "treinamento de modelos"] },
  { slug: "ia-no-trabalho", titlePT: "IA no Trabalho", titleEN: "AI at Work", keywords: ["IA no trabalho", "automação com IA", "produtividade IA"] },

  // Cybersecurity
  { slug: "ciberseguranca", titlePT: "Cibersegurança", titleEN: "Cybersecurity", keywords: ["cibersegurança", "segurança digital", "cybersecurity"] },
  { slug: "ransomware", titlePT: "Ransomware", titleEN: "Ransomware", keywords: ["ransomware", "sequestro de dados", "malware"] },
  { slug: "phishing", titlePT: "Phishing", titleEN: "Phishing", keywords: ["phishing", "engenharia social", "golpe online"] },
  { slug: "zero-trust", titlePT: "Zero Trust", titleEN: "Zero Trust Security", keywords: ["zero trust", "confiança zero", "segurança zero trust"] },
  { slug: "vpn", titlePT: "VPN", titleEN: "VPN", keywords: ["VPN", "rede privada virtual", "virtual private network"] },
  { slug: "autenticacao-dois-fatores", titlePT: "Autenticação de Dois Fatores (2FA)", titleEN: "Two-Factor Authentication", keywords: ["2FA", "autenticação dois fatores", "MFA"] },

  // Dev & Tech
  { slug: "cloud-computing", titlePT: "Computação em Nuvem", titleEN: "Cloud Computing", keywords: ["cloud computing", "computação em nuvem", "nuvem"] },
  { slug: "devops", titlePT: "DevOps", titleEN: "DevOps", keywords: ["DevOps", "CI/CD", "integração contínua"] },
  { slug: "api", titlePT: "API", titleEN: "API", keywords: ["API", "interface de programação", "REST API"] },
  { slug: "blockchain", titlePT: "Blockchain", titleEN: "Blockchain", keywords: ["blockchain", "cadeia de blocos", "tecnologia blockchain"] },
  { slug: "edge-computing", titlePT: "Edge Computing", titleEN: "Edge Computing", keywords: ["edge computing", "computação de borda", "IoT"] },
  { slug: "quantum-computing", titlePT: "Computação Quântica", titleEN: "Quantum Computing", keywords: ["computação quântica", "quantum computing", "qubits"] },

  // Business & Ethics
  { slug: "ia-etica", titlePT: "Ética em IA", titleEN: "AI Ethics", keywords: ["ética IA", "AI ethics", "IA responsável"] },
  { slug: "ia-regulamentacao", titlePT: "Regulamentação de IA", titleEN: "AI Regulation", keywords: ["regulamentação IA", "EU AI Act", "lei de IA"] },
  { slug: "startup-tecnologia", titlePT: "Startups de Tecnologia", titleEN: "Tech Startups", keywords: ["startup", "empreendedorismo tech", "venture capital"] },
  { slug: "saas", titlePT: "SaaS (Software as a Service)", titleEN: "SaaS", keywords: ["SaaS", "software como serviço", "software as a service"] },
  { slug: "open-source", titlePT: "Open Source", titleEN: "Open Source", keywords: ["open source", "código aberto", "software livre"] },
];
