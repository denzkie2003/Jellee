import { Hono } from "hono";
import { scrapeLatestChapter, scrapeLatestNovels, scrapeCompletedNovels, scrapeRankingNovels, scrapeSearchResults } from "../scrapper/novelfire.js";

const app = new Hono();

app.get("/latest-chapters", async (c) => {
  const page = c.req.query("page") || 1;
  
  try{
    const novels = await scrapeLatestChapter(page);
    return c.json({ success: true, data: novels });
  }catch(err){
    console.error(err.message);
    return c.json({ success: false, message: "Failed to fetch latest chapters!" }, 500);
  }
});
app.get("/newest-novels", async (c) => {
  const page = c.req.query("page") || 1;
  
  try{
    const novels = await scrapeLatestNovels(page);
    return c.json({ success: true, data: novels });
  }catch(err){
    console.error(err.message);
    return c.json({ success: false, message: "Failed to fetch latest chapters!" }, 500);
  }
});
app.get("/completed-novels", async (c) => {
  const page = c.req.query("page") || 1;
  
  try{
    const novels = await scrapeCompletedNovels(page);
    return c.json({ success: true, data: novels });
  }catch(err){
    console.error(err.message);
    return c.json({ success: false, message: "Failed to fetch latest chapters!" }, 500);
  }
});
app.get("/ranking", async (c) => {
  const rank = c.req.query("rank");
  
  try{
    const novels = await scrapeRankingNovels(rank);
    return c.json({ success: true, data: novels });
  }catch(err){
    console.error(err.message);
    return c.json({ success: false, message: "Failed to fetch latest chapters!" }, 500);
  }
});
app.get("/search", async (c) => {
  const s = c.req.query("s");
  
  try{
    const novels = await scrapeSearchResults(s);
    return c.json({ success: true, data: novels });
  }catch(err){
    console.error(err.message);
    return c.json({ success: false, message: "Failed to search and fetch !"+ s }, 500);
  }
});

export default app;