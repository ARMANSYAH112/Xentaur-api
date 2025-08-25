import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Gunakan POST" });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: "URL kosong" });
  }

  try {
    let apiUrl;

    if (url.includes("tiktok.com")) {
      apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    } else if (url.includes("instagram.com")) {
      apiUrl = `https://snapinsta.app/api/?url=${encodeURIComponent(url)}`;
    } else if (url.includes("twitter.com") || url.includes("x.com")) {
      apiUrl = `https://twdown.net/api/?url=${encodeURIComponent(url)}`;
    } else if (url.includes("snackvideo.com")) {
      apiUrl = `https://api.savetube.me/snackvideo?url=${encodeURIComponent(url)}`;
    } else {
      return res.status(400).json({ success: false, message: "Platform tidak didukung" });
    }

    const r = await fetch(apiUrl);
    const data = await r.json();

    // ambil direct link video dari response API pihak ketiga
    const videoUrl = data?.data?.play || data?.videoUrl || data?.download || null;

    if (!videoUrl) throw new Error("Tidak ada link video");

    res.status(200).json({
      success: true,
      download_url: videoUrl
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal ambil video",
      error: err.message
    });
  }
}
