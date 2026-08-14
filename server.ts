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

  // Direct Web Proxy endpoint to bypass X-Frame-Options and Content-Security-Policy
  app.get("/api/proxy", async (req, res) => {
    try {
      const targetUrl = req.query.url as string;
      if (!targetUrl) {
        return res.status(400).send("URL parameter is required");
      }

      let parsedUrl: URL;
      try {
        parsedUrl = new URL(targetUrl);
      } catch {
        return res.status(400).send("Invalid URL format");
      }

      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
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
        const baseTag = `<base href="${baseHref}">`;
        
        if (html.includes("<head>")) {
          html = html.replace("<head>", `<head>${baseTag}`);
        } else if (html.includes("<head ")) {
          html = html.replace(/<head[^>]*>/, `$&${baseTag}`);
        } else {
          html = `${baseTag}${html}`;
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
            <title>読み込みエラー</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; text-align: center; color: #333; background: #fafafa; }
              .card { background: white; max-width: 500px; margin: 40px auto; padding: 30px; border-radius: 16px; border: 1px solid #e5e5e5; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
              h2 { font-size: 20px; margin-bottom: 12px; color: #111; }
              p { font-size: 14px; color: #666; line-height: 1.6; }
              .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 10px; font-weight: 500; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>ページの読み込みに失敗しました</h2>
              <p>${err.message || 'このサイトへのアクセスが拒否されました。'}</p>
              <a href="${req.query.url}" target="_blank" rel="noopener noreferrer" class="btn">別タブで直接開く</a>
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
