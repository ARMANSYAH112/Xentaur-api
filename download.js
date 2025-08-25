import { exec } from "child_process";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Gunakan POST" });
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ success: false, message: "URL kosong" });

  // Panggil yt-dlp
  exec(`yt-dlp -g -f "best[ext=mp4]" ${url}`, (err, stdout, stderr) => {
    if (err || !stdout.trim()) {
      return res.status(500).json({ success: false, message: "Gagal ambil link", error: stderr });
    }

    res.json({
      success: true,
      download_url: stdout.trim()
    });
  });
}