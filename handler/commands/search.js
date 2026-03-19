const axios = require('axios');
const config = require('../../config');

const searchCommand = {
  // Pinterest Search
  pinterest: async ({ sock, sender, text, msg }) => {
    try {
      if (!text) {
        return await sock.sendMessage(sender, {
          text: '❌ *Format salah!*\n\nContoh: !pinterest anime wallpaper'
        }, { quoted: msg });
      }

      await sock.sendMessage(sender, {
        text: '🔍 Sedang mencari di Pinterest...'
      });

      const response = await axios.get(
        `${config.baseUrl}/search/pinterest?query=${encodeURIComponent(text)}&apikey=${config.apikey}`
      );

      const data = response.data;

      if (data.status && data.result && data.result.length > 0) {
        // Send first 5 results
        const results = data.result.slice(0, 5);
        
        await sock.sendMessage(sender, {
          text: `✅ *Pinterest Search*\n🔍 Query: ${text}\n📊 Ditemukan: ${data.result.length} hasil\n\nMengirim ${results.length} gambar...`
        });

        for (let i = 0; i < results.length; i++) {
          const item = results[i];
          try {
            await sock.sendMessage(sender, {
              image: { url: item.image },
              caption: `📌 *${item.title || 'No Title'}*\n\n🔗 ${item.source || ''}`
            });
          } catch (e) {
            console.log('Error sending image:', e.message);
          }
        }

      } else {
        await sock.sendMessage(sender, {
          text: '❌ Tidak ditemukan hasil untuk pencarian tersebut.'
        }, { quoted: msg });
      }

    } catch (error) {
      console.error('Pinterest Error:', error);
      await sock.sendMessage(sender, {
        text: '❌ Terjadi kesalahan saat mencari di Pinterest.'
      }, { quoted: msg });
    }
  },

  // Wikipedia Search
  wikipedia: async ({ sock, sender, text, msg }) => {
    try {
      if (!text) {
        return await sock.sendMessage(sender, {
          text: '❌ *Format salah!*\n\nContoh: !wiki Indonesia'
        }, { quoted: msg });
      }

      await sock.sendMessage(sender, {
        text: '🔍 Sedang mencari di Wikipedia...'
      });

      // Using a simple Wikipedia API
      const response = await axios.get(
        `https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(text)}`
      );

      const data = response.data;

      if (data && data.extract) {
        let result = `📚 *Wikipedia*\n\n`;
        result += `*${data.title}*\n\n`;
        result += `${data.extract}\n\n`;
        if (data.content_urls?.desktop?.page) {
          result += `🔗 Baca selengkapnya: ${data.content_urls.desktop.page}`;
        }

        // Send thumbnail if available
        if (data.thumbnail?.source) {
          await sock.sendMessage(sender, {
            image: { url: data.thumbnail.source },
            caption: result
          }, { quoted: msg });
        } else {
          await sock.sendMessage(sender, {
            text: result
          }, { quoted: msg });
        }

      } else {
        await sock.sendMessage(sender, {
          text: '❌ Artikel tidak ditemukan di Wikipedia.'
        }, { quoted: msg });
      }

    } catch (error) {
      console.error('Wiki Error:', error);
      await sock.sendMessage(sender, {
        text: '❌ Terjadi kesalahan saat mencari di Wikipedia.'
      }, { quoted: msg });
    }
  }
};

module.exports = searchCommand;
