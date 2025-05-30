import { createClient } from '@supabase/supabase-js';
import TelegramBot from 'node-telegram-bot-api';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/reply (\S+) (.+)/, async (msg, match) => {
  const suggestionId = match[1];
  const replyContent = match[2];

  // Update ke Supabase
  const { error } = await supabase
    .from('suggestions')
    .update({
      is_read: true,
      reply: replyContent,
      replied_at: new Date().toISOString()
    })
    .eq('id', suggestionId);

  if (error) {
    bot.sendMessage(msg.chat.id, `❌ Gagal update: ${error.message}`);
  } else {
    bot.sendMessage(msg.chat.id, `✅ Balasan berhasil disimpan untuk ID: ${suggestionId}`);
  }
});

console.log('Bot Telegram berjalan...');
