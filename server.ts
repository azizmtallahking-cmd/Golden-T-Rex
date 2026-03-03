import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const TELEGRAM_TOKEN = "8620381706:AAF2MPr-M-I0aSBdDbGTZTpG6dFM3IW0_RM";
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Database setup
const db = new Database("golden_trex.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER,
    chat_name TEXT,
    sender_name TEXT,
    sender_id INTEGER,
    text TEXT,
    date INTEGER,
    message_id INTEGER UNIQUE,
    media_type TEXT,
    media_url TEXT,
    reply_to_id INTEGER,
    reply_to_text TEXT,
    forward_from_name TEXT,
    is_outgoing INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS chats (
    chat_id INTEGER PRIMARY KEY,
    name TEXT,
    type TEXT,
    last_message_date INTEGER,
    photo_url TEXT,
    can_send_messages INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  INSERT OR IGNORE INTO settings (key, value) VALUES ('telegram_token', '8620381706:AAF2MPr-M-I0aSBdDbGTZTpG6dFM3IW0_RM');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('auto_sync', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('theme', 'dark_gold');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('app_name', 'Golden T-Rex');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('app_secondary_color', '#1a1a1a');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('perf_gold', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('auto_refresh', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('notify_private', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('notify_groups', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('notify_channels', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('notify_sound', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('power_save', 'false');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('anim_stickers', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('anim_bg', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('anim_effects', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('language', 'ar');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('proxy_gold', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('auto_reconnect', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('fast_connect', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('premium_images', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('premium_videos', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('premium_audio', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('premium_forward', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('premium_forward_ext', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('premium_resend', 'true');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('premium_links', 'true');
`);

// Helper to get current token
function getTelegramToken() {
  return TELEGRAM_TOKEN;
}

function getTelegramApi() {
  return TELEGRAM_API;
}

// Simple migration to add missing columns if they don't exist
const migrate = () => {
  const columns = [
    { name: "sender_id", type: "INTEGER" },
    { name: "reply_to_id", type: "INTEGER" },
    { name: "reply_to_text", type: "TEXT" },
    { name: "forward_from_name", type: "TEXT" },
    { name: "is_outgoing", type: "INTEGER DEFAULT 0" }
  ];

  for (const col of columns) {
    try {
      db.exec(`ALTER TABLE messages ADD COLUMN ${col.name} ${col.type}`);
      console.log(`Added column ${col.name} to messages table`);
    } catch (e: any) {
      if (!e.message.includes("duplicate column name")) {
        console.error(`Migration error for ${col.name}:`, e.message);
      }
    }
  }
};
migrate();

app.use(express.json());

let botInfoCache: any = null;
let lastTokenUsed: string | null = null;

async function getBotInfo() {
  const currentToken = getTelegramToken();
  if (botInfoCache && lastTokenUsed === currentToken) {
    return botInfoCache;
  }

  try {
    const response = await axios.get(`${getTelegramApi()}/getMe`);
    botInfoCache = response.data.result;
    lastTokenUsed = currentToken;
    console.log(`Bot initialized: @${botInfoCache.username} (${botInfoCache.id})`);
    return botInfoCache;
  } catch (e: any) {
    const errorData = e.response?.data;
    if (e.response?.status === 401 || e.response?.status === 404) {
      console.error("FATAL: Telegram Bot Token is invalid or expired! (401/404)");
    } else {
      console.error("Failed to fetch bot info:", errorData || e.message);
    }
    botInfoCache = null;
    return null;
  }
}

// Initial bot validation
getBotInfo();

// API Routes
app.get("/api/me", async (req, res) => {
  const info = await getBotInfo();
  if (info) {
    const customPhoto = db.prepare("SELECT value FROM settings WHERE key = 'bot_custom_photo'").get();
    res.json({ ...info, custom_photo_url: customPhoto?.value || null });
  }
  else res.status(500).json({ error: "Failed to fetch bot info" });
});

app.post("/api/bot/photo", express.json({ limit: '10mb' }), (req, res) => {
  const { photo_url } = req.body;
  if (!photo_url) return res.status(400).json({ error: "Photo URL is required" });
  
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('bot_custom_photo', ?)").run(photo_url);
  res.json({ success: true });
});

app.delete("/api/bot/photo", (req, res) => {
  db.prepare("DELETE FROM settings WHERE key = 'bot_custom_photo'").run();
  res.json({ success: true });
});

app.get("/api/chats", (req, res) => {
  const chats = db.prepare("SELECT * FROM chats ORDER BY last_message_date DESC").all();
  res.json(chats);
});

app.get("/api/messages/:chatId", (req, res) => {
  const messages = db.prepare("SELECT * FROM messages WHERE chat_id = ? ORDER BY date ASC").all(req.params.chatId);
  res.json(messages);
});

app.get("/api/settings", (req, res) => {
  const settings = db.prepare("SELECT * FROM settings").all();
  const settingsObj = settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  res.json(settingsObj);
});

app.post("/api/settings", (req, res) => {
  const { settings } = req.body;
  const update = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
  const transaction = db.transaction((items) => {
    for (const [key, value] of Object.entries(items)) {
      // Prevent changing the token via API
      if (key === 'telegram_token') continue;
      update.run(key, String(value));
    }
  });
  transaction(settings);
  
  // Restart polling if it was suspended
  if (!isPolling) {
    pollTelegram();
  }
  
  res.json({ success: true });
});

app.post("/api/messages/clear", (req, res) => {
  db.prepare("DELETE FROM messages").run();
  res.json({ success: true });
});

app.post("/api/messages/clear/:chatId", (req, res) => {
  db.prepare("DELETE FROM messages WHERE chat_id = ?").run(req.params.chatId);
  res.json({ success: true });
});

app.delete("/api/chats/:chatId", (req, res) => {
  db.prepare("DELETE FROM chats WHERE chat_id = ?").run(req.params.chatId);
  db.prepare("DELETE FROM messages WHERE chat_id = ?").run(req.params.chatId);
  res.json({ success: true });
});

// Proxy for Telegram Photos
app.get("/api/photo/:fileId", async (req, res) => {
  try {
    const token = getTelegramToken();
    const api = getTelegramApi();
    const fileResponse = await axios.get(`${api}/getFile`, {
      params: { file_id: req.params.fileId }
    });
    const filePath = fileResponse.data.result.file_path;
    const photoUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
    
    const imageResponse = await axios.get(photoUrl, { responseType: 'arraybuffer' });
    res.set('Content-Type', imageResponse.headers['content-type']);
    res.send(imageResponse.data);
  } catch (error) {
    res.status(404).send("Not found");
  }
});

app.post("/api/chats/add", async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ error: "Identifier is required" });

  // Clean the identifier
  let cleanId = identifier.trim();
  
  // Handle full URLs
  if (cleanId.includes("t.me/")) {
    // Handle private channel links like t.me/c/123456789/1
    if (cleanId.includes("t.me/c/")) {
      const parts = cleanId.split("t.me/c/")[1].split("/");
      cleanId = "-100" + parts[0];
    } else {
      cleanId = cleanId.split("t.me/")[1];
    }
  }
  
  // Remove @ and any trailing slashes or query params
  cleanId = cleanId.replace("@", "").split("/")[0].split("?")[0];
  
  if (!cleanId) {
    return res.status(400).json({ error: "Invalid identifier", details: "The provided link or username is empty or invalid." });
  }
  const isNumeric = /^-?\d+$/.test(cleanId);
  const chatIdParam = isNumeric ? cleanId : `@${cleanId}`;

  try {
    const api = getTelegramApi();
    const response = await axios.get(`${api}/getChat`, {
      params: { chat_id: chatIdParam }
    });
    
    if (!response.data.ok) {
      throw new Error(response.data.description || "Telegram API error");
    }

    const chat = response.data.result;
    const chatName = chat.title || chat.first_name || chat.username || cleanId;
    const chatId = chat.id;
    const date = Math.floor(Date.now() / 1000);
    
    // Check bot permissions in the chat
    let canSend = 1;
    try {
      const botInfo = await getBotInfo();
      if (botInfo) {
        const memberResponse = await axios.get(`${getTelegramApi()}/getChatMember`, {
          params: { chat_id: chatId, user_id: botInfo.id }
        });
        
        const member = memberResponse.data.result;
        const status = member.status;
        
        if (chat.type === 'channel') {
          // In channels, only admins can post
          canSend = (status === 'administrator' || status === 'creator') ? 1 : 0;
        } else if (chat.type === 'group' || chat.type === 'supergroup') {
          // In groups, check if restricted
          if (status === 'restricted' && member.can_send_messages === false) {
            canSend = 0;
          } else if (status === 'left' || status === 'kicked') {
            canSend = 0;
          }
        }
      }
    } catch (e: any) {
      // If getChatMember fails, it usually means the bot isn't in the chat or it's a private chat
      // We'll default to 1 for private chats and 0 for others if we can't verify
      if (chat.type === 'private') {
        canSend = 1;
      } else {
        console.warn(`Could not fetch bot permissions for ${chatId}, defaulting to 0 for non-private chat:`, e.response?.data || e.message);
        canSend = 0; 
      }
    }

    let photoUrl = null;
    if (chat.photo) {
      photoUrl = chat.photo.small_file_id;
    }

    db.prepare(`
      INSERT INTO chats (chat_id, name, type, last_message_date, photo_url, can_send_messages)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(chat_id) DO UPDATE SET 
        last_message_date = ?, 
        name = ?, 
        photo_url = ?, 
        can_send_messages = ?
    `).run(chatId, chatName, chat.type, date, photoUrl, canSend, date, chatName, photoUrl, canSend);

    res.json({ success: true, chat: { chat_id: chatId, name: chatName } });
  } catch (error: any) {
    const errorData = error.response?.data;
    console.error("Error adding chat:", errorData || error.message);
    
    let description = errorData?.description || error.message || "Could not find chat.";
    let userFriendlyError = "Chat not found";

    if (errorData?.error_code === 400) {
      if (description.includes("chat not found")) {
        description = "The bot cannot find this chat. Make sure:\n1. The ID/Username is correct.\n2. For groups/channels: The bot is a member of the chat.\n3. For private users: The user has started the bot first.";
      } else if (description.includes("PEER_ID_INVALID")) {
        description = "Invalid ID format. Use a numeric ID (e.g., -100123456789) or a public username (e.g., @username).";
      }
    } else if (errorData?.error_code === 401) {
      userFriendlyError = "Unauthorized";
      description = "The Telegram Bot Token is invalid or expired.";
    }

    res.status(400).json({ 
      error: userFriendlyError, 
      details: description 
    });
  }
});

app.post("/api/send", async (req, res) => {
  const { chat_id, text } = req.body;
  try {
    const response = await axios.post(`${getTelegramApi()}/sendMessage`, {
      chat_id,
      text,
    });
    
    const msg = response.data.result;
    const botInfo = await getBotInfo();
    
    // Optimistically save to DB as outgoing
    try {
      db.prepare(`
        INSERT OR IGNORE INTO messages (
          chat_id, chat_name, sender_name, sender_id, text, date, message_id, is_outgoing
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        msg.chat.id, 
        msg.chat.title || msg.chat.first_name || "Me", 
        botInfo?.first_name || "Me", 
        botInfo?.id || 0, 
        msg.text, 
        msg.date, 
        msg.message_id, 
        1
      );
    } catch (dbErr) {
      console.error("Failed to optimistically save message:", dbErr);
    }

    res.json(response.data);
  } catch (error: any) {
    const errorData = error.response?.data || {};
    console.error("Error sending message:", errorData);
    const status = error.response?.status || 500;
    const errorMessage = errorData.description || "Failed to send message";
    
    // Specifically handle 403 Forbidden
    if (status === 403) {
      return res.status(403).json({ 
        error: "Forbidden: Bot cannot send messages here.",
        details: "The bot might have been kicked, blocked, or doesn't have permission to post in this channel/group."
      });
    }
    
    res.status(status).json({ error: errorMessage });
  }
});

// Telegram Polling Logic
let lastUpdateId = 0;
let isPolling = false;

async function pollTelegram(force = false) {
  const settings = db.prepare("SELECT * FROM settings").all();
  const settingsObj = settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  if (settingsObj.auto_sync !== 'true' && !force) {
    isPolling = false;
    setTimeout(() => pollTelegram(), 5000);
    return;
  }

  // Performance Gold: Reduce polling delay
  const pollingDelay = settingsObj.perf_gold === 'true' ? 300 : 1000;

  if (isPolling && !force) return;
  isPolling = true;
  
  try {
    const api = getTelegramApi();
    const token = getTelegramToken();
    
    // Basic validation: token should contain a colon
    if (!token || !token.includes(":")) {
      console.warn("Telegram Token is missing or malformed. Polling suspended.");
      isPolling = false;
      return;
    }

    const response = await axios.get(`${api}/getUpdates`, {
      params: { offset: lastUpdateId + 1, timeout: force ? 0 : 30, limit: 100 },
    });

    if (response.data.result.length > 0) {
      for (const update of response.data.result) {
        lastUpdateId = update.update_id;
        const msg = update.message || update.channel_post || update.edited_message || update.edited_channel_post;
        if (!msg) continue;

        // Filter by notification settings
        const isPrivate = msg.chat.type === 'private';
        const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';
        const isChannel = msg.chat.type === 'channel';

        if (isPrivate && settingsObj.notify_private !== 'true') continue;
        if (isGroup && settingsObj.notify_groups !== 'true') continue;
        if (isChannel && settingsObj.notify_channels !== 'true') continue;

        const chatId = msg.chat.id;
        const chatName = msg.chat.title || msg.chat.first_name || msg.chat.username || "Unknown Chat";
        const senderName = msg.from?.first_name || (msg.chat.type === 'channel' ? msg.chat.title : "System");
        const senderId = msg.from?.id || 0;
        const text = msg.text || msg.caption || "";
        const date = msg.date;
        const messageId = msg.message_id;

        // Identify outgoing
        let isOutgoing = 0;
        const botInfo = await getBotInfo();
        if (botInfo && senderId === botInfo.id) {
          isOutgoing = 1;
        }

        // Handle Replies
        let replyToId = null;
        let replyToText = null;
        if (msg.reply_to_message) {
          replyToId = msg.reply_to_message.message_id;
          replyToText = msg.reply_to_message.text || msg.reply_to_message.caption || "Media";
        }

        // Handle Forwards
        let forwardFromName = null;
        if (msg.forward_from) {
          forwardFromName = msg.forward_from.first_name || msg.forward_from.username;
        } else if (msg.forward_from_chat) {
          forwardFromName = msg.forward_from_chat.title || msg.forward_from_chat.username;
        }

        // Handle media
        let mediaType = null;
        let mediaUrl = null;
        if (msg.photo) {
          mediaType = "photo";
          mediaUrl = msg.photo[msg.photo.length - 1].file_id;
        } else if (msg.video) {
          mediaType = "video";
          mediaUrl = msg.video.file_id;
        } else if (msg.audio) {
          mediaType = "audio";
          mediaUrl = msg.audio.file_id;
        } else if (msg.voice) {
          mediaType = "voice";
          mediaUrl = msg.voice.file_id;
        } else if (msg.document) {
          mediaType = "document";
          mediaUrl = msg.document.file_id;
        } else if (msg.sticker) {
          mediaType = "sticker";
          mediaUrl = msg.sticker.file_id;
        } else if (msg.video_note) {
          mediaType = "video_note";
          mediaUrl = msg.video_note.file_id;
        } else if (msg.animation) {
          mediaType = "animation";
          mediaUrl = msg.animation.file_id;
        }

        // Save message
        try {
          db.prepare(`
            INSERT OR IGNORE INTO messages (
              chat_id, chat_name, sender_name, sender_id, text, date, message_id, 
              media_type, media_url, reply_to_id, reply_to_text, forward_from_name, is_outgoing
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(chatId, chatName, senderName, senderId, text, date, messageId, mediaType, mediaUrl, replyToId, replyToText, forwardFromName, isOutgoing);

          // Update chat list
          db.prepare(`
            INSERT INTO chats (chat_id, name, type, last_message_date)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(chat_id) DO UPDATE SET last_message_date = ?, name = ?
          `).run(chatId, chatName, msg.chat.type, date, date, chatName);
        } catch (e) {
          console.error("DB Error:", e);
        }
      }
      
      // If we got 100 updates, there might be more, poll again immediately
      if (response.data.result.length === 100) {
        isPolling = false;
        return pollTelegram(true);
      }
    }
  } catch (error: any) {
    const status = error.response?.status;
    const errorData = error.response?.data;
    
    if (status === 404) {
      console.error("Polling error: Invalid Token (404). Polling suspended until settings update.");
      isPolling = false;
      // Don't reschedule automatically if it's a 404
      return;
    }
    
    console.error("Polling error:", errorData || error.message);
  }
  
  isPolling = false;
  if (!force) setTimeout(() => pollTelegram(), pollingDelay);
}

app.post("/api/sync", async (req, res) => {
  await pollTelegram(true);
  res.json({ success: true });
});

pollTelegram();

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
