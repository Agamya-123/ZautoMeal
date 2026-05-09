# 🍽️ Zautomeal

> **Automate your hunger. Eat on schedule. Never miss a meal.**

Zautomeal is a smart food-ordering automation SaaS built on top of the **Swiggy Builder API**. Users define their meal schedules once, and Zautomeal handles everything — ordering, reminders, confirmations, and intelligent rescheduling — all on autopilot.

---

## 💡 The Idea

Most people order the same meals repeatedly. Zautomeal learns your patterns, automates your orders, and gives you full control to pause, skip, or reschedule with a single tap — **1 hour before** every scheduled order.

### Core User Flow

```
User sets up schedule → Meal is queued for auto-order
    ↓
1 hour before: Push notification / WhatsApp / SMS sent
"Hey! Your lunch from XYZ is being placed in 1 hour. Want it? [YES / SKIP / RESCHEDULE]"
    ↓
If no response → Order placed automatically (default behavior)
If YES        → Order placed immediately
If SKIP       → Ask: "Skip today only? Or pick a new time?"
If RESCHEDULE → User picks new time/date
```

---

## 🏷️ Project Name: **Zautomeal**

| Name | Meaning |
|------|---------|
| **Z** | Zero effort (you do nothing after setup) |
| **auto** | Automated, always running |
| **meal** | Food, the core purpose |

**Alternative names considered:**
- `Plateloop` — meals on loop
- `ForkBot` — too robotic
- `Mealcron` — developer-y, niche

**Winner: `Zautomeal`** — catchy, memorable, brandable, not AI-buzzwordy.

**Repo name:** `zautomeal`
**Domain suggestion:** `zautomeal.in` / `zautomeal.app`

---

## 🧱 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      ZAUTOMEAL                          │
│                                                         │
│  ┌──────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │  Next.js │   │  FastAPI /   │   │  Swiggy Builder│  │
│  │ Frontend │◄──│  Node.js API │──►│      API       │  │
│  │ (React)  │   │   Backend    │   └────────────────┘  │
│  └──────────┘   └──────┬───────┘                       │
│                         │                               │
│             ┌───────────▼──────────┐                   │
│             │   Scheduler Engine   │                   │
│             │  (BullMQ + Redis)    │                   │
│             └───────────┬──────────┘                   │
│                         │                              │
│        ┌────────────────┼───────────────┐              │
│        ▼                ▼               ▼              │
│  ┌──────────┐   ┌──────────────┐  ┌──────────┐        │
│  │Notification│  │   AI Agent   │  │  Stripe/ │        │
│  │  Service  │  │ (Gemini API) │  │Razorpay  │        │
│  │(FCM/Twilio│  │ Smart Reco   │  │ Payments │        │
│  │/WhatsApp) │  └──────────────┘  └──────────┘        │
│  └──────────┘                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Full Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| **Next.js 14** (App Router) | Main web app with SSR |
| **React 18** | UI components |
| **Framer Motion** | Animations & micro-interactions |
| **Tailwind CSS** | Styling |
| **ShadCN UI** | Component library |
| **React Query (TanStack)** | Data fetching & caching |
| **Zustand** | Global state management |
| **PWA (next-pwa)** | Mobile app-like experience |

### Backend
| Tech | Purpose |
|------|---------|
| **Node.js + Express** OR **FastAPI (Python)** | REST API server |
| **BullMQ** | Job queue for scheduled orders |
| **Redis** | Queue backend + caching |
| **PostgreSQL** (via Supabase) | Main database |
| **Prisma ORM** | Database access layer |
| **JWT + OAuth2** | Auth (Google Sign-In) |

> **Recommendation:** Use **Node.js + Express** for a full-JS stack. Use **FastAPI** if you want async Python for the AI agent logic.

### AI / Automation Agent
| Tech | Purpose |
|------|---------|
| **Google Gemini API** | Smart meal recommendations, NLP for preferences |
| **LangChain.js** | Agent orchestration |
| **BullMQ Delayed Jobs** | Precise order-time scheduling |

### Notifications
| Tech | Purpose |
|------|---------|
| **Firebase Cloud Messaging (FCM)** | Push notifications (web + mobile) |
| **Twilio** | SMS fallback |
| **WhatsApp Business API** | WhatsApp messages (via 360dialog / Twilio) |
| **Nodemailer / Resend** | Email confirmations |

### Payments
| Tech | Purpose |
|------|---------|
| **Stripe** | Subscription billing (international) |
| **Razorpay** | Indian users (UPI, Cards, Net Banking) |

