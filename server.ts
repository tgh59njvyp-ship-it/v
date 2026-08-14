import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Summarizer endpoint using Gemini API
  app.post("/api/summarize", async (req, res) => {
    try {
      const { url, title } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY is not configured on the server. Please set it in secrets." 
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `You are a helpful web assistant. Provide a concise, insightful summary and overview of what a user would expect to find on this website:
URL: ${url}
Page Title: ${title || 'Unknown'}

Please provide:
1. Overview / Purpose of the site
2. Key topics or features found here
3. Who this site is best for

Format the output clearly in markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const summary = response.text || "No summary could be generated.";
      res.json({ summary });
    } catch (err: any) {
      console.error("Gemini summarization error:", err);
      res.status(500).json({ error: err.message || "Failed to generate summary" });
    }
  });

  // Direct Web Proxy endpoint to bypass X-Frame-Options, CSP, and frame busting
  app.get("/api/proxy", async (req, res) => {
    try {
      let targetUrl = (req.query.url as string) || "";
      const searchQuery = (req.query.q as string) || "";

      if (!targetUrl && searchQuery) {
        targetUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      }

      if (!targetUrl) {
        return res.status(400).send("URL or q parameter is required");
      }

      if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
        targetUrl = `https://${targetUrl}`;
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(targetUrl);
      } catch {
        return res.status(400).send("Invalid URL format");
      }

      // Mobile user agent for smartphone-friendly layout
      const isMobile = req.headers["user-agent"]?.includes("Mobile") || req.headers["user-agent"]?.includes("Android") || req.headers["user-agent"]?.includes("iPhone");
      const userAgent = isMobile
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": userAgent,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
        },
        redirect: "follow",
      });

      const contentType = response.headers.get("content-type") || "text/html; charset=utf-8";
      res.setHeader("Content-Type", contentType);
      res.removeHeader("X-Frame-Options");
      res.removeHeader("Content-Security-Policy");
      res.removeHeader("Content-Security-Policy-Report-Only");
      res.setHeader("Access-Control-Allow-Origin", "*");

      if (contentType.includes("text/html")) {
        let html = await response.text();
        const baseHref = `${parsedUrl.origin}${parsedUrl.pathname.substring(0, parsedUrl.pathname.lastIndexOf("/") + 1)}`;
        
        // Remove frame busting scripts
        html = html.replace(/if\s*\(\s*(?:window\.)?top\s*!==?\s*(?:window\.)?self\s*\)/gi, "if(false)");
        html = html.replace(/(?:window\.)?top\.location\s*=\s*(?:window\.)?self\.location/gi, "//");
        html = html.replace(/target=["']_top["']/gi, 'target="_self"');
        html = html.replace(/target=["']_parent["']/gi, 'target="_self"');

        // Helper script to intercept link clicks and form submits to stay inside proxy
        const helperScript = `
          <script>
            (function() {
              window.addEventListener('DOMContentLoaded', function() {
                // Ensure all links stay within proxy if they are external
                document.querySelectorAll('a').forEach(function(a) {
                  if (a.target === '_top' || a.target === '_parent') a.target = '_self';
                });
              });
            })();
          </script>
        `;

        const baseTag = `<base href="${baseHref}">`;
        
        if (html.includes("<head>")) {
          html = html.replace("<head>", `<head>${baseTag}${helperScript}`);
        } else if (html.includes("<head ")) {
          html = html.replace(/<head[^>]*>/, `$&${baseTag}${helperScript}`);
        } else {
          html = `${baseTag}${helperScript}${html}`;
        }
        res.send(html);
      } else {
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));
      }
    } catch (err: any) {
      console.error("Proxy error:", err);
      res.status(500).send(`
        <!DOCTYPE html>
        <html lang="ja">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>読み込みエラー</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; text-align: center; color: #333; background: #fafafa; }
              .card { background: white; max-width: 460px; margin: 40px auto; padding: 28px; border-radius: 20px; border: 1px solid #e5e5e5; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
              h2 { font-size: 18px; margin-bottom: 10px; color: #111; }
              p { font-size: 13px; color: #666; line-height: 1.6; }
              .btn { display: inline-block; margin-top: 16px; padding: 12px 24px; background: #111; color: #fff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>ページを直接読み込めませんでした</h2>
              <p>${err.message || 'このサイトへのアクセスが拒否されました。'}</p>
              <a href="${req.query.url || '#'}" target="_blank" rel="noopener noreferrer" class="btn">別タブで直接開く</a>
            </div>
          </body>
        </html>
      `);
    }
  });

  // Fetch page proxy/reader endpoint
  app.post("/api/fetch-page", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: HTTP ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      
      // Use cheerio to parse and extract title and main content
      const cheerio = await import('cheerio');
      const TurndownService = await import('turndown');
      const turndownService = new TurndownService.default();

      const $ = cheerio.load(html);
      
      // Remove unwanted elements
      $('script, style, nav, footer, header, iframe, noscript').remove();

      const title = $('title').text().trim() || url;
      const mainContentEl = $('main').length ? $('main').html() : ($('article').length ? $('article').html() : $('body').html());
      
      const markdown = mainContentEl ? turndownService.turndown(mainContentEl) : 'Content could not be extracted.';

      res.json({
        url,
        title,
        markdown: markdown.slice(0, 15000), // limit size
      });
    } catch (err: any) {
      console.error("Fetch page error:", err);
      res.status(500).json({ error: err.message || "Failed to fetch page contents" });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
