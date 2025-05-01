export default function deduplicateByTitleAndId(expositions) {
    const seenTitles = new Set();
    const uniqueExpos = [];
  
    for (const expo of expositions) {
      const key = expo.title.trim().toLowerCase();
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        uniqueExpos.push(expo);
      }
    }
  
    return uniqueExpos;
  }
  