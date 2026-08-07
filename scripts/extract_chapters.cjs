const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extractKeyPages() {
  try {
    const dataBuffer = fs.readFileSync('G:\\Sách giáo khoa\\1001_toan_tu_duy_lop_2_599fb_06c48.pdf');
    const uint8Array = new Uint8Array(dataBuffer);
    const parser = new PDFParse(uint8Array);
    const textResult = await parser.getText();
    const pages = textResult.pages || [];

    const pageIndices = [5, 20, 36, 50, 64, 90, 115];
    pageIndices.forEach(p => {
      console.log(`\n=================== PAGE ${p} ===================`);
      if (pages[p - 1]) {
        console.log(pages[p - 1].text.slice(0, 1500));
      }
    });
  } catch (err) {
    console.error(err);
  }
}

extractKeyPages();