### DevOps / Infrastructure
| Tech | Purpose |
|------|---------|
| **Docker + Docker Compose** | Local & production containerization |
| **Railway / Render** | Backend hosting (free tier available) |
| **Vercel** | Frontend hosting |
| **Supabase** | Postgres DB + Auth + Realtime |
| **Upstash Redis** | Serverless Redis for BullMQ |
| **GitHub Actions** | CI/CD pipeline |

---

## 🔑 API & Token Cost Estimates

### Swiggy Builder API
- **Access:** Free via Swiggy Partner/Builder program
- **Rate Limits:** Varies per plan (typically 1,000 req/min for starter)
- **Cost:** ₹0 upfront (commission-based model; Swiggy takes a % per order)
- **Apply at:** [https://www.swiggy.com/swiggy-builder](https://www.swiggy.com/swiggy-builder)

### Google Gemini API (AI Agent)
| Model | Input | Output | Use Case |
|-------|-------|--------|---------|
| `gemini-1.5-flash` | $0.075/1M tokens | $0.30/1M tokens | Meal suggestions, NLP parsing |
| `gemini-1.5-pro` | $3.50/1M tokens | $10.50/1M tokens | Complex reasoning, advanced agent |

**Estimated tokens per user/month:**
- Schedule setup + parsing: ~500 tokens
- Daily meal suggestion: ~200 tokens × 30 = 6,000 tokens
- Rescheduling NLP: ~300 tokens × avg 5 times = 1,500 tokens
- **Total per user/month:** ~8,000–10,000 tokens

**Flash model cost per user:** ~$0.001/month (virtually free)
**At 1,000 active users:** ~$1–$2/month on Gemini Flash

### Notification Costs (per 1,000 users/month)
| Service | Cost |
|---------|------|
| FCM Push | **Free** |
| Twilio SMS | ~$0.0075/msg → ~₹0.6/msg |
| WhatsApp (360dialog) | ~€0.005/message |
| Email (Resend.com) | Free up to 3,000/month |

---

## 💳 Subscription / Monetization Model

### Pricing Tiers

| Plan | Price | Features |
|------|-------|---------|
| **Free** | ₹0/month | 1 scheduled meal/day, basic push notifications |
| **Starter** | ₹99/month | 3 meals/day, WhatsApp alerts, 7-day history |
| **Pro** | ₹199/month | Unlimited meals, AI suggestions, multi-address, family mode |
| **Premium** | ₹399/month | Priority support, custom rules, meal budget tracker |

### Revenue Estimate (1,000 paid users at blended ₹150/month)
- **Monthly Recurring Revenue (MRR):** ₹1,50,000
- **Annual:** ₹18,00,000
- **Less infra (~₹5,000/month):** marginal cost
- Swiggy commission is charged per-order to restaurant, not to Zautomeal

---

## 🤖 AI Agent Capabilities

The embedded Gemini-powered agent does more than just schedule orders:

1. **Smart Meal Rescheduling** — "It's raining heavily today, delay by 30 min?"
2. **Budget Awareness** — Warns when your weekly food spend exceeds your set limit
3. **Menu Intelligence** — Auto-detects when a favourite item is unavailable and suggests the closest alternative
4. **Pattern Learning** — After 2 weeks, suggests new meals based on past orders
5. **Natural Language Commands** — "Skip lunch this Friday and add a snack at 4 PM"
6. **Weather Integration** — Adjusts timing suggestions based on real-time weather (e.g., rainy days = longer delivery)
7. **Payday Awareness** — Premium feature: adjusts meal budget limits around paycheck dates

---

## 📅 Smart Notification Flow (Detailed)

```
T-60 min: "Your [Meal Name] from [Restaurant] is scheduled in 1 hour."
           [✅ Confirm] [⏭️ Skip Today] [🔄 Reschedule] [❌ Cancel]

If no response in 50 min → Reminder: "Last chance! Order places in 10 min."

If SKIP:
  → "Skip just today, or remove this schedule?"
  → If skip today: "Got it! See you tomorrow."
  → If remove: Go to schedule settings.

If RESCHEDULE:
  → "When would you like it? [Today 2PM] [Today 6PM] [Tomorrow 1PM] [Custom]"

If CONFIRM or no response:
  → Order placed via Swiggy Builder API
  → Tracking link sent to user
  → Order status updates via webhook
```

---

## 📁 Project Structure

```
zautomeal/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── app/
│   │   │   ├── dashboard/      # User meal schedules
│   │   │   ├── setup/          # Onboarding & address setup
│   │   │   ├── history/        # Order history & analytics
│   │   │   └── billing/        # Subscription management
│   │   └── components/
│   ├── api/                    # Node.js / FastAPI backend
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── schedules.js
│   │   │   ├── orders.js
│   │   │   └── webhooks.js
│   │   ├── services/
│   │   │   ├── swiggy.service.js   # Swiggy Builder API wrapper
│   │   │   ├── notify.service.js   # Notification dispatcher
│   │   │   ├── ai.service.js       # Gemini agent logic
│   │   │   └── stripe.service.js   # Payment handling
│   │   └── workers/
│   │       ├── scheduler.worker.js # BullMQ job processor
│   │       └── notification.worker.js
│   └── agent/                  # Standalone AI agent (optional Python)
├── packages/
│   ├── db/                     # Prisma schema + migrations
│   └── shared/                 # Shared types/utils
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🗄️ Database Schema (Key Tables)

```sql
-- Users
users (id, email, phone, name, swiggy_token, created_at)

-- Addresses
addresses (id, user_id, label, swiggy_address_id, lat, lng)

-- Schedules
schedules (id, user_id, address_id, restaurant_id, items jsonb,
           cron_expression, timezone, active, created_at)

-- Orders
orders (id, schedule_id, user_id, swiggy_order_id, status,
        placed_at, delivered_at, amount)

-- Notifications
notifications (id, user_id, schedule_id, sent_at, channel,
               user_response, responded_at)

-- Subscriptions
subscriptions (id, user_id, plan, stripe_sub_id, status,
               current_period_end)
```

---

## 🗺️ Development Roadmap

### Phase 1 — MVP (4–6 weeks)
- [ ] Swiggy Builder API integration & auth flow
- [ ] User onboarding (address, meal preference)
- [ ] Basic schedule creation (cron-based)
- [ ] BullMQ job scheduler
- [ ] Push notification (FCM) — confirm/skip flow
- [ ] Auto-order placement

### Phase 2 — Payments & Polish (2–3 weeks)
- [ ] Razorpay subscription integration
- [ ] Subscription gating (free vs paid limits)
- [ ] Order history & dashboard
- [ ] WhatsApp notifications

### Phase 3 — AI Agent (3–4 weeks)
- [ ] Gemini API integration for meal suggestions
- [ ] Natural language rescheduling ("skip next Monday")
- [ ] Budget tracker
- [ ] Menu availability check before ordering

### Phase 4 — Scale & Growth
- [ ] Mobile app (React Native / Expo)
- [ ] Referral program
- [ ] Family/group meal plans
- [ ] Restaurant review + favourite tracking
- [ ] B2B: Office meal plans for companies

---

## ⚠️ Important Considerations

### Legal / API Terms
- Verify Swiggy Builder API's **Terms of Service** for automated ordering — confirm it is explicitly allowed for third-party automation
- Implement **user consent** explicitly: users must authorize Zautomeal to place orders on their behalf
- Store **no payment card data** — delegate entirely to Swiggy's payment flow

### Technical Risks
- **Swiggy API rate limits** — implement exponential backoff and queue-based ordering
- **Menu/restaurant unavailability** — always check item availability before queuing
- **Delivery time windows** — validate that the restaurant is open at scheduled time
- **Order failure handling** — retry logic + user notification on failure

### Security
- Encrypt all Swiggy tokens at rest (AES-256)
- Use short-lived JWT tokens
- Implement 2FA for billing/subscription changes

---

## 🚀 Getting Started (Development)

```bash
# Clone the repo
git clone https://github.com/yourusername/zautomeal.git
cd zautomeal

# Install dependencies (monorepo)
npm install

# Set up environment variables
cp .env.example .env
# Fill in: SWIGGY_API_KEY, GEMINI_API_KEY, DATABASE_URL,
#          REDIS_URL, RAZORPAY_KEY, STRIPE_KEY, TWILIO_SID

# Start local services
docker-compose up -d  # starts Postgres + Redis

# Run migrations
npm run db:migrate

# Start dev servers
npm run dev  # starts web + api concurrently
```

---

## 🌟 What Makes Zautomeal Unique

| Feature | Competitors | Zautomeal |
|---------|-------------|-----------|
| Scheduled recurring orders | ❌ | ✅ |
| 1-hour confirm/skip/reschedule | ❌ | ✅ |
| AI rescheduling via natural language | ❌ | ✅ |
| Budget tracking & alerts | ❌ | ✅ |
| WhatsApp-native interaction flow | ❌ | ✅ |
| Menu availability guard before order | ❌ | ✅ |
| Weather-aware timing suggestions | ❌ | ✅ |
| Family meal plans | ❌ | ✅ (Phase 4) |

---

## 📞 Notification Channels Priority

```
1. WhatsApp Business (highest open rate ~98%)
2. Push Notification via PWA/App
3. SMS (Twilio fallback)
4. Email (last resort)
```

---

## 📜 License

MIT License — feel free to fork, extend, and build on top of Zautomeal.

---

*Built with ❤️ to automate the one thing you shouldn't have to think about — food.*
