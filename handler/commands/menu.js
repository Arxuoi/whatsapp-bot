const config = require('../../config');

const menuCommand = {
  showMenu: async ({ sock, sender, usedPrefix, msg }) => {
    const menuText = `
╔══════════════════════════════════════╗
║     🤖 *${config.botName}*              ║
║     WhatsApp Multi Fitur Bot         ║
╚══════════════════════════════════════╝

👤 *Owner:* ${config.ownerName}
⏰ *Waktu:* ${new Date().toLocaleString('id-ID', { timeZone: config.timezone })}
🔧 *Prefix:* ${config.prefix.join(', ')}

📋 *DAFTAR FITUR*

🤖 *AI (Artificial Intelligence)*
├ ${usedPrefix}ai <teks> - Chat dengan AI
├ ${usedPrefix}chatgpt <teks> - ChatGPT-4.1 Nano
└ ${usedPrefix}gpt <teks> - Alias AI

🎨 *Generator*
├ ${usedPrefix}brat <teks> - Buat gambar brat
└ ${usedPrefix}bratgen <teks> - Alias brat

📥 *Downloader*
├ ${usedPrefix}dl <url> - All-in-One Downloader
├ ${usedPrefix}download <url> - Alias dl
├ ${usedPrefix}aio <url> - Alias downloader
└ ${usedPrefix}aiodl <url> - Alias downloader

*Supported URL:*
• YouTube (Video/Music)
• TikTok (Video/Gambar)
• Instagram (Reels/Post)
• Facebook (Video)
• Twitter/X (Video)

🔍 *Search*
├ ${usedPrefix}pinterest <query> - Cari gambar Pinterest
├ ${usedPrefix}pin <query> - Alias pinterest
├ ${usedPrefix}wiki <query> - Cari Wikipedia
└ ${usedPrefix}wikipedia <query> - Alias wiki

ℹ️ *Info*
├ ${usedPrefix}menu - Tampilkan menu ini
├ ${usedPrefix}help - Alias menu
├ ${usedPrefix}ping - Cek status bot
└ ${usedPrefix}owner - Info owner

╔══════════════════════════════════════╗
║  💡 *Tips:* Gunakan fitur dengan bijak ║
║  📞 Hubungi owner jika ada masalah     ║
╚══════════════════════════════════════╝
`;

    await sock.sendMessage(sender, {
      text: menuText
    }, { quoted: msg });
  }
};

module.exports = menuCommand;
