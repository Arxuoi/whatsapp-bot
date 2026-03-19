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
      console.log('Pinterest Response:', JSON.stringify(data, null, 2));

      // API returns: { success: true, result: ["url1", "url2", ...] }
      if (data.success && data.result && Array.isArray(data.result) && data.result.length > 0) {
        // Send first 5 results
        const results = data.result.slice(0, 5);
        
        await sock.sendMessage(sender, {
          text: `✅ *Pinterest Search*\n🔍 Query: ${text}\n📊 Ditemukan: ${data.result.length} hasil\n\nMengirim ${results.length} gambar...`
        });

        for (let i = 0; i < results.length; i++) {
          const imageUrl = results[i];
          try {
            await sock.sendMessage(sender, {
              image: { url: imageUrl },
              caption: `📌 *Hasil ${i + 1}*`
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
      console.error('Pinterest Error:', error.message);
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

      // Using Wikipedia API with timeout
      const response = await axios.get(
        `https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(text)}`,
        { timeout: 15000 }
      );

      const data = response.data;
      console.log('Wiki Response:', JSON.stringify(data, null, 2));

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
      console.error('Wiki Error:', error.message);
      
      // Fallback: use search instead of direct page
      try {
        const searchResponse = await axios.get(
          `https://id.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(text)}&format=json&origin=*`,
          { timeout: 10000 }
        );
        
        const searchResults = searchResponse.data.query?.search;
        if (searchResults && searchResults.length > 0) {
          let resultText = `📚 *Wikipedia Search: ${text}*\n\n`;
          searchResults.slice(0, 5).forEach((item, i) => {
            const snippet = item.snippet.replace(/<[^>]*>/g, '');
            resultText += `${i + 1}. *${item.title}*\n${snippet}...\n\n`;
          });
          resultText += `🔗 https://id.wikipedia.org/wiki/${encodeURIComponent(searchResults[0].title.replace(/ /g, '_'))}`;
          
          await sock.sendMessage(sender, {
            text: resultText
          }, { quoted: msg });
        } else {
          await sock.sendMessage(sender, {
            text: '❌ Artikel tidak ditemukan di Wikipedia.'
          }, { quoted: msg });
        }
      } catch (fallbackError) {
        await sock.sendMessage(sender, {
          text: '❌ Terjadi kesalahan saat mencari di Wikipedia.'
        }, { quoted: msg });
      }
    }
  }
};

module.exports = searchCommand;
