// Đồng bộ PDF SGK từ thư mục Downloads vào public/textbooks/.
//
// Cách dùng:  node scripts/copy-textbooks.cjs
//
// Quét thư mục Downloads + G:\Sách giáo khoa tìm 10 quyển SGK Lớp 2 & Lớp 8
// (chương trình mới 2026) và chép sang public/textbooks/ với tên chuẩn khớp
// với src/lib/textbookPdfs.js:
//   tv2-tap1.pdf  tv2-tap2.pdf  toan2-tap1.pdf  toan2-tap2.pdf
//   van8-tap1.pdf van8-tap2.pdf toan8-tap1.pdf  toan8-tap2.pdf
//   anh8-sgk.pdf  anh8-sbt.pdf
const fs = require('node:fs')
const path = require('node:path')

// Các nơi có thể chứa PDF SGK: Downloads và ổ G (thư mục sách tải riêng)
const SEARCH_DIRS = [
  path.join(require('node:os').homedir(), 'Downloads'),
  'G:\\Sách giáo khoa',
]
const OUT_DIR = path.join(__dirname, '..', 'public', 'textbooks')

const PDF_PATTERNS = [
  { name: 'tv2-tap1.pdf',  re: /sgk[-\s]?tieng[-\s]?viet.*2.*tap[-\s]?1/i },
  { name: 'tv2-tap2.pdf',  re: /sgk[-\s]?tieng[-\s]?viet.*2.*tap[-\s]?2/i },
  { name: 'toan2-tap1.pdf', re: /sgk[-\s]?toan.*2.*tap[-\s]?1/i },
  { name: 'toan2-tap2.pdf', re: /sgk[-\s]?toan.*2.*tap[-\s]?2/i },
  { name: 'van8-tap1.pdf', re: /sgk[-\s]?(?:ngu[-\s]?van|van).*8.*tap[-\s]?1/i },
  { name: 'van8-tap2.pdf', re: /sgk[-\s]?(?:ngu[-\s]?van|van).*8.*tap[-\s]?2/i },
  { name: 'toan8-tap1.pdf', re: /sgk[-\s]?toan.*8.*tap[-\s]?1/i },
  { name: 'toan8-tap2.pdf', re: /sgk[-\s]?toan.*8.*tap[-\s]?2/i },
  { name: 'anh8-sgk.pdf', re: /sgk.*tiếng[-\s]?anh.*8/i },
  { name: 'anh8-sbt.pdf', re: /bài[-\s]?tập.*tiếng[-\s]?anh.*8/i },
]

function collectPdfs(dir, out = []) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) collectPdfs(full, out)
    else if (e.name.toLowerCase().endsWith('.pdf')) out.push(full)
  }
  return out
}

function main() {
  const missingDirs = SEARCH_DIRS.filter(d => !fs.existsSync(d))
  if (missingDirs.length === SEARCH_DIRS.length) {
    console.error(`❌ Không tìm thấy thư mục nào trong: ${SEARCH_DIRS.join(', ')}`)
    process.exit(1)
  }
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const all = SEARCH_DIRS.flatMap(d => collectPdfs(d))
  const matched = new Set()
  for (const p of PDF_PATTERNS) {
    const src = all.find(f => p.re.test(path.basename(f)))
    if (!src) {
      console.warn(`⚠️  Không tìm thấy file cho ${p.name} (cần file khớp: ${p.re})`)
      continue
    }
    matched.add(src)
    const dest = path.join(OUT_DIR, p.name)
    fs.copyFileSync(src, dest)
    const mb = (fs.statSync(src).size / 1024 / 1024).toFixed(2)
    console.log(`✅ ${p.name}  ←  ${path.basename(src)}  (${mb} MB)`)
  }

  const list = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.pdf'))
  console.log(`\n📁 public/textbooks/ (${list.length} file, ${(list.reduce((a, f) => a + fs.statSync(path.join(OUT_DIR, f)).size, 0) / 1024 / 1024).toFixed(1)} MB)`)
  if (matched.size < PDF_PATTERNS.length) {
    console.warn('\n⚠️  Chưa đủ 8 quyển. Hãy tải đủ SGK Lớp 2 & Lớp 8 (Tiếng Việt/Ngữ văn & Toán, Tập 1 & 2) về Downloads rồi chạy lại.')
  }
}

main()
