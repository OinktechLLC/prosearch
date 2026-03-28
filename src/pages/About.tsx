import { Search, Shield, Mic, Globe } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Search, title: "Smart Search", desc: "Powered by DuckDuckGo for accurate, unbiased results. Auto-detects Russian users and redirects video to local platforms." },
  { icon: Shield, title: "Privacy First", desc: "No tracking, no cookies, no user profiling. Your searches stay yours." },
  { icon: Mic, title: "Voice Search", desc: "Web Speech API integration for hands-free searching in any language." },
  { icon: Globe, title: "Geo-Aware Video", desc: "Automatically uses RuTube, VK Video and Дзен for users from Russia, YouTube for others." },
];

const About = () => (
  <div className="min-h-[calc(100vh-3.5rem)] container py-10 max-w-3xl">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-4xl font-extrabold mb-2">
        <span className="gradient-text">About Pro Search</span>
      </h1>
      <p className="text-muted-foreground text-lg mb-12">
        A modern, privacy-focused search engine inspired by Perplexity AI and iOS Spotlight.
      </p>
    </motion.div>

    <div className="grid gap-6 sm:grid-cols-2">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl border border-border bg-card p-6 card-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <f.icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">{f.title}</h3>
          <p className="text-sm text-muted-foreground">{f.desc}</p>
        </motion.div>
      ))}
    </div>

    <div className="mt-12 rounded-xl border border-border bg-card p-6 card-shadow">
      <h2 className="font-bold text-lg mb-4">API & Tech Stack</h2>
      <div className="space-y-3 text-sm text-muted-foreground">
        <p><span className="font-medium text-foreground">Frontend:</span> React + TypeScript + Tailwind CSS + Framer Motion</p>
        <p><span className="font-medium text-foreground">Search API:</span> DuckDuckGo Instant Answer + HTML API via CORS proxy</p>
        <p><span className="font-medium text-foreground">Voice:</span> Web Speech API (SpeechRecognition)</p>
        <p><span className="font-medium text-foreground">Storage:</span> localStorage for search history and theme</p>
      </div>

      <h3 className="font-bold mt-6 mb-3">Example DuckDuckGo API Request</h3>
      <pre className="p-4 rounded-lg bg-muted text-xs overflow-x-auto">
{`GET https://api.duckduckgo.com/?q=React+framework&format=json&no_redirect=1

Response:
{
  "Heading": "React (JavaScript library)",
  "Abstract": "React is a free and open-source...",
  "AbstractURL": "https://en.wikipedia.org/wiki/React",
  "RelatedTopics": [
    { "Text": "React Native - ...", "FirstURL": "..." }
  ]
}`}
      </pre>
    </div>
  </div>
);

export default About;
