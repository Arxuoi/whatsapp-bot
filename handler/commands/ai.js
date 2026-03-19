const axios = require('axios');
const config = require('../../config');

const aiCommand = {
  // ChatGPT-4
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
        `${config.baseUrl}/ai/chat4?messages=${encodeURIComponent(text)}&prompt=&apikey=${config.apikey}`
      );

      console.log('AI Response:', JSON.stringify(response.data, null, 2));

      let aiResponse = '';

      if (response.data) {
        // Handle different response formats
        if (typeof response.data === 'string') {
          aiResponse = response.data;
        } else if (response.data.result) {
          if (typeof response.data.result === 'string') {
            aiResponse = response.data.result;
          } else if (typeof response.data.result === 'object') {
            aiResponse = response.data.result.message 
                      || response.data.result.response 
                      || response.data.result.text 
                      || response.data.result.answer
                      || response.data.result.content
                      || JSON.stringify(response.data.result);
          }
        } else if (response.data.message) {
          aiResponse = response.data.message;
        } else if (response.data.response) {
          aiResponse = response.data.response;
        } else if (response.data.data) {
          aiResponse = typeof response.data.data === 'string' 
                     ? response.data.data 
                     : JSON.stringify(response.data.data);
        } else if (response.data.content) {
          aiResponse = response.data.content;
        } else if (response.data.text) {
          aiResponse = response.data.text;
        } else if (response.data.answer) {
          aiResponse = response.data.answer;
        } else {
          aiResponse = JSON.stringify(response.data);
        }
      }

      if (aiResponse && aiResponse !== '{}' && aiResponse !== 'null') {
        await sock.sendMessage(sender, {
          text: `🤖 *ChatGPT-4*\n\n${aiResponse}`
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
