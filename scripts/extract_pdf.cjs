const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const FOLDER = 'G:\\Sách giáo khoa';

async function scanAllPdfs() {
  const files = fs.readdirSync(FOLDER).filter(f => f.endsWith('.pdf'));

  for (const file of files) {
    console.log(`\n========================================`);
    console.log(`FILE: ${file}`);
    console.log(`========================================`);
    try {
      const fullPath = path.join(FOLDER, file);
      const dataBuffer = fs.readFileSync(fullPath);
      const uint8Array = new Uint8Array(dataBuffer);
      const parser = new PDFParse(uint8Array);
      const textResult = await parser.getText();

      const pages = textResult.pages || [];
      console.log(`Total Pages: ${pages.length}`);

      // Search for Table of Contents or first 10 pages text
      const previewText = pages.slice(0, 8).map((p, i) => `--- PAGE ${i + 1} ---\n${p.text}`).join('\n\n');
      console.log(previewText.slice(0, 3000));
    } catch (err) {
      console.error(`Error reading ${file}:`, err.message);
    }
  }
}

scanAllPdfs();
