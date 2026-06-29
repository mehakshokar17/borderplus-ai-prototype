# BorderPlus AI — Product Note

**Prototype:** Browser-based conversational practice with instant AI feedback
**Author:** Mehak Shokar · **Date:** June 2026 · **Read time:** ~3 min

---

## 1. User problem — what's the real need?

Professionals who relocate to a new country are usually **literate but not fluent-on-their-feet**. They can read emails and understand a meeting, but in live conversation they freeze: they rehearse a sentence in their head, second-guess grammar, and stay quiet rather than risk sounding wrong. The gap isn't *knowledge* of the language — it's **confidence and reps in real-time speaking**.

Existing options don't fit this need:
- **Classes / tutors** are high-commitment, scheduled, and expensive — wrong for "I have 5 minutes before a standup."
- **Apps like Duolingo** drill vocabulary and grammar, not spontaneous *conversation* under mild social pressure.
- **Just talking to people** is the real fix, but it's exactly the thing they're avoiding — there's no safe, judgment-free rehearsal space.

> **The need:** a low-stakes, on-demand place to *speak* realistic everyday dialogues and get immediate, kind, specific feedback — so the first time isn't in front of a real colleague.

**Target user:** an adult who moved for work in the last 0–24 months, B1–B2 comprehension, motivated, time-poor, slightly anxious about speaking.

---

## 2. Core feature rationale — why these features for the MVP

The MVP is deliberately scoped to validate **one loop**: *speak → instant feedback → improve → repeat.*

| Feature | Why it's in the MVP |
|---|---|
| **Scenario picker** (Workplace / Daily Life / Immigration) | Confidence is context-specific. "Small talk with a colleague" rehearses the exact situation the user dreads, which beats generic practice. |
| **Speak *or* type** (live browser STT) | Speaking is the real skill, but typing removes the barrier on day one and in shared spaces. Meeting users where they are drives reps. |
| **Instant per-reply feedback** (score + sub-scores + better version + one tip) | This is the core value. Immediate, specific, *kind* feedback is what a real conversation never gives you. Sub-scores (intent/grammar/vocabulary/fluency/confidence) make progress legible. |
| **Multi-turn dialogue** | Real conversations have momentum. One-shot Q&A doesn't build the muscle of *keeping it going.* |
| **Retry with score delta** | Turns feedback into action in the moment — see the number move, internalize the fix. Drives the "improve" half of the loop. |
| **End-of-conversation report** | Zooms out from per-reply tactics to a holistic picture: strengths, what to work on, and one real reply upgraded — the "insight" a coach would leave you with. |
| **Dashboard** (streak, scores, skill radar) | Lightweight progress tracking sustains the habit between sessions. |

**Deliberately *out* of the MVP:** accounts/auth, payments, leaderboards, custom scenario authoring, accent scoring, mobile-native. None are needed to test the core hypothesis, and each adds build cost + surface area.

**A note on feedback design — prescriptive, not just descriptive.** The coach never only says "good." Every reply returns (a) a *better version that keeps the user's own meaning* and (b) a *single* actionable tip. Constraining to one tip prevents overwhelm; preserving the user's meaning keeps it theirs, not a script to memorize.

---

## 3. Market & reference insights

| Product | What we drew from it | Where we differ |
|---|---|---|
| **Duolingo** | Streaks, low-friction sessions, motivating tone | We focus on *open-ended conversation*, not multiple-choice drills |
| **ChatGPT Voice / advanced voice** | Natural spoken back-and-forth with an AI | We add *structured scoring + prescriptive coaching*, not just chat |
| **Speak (speak.com)** | AI speaking practice as the core loop | We're scenario-first for *relocated professionals*, not general learners |
| **Grammarly** | Inline, specific, non-judgmental correction | We apply that ethos to *spoken* replies with a "better version" |
| **Pitch/interview-prep tools (e.g. Yoodli)** | Feedback on delivery + confidence, not just words | We target everyday relocation scenarios, not just formal speaking |

**Insight:** the market has *practice* tools and *correction* tools, but few combine **realistic scenario role-play + instant prescriptive feedback + a confidence lens** for the specific moment of relocation. That intersection is the wedge.

---

## 4. Hypothesis — what the prototype validates

> **If** relocated professionals can rehearse realistic conversations in a private, browser-based space and receive **instant, specific, kind feedback** after every reply, **then** they will feel meaningfully more confident to have the real conversation — and will come back to practice.

**Leading signals we'd look for in a pilot:**
- **Activation:** % who complete at least one full conversation (loop completed end-to-end).
- **Engagement of the core loop:** retries per session, and *score improvement on retry* (proof the feedback is actionable).
- **Return:** D1/D7 return rate and streak formation.
- **Self-reported confidence:** a one-tap "How ready do you feel for this in real life?" before vs. after.

If retries reliably raise scores and users return, the loop works and is worth deepening.

---

## 5. Prioritization — what I'd build next

**Now (shipped in this prototype):** scenario picker · speak/type · instant per-reply feedback · multi-turn · retry + delta · end report · dashboard · graceful mock fallback when the model is rate-limited.

**Next (highest leverage):**
1. **Real, reliable STT + a paid model tier** — the free model's daily cap is the main reliability risk; a small budget removes mock fallbacks and unlocks real voice scoring.
2. **Pronunciation/delivery signal** — pace, filler words, and clarity from the actual audio (not just the transcript), since "confidence" is partly *how* it's said.
3. **Personalized scenario recommendations** — surface the situations a user struggles with most, from their score history.
4. **Spaced repetition of weak skills** — bring back the exact phrasing a user fumbled, a few days later.

**Later:** accounts + cross-device progress · custom/company-specific scenarios (onboarding new hires) · accent-aware feedback · native mobile.

**Explicitly deferred:** social/leaderboards, marketplace, and anything that doesn't move the core *speak → feedback → improve → return* loop.

---

*Built as a prototype to test one bet: that instant, kind, prescriptive feedback on real conversations is what turns "I understand the language" into "I can speak it confidently."*
