const axios = require('axios');
const config = require('../../config');

const aiCommand = {
  // ChatGPT-4.1 Nano
  chatGPT: async ({ sock, sender, text, msg }) => {
    try {
      if (!text) {
        return await sock.sendMessage(sender, {
          text: '❌ *Format salah!*\n\nContoh: !ai halo, apa kabar?'
        }, { quoted: msg });
      }

      await sock.sendMessage(sender, {
        text: '⏳ Sedang memproses...'
      });

      const response = await axios.get(
        `${config.baseUrl}/ai/chatgpt-4.1-nano?query=${encodeURIComponent(text)}&apikey=${config.apikey}`
      );

      if (response.data && response.data.result) {
        await sock.sendMessage(sender, {
          text: `🤖 *ChatGPT-4.1 Nano*\n\n${response.data.result}`
        }, { quoted: msg });
      } else {
        await sock.sendMessage(sender, {
          text: '❌ Gagal mendapatkan respons dari AI.'
        }, { quoted: msg });
      }

    } catch (error) {
      console.error('AI Error:', error);
      await sock.sendMessage(sender, {
        text: '❌ Terjadi kesalahan saat memproses permintaan AI.'
      }, { quoted: msg });
    }
  }
};

module.exports = aiCommand;
