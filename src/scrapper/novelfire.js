import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://novelfire.net/";
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Referer': 'https://novelfire.net/'
};

export async function scrapeLatestChapter(page){
  const url = `${BASE_URL}latest-release-novels?page=${page}`;
  
  try{
    const { data: html } = await axios.get(url, { headers: HEADERS });
    const $ = cheerio.load(html);
    const novels = [];
    
    $(".novel-list li").each((i, element) => {
      const id =
        $(element).find("div.cover-wrap a").attr("href").split("/").pop() || "";
      const poster = $(element).find(".novel-cover img").attr("data-src") || "";
      const itemBody = $(element).find(".item-body a");
      const title = itemBody.find("h4.novel-title").text().trim() || "";
      const chapter = itemBody.find("h5.chapter-title").text().trim() || "";
      const chapterId = itemBody.eq(1).attr("href").replace("https://novelfire.net/book/","");

      novels.push({ id, poster, title, chapter, chapterId });
    });
    return novels;
  }catch(err){
    console.log(`Failed to scrape data from ${BASE_URL}: ${err.message}`);
    throw new Error(`Failed to scrape data from ${BASE_URL}`);
  }
  
}

export async function scrapeLatestNovels(page){
  const url = `${BASE_URL}genre-all/sort-new/status-all/all-novel?page=${page}`;
  try{
    const { data: html } = await axios.get(url, { headers: HEADERS });
    const $ = cheerio.load(html);
    const novels = [];
    
    $(".novel-list li").each((i, element) => {
      const id =
        $(element).find("a").first().attr("href").split("/").pop() || "";
      const poster = $(element).find("img").attr("data-src") || "";
      const title = $(element).find("h4").text().trim() || "";

      novels.push({ id, poster, title });
    });
    return novels;
  }catch(err){
    console.log(`Failed to scrape data from ${BASE_URL}: ${err.message}`);
    throw new Error(`Failed to scrape data from ${BASE_URL}`);
  }
}

export async function scrapeCompletedNovels(page){
  const url = `${BASE_URL}genre-all/sort-new/status-completed/all-novel?page=${page}`;
  try{
    const { data: html } = await axios.get(url, { headers: HEADERS });
    const $ = cheerio.load(html);
    const novels = [];
    
    $(".novel-list li").each((i, element) => {
      const id =
        $(element).find("a").first().attr("href").split("/").pop() || "";
      const poster = $(element).find("img").attr("data-src") || "";
      const title = $(element).find("h4").text().trim() || "";

      novels.push({ id, poster, title });
    });
    return novels;
  }catch(err){
    console.log(`Failed to scrape data from ${BASE_URL}: ${err.message}`);
    throw new Error(`Failed to scrape data from ${BASE_URL}`);
  }
}

export async function scrapeRankingNovels(ranking) {
  const url = `${BASE_URL}${ranking}`;
  
  try {
    const { data: html } = await axios.get(url, { headers: HEADERS });
    const $ = cheerio.load(html);
    const novels = [];

    // Loop through each novel item
    $(".rank-novels li").each((i, element) => {
      // Extract rank number (assumes it's the index + 1)
      const rank = i + 1;

      const id = $(element).find(".cover-wrap a").attr("href").split("/").pop() || "";
      
      const poster = $(element).find(".cover-wrap img").attr("data-src") || "";

      // Extract title
      const title = $(element).find(".title a").text().trim() || "";

      // Extract views
      const viewsText = $(element)
        .find(".numberOf")
        .text()
        .trim()
        .match(/(\d+(,\d+)*)/); // Extract numeric value
      const views = viewsText ? viewsText[0].replace(/,/g, "") : "0";

      // Extract status (e.g., Ongoing, Completed)
      const status = $(element).find(".status-group .status").text().trim() || "";

      // Extract genres (multiple <span> elements)
      const genres = [];
      $(element).find(".categories .scroll span").each((j, genreElement) => {
        genres.push($(genreElement).text().trim());
      });

      // Push data into novels array
      novels.push({
        id,
        rank,
        poster,
        title,
        views,
        status,
        genres,
      });
    });

    return novels;
  } catch (err) {
    console.log(`Failed to scrape data from ${BASE_URL}: ${err.message}`);
    throw new Error(`Failed to scrape data from ${BASE_URL}`);
  }
}

export async function scrapeSearchResults(searchTerm) {
  if (searchTerm.length < 3) {
    throw new Error("Search term must be at least 3 characters long.");
  }

  const url = `${BASE_URL}ajax/searchLive`;

  try {
    // Make the GET request
    const { data } = await axios.get(url, {
      params: { inputContent: searchTerm }, headers: HEADERS
    });

    // Load the response HTML into cheerio
    const $ = cheerio.load(data.html);

    const results = [];

    // Parse the novel search results
   $(".novel-item").each((i, element) => {
     const id = $(element).find("a").first().attr("href").split("/").pop() || "";
      const title = $(element).find("h4").text().trim() || "";
      const poster = $(element).find("img").attr("src") || "";

      results.push({
        id,
        title,
        poster
      });
    });

    return results;
  } catch (err) {
    console.error(`Failed to fetch search results: ${err.message}`);
    throw new Error("Failed to scrape search results.");
  }
}