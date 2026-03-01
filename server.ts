import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.db");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`
);

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    wallet_balance REAL DEFAULT 0,
    role TEXT DEFAULT 'user',
    provider TEXT DEFAULT 'local',
    provider_id TEXT,
    profile_pic TEXT,
    reset_token TEXT,
    reset_token_expiry DATETIME
  );

  CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT,
    name TEXT,
    price REAL,
    diamonds INTEGER
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    package_id INTEGER,
    player_uid TEXT,
    status TEXT DEFAULT 'pending',
    payment_method TEXT DEFAULT 'wallet',
    transaction_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(package_id) REFERENCES packages(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

  // Add provider and provider_id columns if they don't exist
  try {
    db.prepare("ALTER TABLE users ADD COLUMN provider TEXT DEFAULT 'local'").run();
    db.prepare("ALTER TABLE users ADD COLUMN provider_id TEXT").run();
  } catch (e) {}

  try {
    db.prepare("ALTER TABLE users ADD COLUMN profile_pic TEXT").run();
  } catch (e) {}

  try {
    db.prepare("ALTER TABLE users ADD COLUMN reset_token TEXT").run();
    db.prepare("ALTER TABLE users ADD COLUMN reset_token_expiry DATETIME").run();
  } catch (e) {}

  // Add completed_at column if it doesn't exist
  try {
    db.prepare("ALTER TABLE orders ADD COLUMN completed_at DATETIME").run();
  } catch (e) {}
  
  // Add payment_method and transaction_id columns if they don't exist
  try {
    db.prepare("ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT 'wallet'").run();
    db.prepare("ALTER TABLE orders ADD COLUMN transaction_id TEXT").run();
  } catch (e) {}

  // Add contact_number and order_id_string columns if they don't exist
  try {
    db.prepare("ALTER TABLE orders ADD COLUMN contact_number TEXT").run();
    db.prepare("ALTER TABLE orders ADD COLUMN order_id_string TEXT").run();
  } catch (e) {}

// Seed initial data if empty
const packageCount = db.prepare("SELECT COUNT(*) as count FROM packages").get() as { count: number };
if (packageCount.count <= 45) { // Increased threshold to trigger re-seed with new packages
  db.prepare("DELETE FROM packages").run();
  const insertPackage = db.prepare("INSERT INTO packages (category, name, price, diamonds) VALUES (?, ?, ?, ?)");
  
  // UID Top-up (BD)
  const bdPackages = [
    { name: "25 Diamond", price: 30, diamonds: 25 },
    { name: "50 Diamond", price: 45, diamonds: 50 },
    { name: "75 Diamond", price: 65, diamonds: 75 },
    { name: "100 Diamond", price: 92, diamonds: 100 },
    { name: "115 Diamond", price: 100, diamonds: 115 },
    { name: "240 Diamond", price: 170, diamonds: 240 },
    { name: "355 Diamond", price: 260, diamonds: 355 },
    { name: "480 Diamond", price: 330, diamonds: 480 },
    { name: "505 Diamond", price: 360, diamonds: 505 },
    { name: "610 Diamond", price: 420, diamonds: 610 },
    { name: "725 Diamond", price: 500, diamonds: 725 },
    { name: "850 Diamond", price: 570, diamonds: 850 },
    { name: "1090 Diamond", price: 750, diamonds: 1090 },
    { name: "1240 Diamond", price: 820, diamonds: 1240 },
    { name: "1595 Diamond", price: 1060, diamonds: 1595 },
    { name: "1850 Diamond", price: 1200, diamonds: 1850 },
    { name: "2090 Diamond", price: 1367, diamonds: 2090 },
    { name: "2530 Diamond", price: 1595, diamonds: 2530 },
    { name: "3140 Diamond", price: 1989, diamonds: 3140 },
    { name: "4380 Diamond", price: 2770, diamonds: 4380 },
    { name: "5060 Diamond", price: 3140, diamonds: 5060 },
    { name: "7590 Diamond", price: 4700, diamonds: 7590 },
    { name: "10120 Diamond", price: 6217, diamonds: 10120 },
    { name: "15180 Diamond", price: 9348, diamonds: 15180 },
    { name: "20240 Diamond", price: 12478, diamonds: 20240 },
  ];

  bdPackages.forEach(p => insertPackage.run("UID Top-up (BD)", p.name, p.price, p.diamonds));

  // Other Categories
  const weeklyPackages = [
    { name: "Weekly Lite", price: 60 },
    { name: "Weekly", price: 167 },
    { name: "5x Weekly Lite", price: 230 },
    { name: "10x Weekly Lite", price: 460 },
    { name: "2x Weekly", price: 333 },
    { name: "3x Weekly", price: 500 },
    { name: "5x Weekly", price: 833 },
    { name: "10x Weekly", price: 1665 },
  ];
  weeklyPackages.forEach(p => insertPackage.run("Weekly Membership", p.name, p.price, 0));

  const monthlyPackages = [
    { name: "Monthly", price: 789 },
    { name: "2x Monthly", price: 1577 },
    { name: "3x Monthly", price: 2366 },
    { name: "5x Monthly", price: 3940 },
  ];
  monthlyPackages.forEach(p => insertPackage.run("Monthly Membership", p.name, p.price, 0));

  const levelUpPackages = [
    { name: "Level Up Pass Lv.6 (120 Diamond)", price: 52, diamonds: 120 },
    { name: "Level Up Pass Lv.10 (200 Diamond)", price: 82, diamonds: 200 },
    { name: "Level Up Pass Lv.15 (200 Diamond)", price: 82, diamonds: 200 },
    { name: "Level Up Pass Lv.20 (200 Diamond)", price: 82, diamonds: 200 },
    { name: "Level Up Pass Lv.25 (200 Diamond)", price: 82, diamonds: 200 },
    { name: "Level Up Pass Lv.30 (350 Diamond)", price: 125, diamonds: 350 },
    { name: "Full Level Up Pass (1270 Diamond)", price: 440, diamonds: 1270 },
  ];
  levelUpPackages.forEach(p => insertPackage.run("Level Up Pass", p.name, p.price, p.diamonds));

  insertPackage.run("Special Airdrop", "99 BDT Airdrop", 99, 0);
  insertPackage.run("Special Airdrop", "190 BDT Airdrop", 190, 0);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/packages", (req, res) => {
    const packages = db.prepare("SELECT * FROM packages").all();
    res.json(packages);
  });

  app.post("/api/auth/forgot-password", (req, res) => {
    const { email } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    
    if (!user) {
      return res.status(404).json({ success: false, message: "এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি" });
    }

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now

    db.prepare("UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?").run(token, expiry, user.id);

    // In a real app, you'd send an email here.
    // For this demo, we'll return the token so the UI can show the reset form.
    console.log(`Password reset link for ${email}: ${process.env.APP_URL}/reset-password?token=${token}`);
    
    res.json({ 
      success: true, 
      message: "পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে (ডেমো হিসেবে কনসোলে চেক করুন)",
      debugToken: token // Only for demo purposes
    });
  });

  app.post("/api/auth/reset-password", (req, res) => {
    const { token, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > CURRENT_TIMESTAMP").get(token) as any;

    if (!user) {
      return res.status(400).json({ success: false, message: "রিসেট টোকেনটি ভুল বা মেয়াদ শেষ হয়ে গেছে" });
    }

    db.prepare("UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?").run(password, user.id);
    res.json({ success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে" });
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, wallet_balance: user.wallet_balance, role: user.role } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;
    try {
      const info = db.prepare("INSERT INTO users (name, email, password, wallet_balance) VALUES (?, ?, ?, 0)").run(name, email, password);
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid) as any;
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          wallet_balance: user.wallet_balance, 
          role: user.role 
        } 
      });
    } catch (e) {
      res.status(400).json({ success: false, message: "এই ইমেইল দিয়ে আগে থেকেই অ্যাকাউন্ট আছে, দয়া করে লগ-ইন করুন" });
    }
  });

  app.post("/api/auth/social", (req, res) => {
    const { name, email, provider, provider_id, profile_pic } = req.body;
    const user = handleSocialAuth(name, email, provider, provider_id, profile_pic);
    res.json({ success: true, user });
  });

  function handleSocialAuth(name: string, email: string, provider: string, provider_id: string, profile_pic: string) {
    // Check if user exists with this provider_id
    let user = db.prepare("SELECT * FROM users WHERE provider = ? AND provider_id = ?").get(provider, provider_id) as any;
    
    if (!user) {
      // Check if user exists with this email (Account Linking)
      user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
      
      if (user) {
        // Link existing account
        db.prepare("UPDATE users SET provider = ?, provider_id = ?, profile_pic = ? WHERE id = ?")
          .run(provider, provider_id, profile_pic, user.id);
        user = db.prepare("SELECT * FROM users WHERE id = ?").get(user.id) as any;
      } else {
        // Create new account
        const info = db.prepare("INSERT INTO users (name, email, provider, provider_id, profile_pic, wallet_balance) VALUES (?, ?, ?, ?, ?, 0)")
          .run(name, email, provider, provider_id, profile_pic);
        user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid) as any;
      }
    }

    return { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      wallet_balance: user.wallet_balance, 
      role: user.role,
      profile_pic: user.profile_pic
    };
  }

  // OAuth Routes
  app.get("/api/auth/url/:provider", (req, res) => {
    const { provider } = req.params;
    const redirectUri = `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`;
    let authUrl = "";

    if (provider === "google") {
      authUrl = googleClient.generateAuthUrl({
        access_type: "offline",
        scope: ["openid", "email", "profile"],
        state: "google"
      });
    } else if (provider === "facebook") {
      const params = new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID!,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "email,public_profile",
        state: "facebook"
      });
      authUrl = `https://www.facebook.com/v12.0/dialog/oauth?${params}`;
    } else if (provider === "twitter") {
      const params = new URLSearchParams({
        client_id: process.env.TWITTER_CLIENT_ID!,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "users.read tweet.read",
        state: "twitter",
        code_challenge: "challenge", // Simplified for demo, should be dynamic PKCE
        code_challenge_method: "plain"
      });
      authUrl = `https://twitter.com/i/oauth2/authorize?${params}`;
    }

    res.json({ url: authUrl });
  });

  app.get("/auth/callback", async (req, res) => {
    const { code, state } = req.query;
    const redirectUri = `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`;
    let userData: any = null;

    try {
      if (state === "google") {
        const { tokens } = await googleClient.getToken(code as string);
        googleClient.setCredentials(tokens);
        const ticket = await googleClient.verifyIdToken({
          idToken: tokens.id_token!,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (payload) {
          userData = {
            name: payload.name,
            email: payload.email,
            provider: "google",
            provider_id: payload.sub,
            profile_pic: payload.picture
          };
        }
      } else if (state === "facebook") {
        const tokenRes = await axios.get("https://graph.facebook.com/v12.0/oauth/access_token", {
          params: {
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            redirect_uri: redirectUri,
            code
          }
        });
        const userRes = await axios.get("https://graph.facebook.com/me", {
          params: {
            fields: "id,name,email,picture.type(large)",
            access_token: tokenRes.data.access_token
          }
        });
        userData = {
          name: userRes.data.name,
          email: userRes.data.email,
          provider: "facebook",
          provider_id: userRes.data.id,
          profile_pic: userRes.data.picture?.data?.url
        };
      } else if (state === "twitter") {
        const tokenRes = await axios.post("https://api.twitter.com/2/oauth2/token", 
          new URLSearchParams({
            code: code as string,
            grant_type: "authorization_code",
            client_id: process.env.TWITTER_CLIENT_ID!,
            redirect_uri: redirectUri,
            code_verifier: "challenge"
          }).toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString("base64")}`
            }
          }
        );
        const userRes = await axios.get("https://api.twitter.com/2/users/me", {
          params: { "user.fields": "profile_image_url" },
          headers: { Authorization: `Bearer ${tokenRes.data.access_token}` }
        });
        userData = {
          name: userRes.data.data.name,
          email: userRes.data.data.username + "@twitter.com", // Twitter doesn't always provide email
          provider: "twitter",
          provider_id: userRes.data.data.id,
          profile_pic: userRes.data.data.profile_image_url
        };
      }

      if (userData) {
        const user = handleSocialAuth(userData.name, userData.email, userData.provider, userData.provider_id, userData.profile_pic);
        res.send(`
          <html>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: ${JSON.stringify(user)} }, '*');
                  window.close();
                } else {
                  window.location.href = '/';
                }
              </script>
              <p>Authentication successful. This window should close automatically.</p>
            </body>
          </html>
        `);
      } else {
        res.status(400).send("Authentication failed");
      }
    } catch (error: any) {
      console.error("OAuth Error:", error.response?.data || error.message);
      res.status(500).send("Internal Server Error during authentication");
    }
  });

  app.get("/api/user/:id", (req, res) => {
    const user = db.prepare("SELECT id, name, email, wallet_balance, role FROM users WHERE id = ?").get(req.params.id);
    res.json(user);
  });

  app.post("/api/orders", (req, res) => {
    const { user_id, package_id, player_uid, payment_method, transaction_id, contact_number } = req.body;
    const pkg = db.prepare("SELECT price FROM packages WHERE id = ?").get(package_id) as any;
    
    // Generate a unique human-readable Order ID
    const orderIdString = "#CVV" + Math.floor(1000 + Math.random() * 9000);

    if (payment_method === 'wallet') {
      if (!user_id) return res.status(400).json({ success: false, message: "Wallet payment requires login" });
      const user = db.prepare("SELECT wallet_balance FROM users WHERE id = ?").get(user_id) as any;
      if (user.wallet_balance >= pkg.price) {
        db.prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?").run(pkg.price, user_id);
        const info = db.prepare("INSERT INTO orders (user_id, package_id, player_uid, payment_method, order_id_string) VALUES (?, ?, ?, ?, ?)").run(user_id, package_id, player_uid, 'wallet', orderIdString);
        res.json({ success: true, message: "Order placed successfully", order_id_string: orderIdString, id: info.lastInsertRowid });
      } else {
        res.status(400).json({ success: false, message: "Insufficient wallet balance" });
      }
    } else {
      // Manual payment (Instant Pay)
      const info = db.prepare("INSERT INTO orders (user_id, package_id, player_uid, payment_method, transaction_id, contact_number, order_id_string) VALUES (?, ?, ?, ?, ?, ?, ?)").run(user_id || null, package_id, player_uid, payment_method, transaction_id, contact_number, orderIdString);
      res.json({ success: true, message: "Order submitted for verification", order_id_string: orderIdString, id: info.lastInsertRowid });
    }
  });

  app.get("/api/orders/track/:query", (req, res) => {
    const { query } = req.params;
    const orders = db.prepare(`
      SELECT orders.*, packages.name as package_name, packages.price 
      FROM orders 
      JOIN packages ON orders.package_id = packages.id 
      WHERE orders.order_id_string = ? OR orders.contact_number = ?
      ORDER BY created_at DESC
    `).all(query, query);
    res.json(orders);
  });

  app.post("/api/orders/guest-history", (req, res) => {
    const { orderIds } = req.body; // Array of order_id_string
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.json([]);
    }
    const placeholders = orderIds.map(() => "?").join(",");
    const orders = db.prepare(`
      SELECT orders.*, packages.name as package_name, packages.price 
      FROM orders 
      JOIN packages ON orders.package_id = packages.id 
      WHERE orders.order_id_string IN (${placeholders})
      ORDER BY created_at DESC
    `).all(...orderIds);
    res.json(orders);
  });

  app.get("/api/orders/:user_id", (req, res) => {
    const orders = db.prepare(`
      SELECT orders.*, packages.name as package_name, packages.price 
      FROM orders 
      JOIN packages ON orders.package_id = packages.id 
      WHERE orders.user_id = ?
      ORDER BY created_at DESC
    `).all(req.params.user_id);
    res.json(orders);
  });

  app.get("/api/check-player/:uid", (req, res) => {
    const { uid } = req.params;
    // Simulate a delay and a name lookup
    setTimeout(() => {
      if (uid.length < 5) {
        res.status(404).json({ success: false, message: "ভুল আইডি! দয়া করে সঠিক প্লেয়ার আইডি কোড দিন।" });
      } else {
        res.json({ success: true, name: "Player_" + uid.slice(-4) });
      }
    }, 1000);
  });

  // Admin Routes
  app.get("/api/admin/orders", (req, res) => {
    const orders = db.prepare(`
      SELECT orders.*, users.name as user_name, packages.name as package_name 
      FROM orders 
      JOIN users ON orders.user_id = users.id 
      JOIN packages ON orders.package_id = packages.id
      ORDER BY created_at DESC
    `).all();
    res.json(orders);
  });

  app.post("/api/admin/orders/status", (req, res) => {
    const { order_id, status } = req.body;
    if (status === 'complete') {
      db.prepare("UPDATE orders SET status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, order_id);
    } else {
      db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, order_id);
    }
    res.json({ success: true });
  });

  // Vite middleware for development
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
