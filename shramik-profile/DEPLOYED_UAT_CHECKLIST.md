# Deployed UAT Checklist (Frontend + Backend)

Use this checklist after deploying both services on Render. It is the live smoke/UAT sheet for field testing and should be filled in for each deployment candidate.

## Live Run Details

- Frontend URL: `https://shramik-web.onrender.com`
- Backend URL: `https://shramik-api.onrender.com`
- Backend health path: `/api/health`
- Backend workers path: `/api/workers`
- Run date: ____________________
- Tester: ____________________
- Device/browser: ____________________
- Result: ____________________

## 0) Decision Rule

Release is **GO** only if:

- Frontend loads without a blank screen.
- Backend health returns `status: ok`.
- Worker list loads through the live API or falls back intentionally when the backend is offline.
- All critical submit actions show success or clear validation feedback.
- No P0 or open P1 defects remain.

## 1) Preconditions

- Frontend URL is live (example: `https://shramik-web.onrender.com`)
- Backend URL is live (example: `https://shramik-api.onrender.com`)
- Render env vars are set:
  - Backend: `FRONTEND_ORIGIN=<your frontend url>`
  - Frontend: `VITE_API_BASE_URL=<your backend url>`
- Browser cache is cleared or hard refresh is used.
- If using a shared device, clear local storage once before the first field test run.

---

## 2) Smoke Checks (Must Pass First)

| ID | Check | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| S-1 | Frontend loads | Open frontend URL | Home page renders with no blank screen | ☐ Pass / ☐ Fail | |
| S-2 | Backend health | Open `<backend>/api/health` | JSON returns `status: ok` | ☐ Pass / ☐ Fail | |
| S-3 | Worker list API | Open `<backend>/api/workers?limit=10` | `count` and `items[]` returned | ☐ Pass / ☐ Fail | |
| S-4 | CORS | Use app normally from deployed frontend | No CORS error in browser console | ☐ Pass / ☐ Fail | |

---

## 3) Landing Page UAT

| ID | Feature | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| L-1 | Hero section | Open frontend URL | Hero headline, CTA buttons, and value props render correctly | ☐ Pass / ☐ Fail | |
| L-2 | Primary CTA | Click `Find verified workers` | Search page opens | ☐ Pass / ☐ Fail | |
| L-3 | Secondary CTA | Click `I am a worker` | Worker flow opens | ☐ Pass / ☐ Fail | |
| L-4 | Read aloud | Click `Read Aloud` | Browser speech or fallback message appears | ☐ Pass / ☐ Fail | |
| L-5 | Easy Mode | Toggle Easy Mode | Larger, simpler controls are visible and usable | ☐ Pass / ☐ Fail | |
| L-6 | Language toggle | Switch language EN/HI | UI text changes and stays readable | ☐ Pass / ☐ Fail | |

---

## 4) Search Page UAT (`Find Workers`)

| ID | Feature | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| F-1 | Page opens | Click `Find Workers` | Search page opens correctly | ☐ Pass / ☐ Fail | |
| F-2 | Data source | Observe count/cards | Workers are shown (not empty by default) | ☐ Pass / ☐ Fail | |
| F-3 | Role filter | Select role (e.g., Driver/Cook) | List updates to matching role | ☐ Pass / ☐ Fail | |
| F-4 | City filter | Select city (Hyderabad/Bengaluru/etc.) | Only selected city workers shown | ☐ Pass / ☐ Fail | |
| F-5 | Rating filter | Set min rating 4.5+ | Low rated workers are filtered out | ☐ Pass / ☐ Fail | |
| F-6 | Search text | Search by name/skill (e.g., `tutor`) | Relevant workers appear | ☐ Pass / ☐ Fail | |
| F-7 | Grid/List toggle | Switch grid/list modes | Layout changes correctly both ways | ☐ Pass / ☐ Fail | |
| F-8 | Location detect | Click `Use my location` | Location message appears, no crash | ☐ Pass / ☐ Fail | |
| F-9 | Proximity controls | Toggle proximity/radius | Nearby results ordering/filter changes | ☐ Pass / ☐ Fail | |
| F-10 | Worker open | Click `View` on any card | Worker profile page opens | ☐ Pass / ☐ Fail | |
| F-11 | Data source hint | Observe search header note | Note reflects live backend or local fallback correctly | ☐ Pass / ☐ Fail | |

---

## 5) Worker Profile + Actions UAT

| ID | Feature | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| W-1 | Profile details | Open worker profile | Name/role/city/skills rendered | ☐ Pass / ☐ Fail | |
| W-2 | Hire request | Submit hire request form | Success toast/message shown | ☐ Pass / ☐ Fail | |
| W-3 | Interview request | Use schedule interview flow | Success message shown | ☐ Pass / ☐ Fail | |
| W-4 | Rating submit | Submit star rating | Rating acknowledgement shown | ☐ Pass / ☐ Fail | |
| W-5 | Error handling | Submit hire form without required fields | Friendly validation/error shown | ☐ Pass / ☐ Fail | |
| W-6 | Contact write path | Trigger contact/interview/hire submit | Backend returns `201` and saves entry | ☐ Pass / ☐ Fail | |

---

## 6) Auth + Dashboard Navigation UAT

| ID | Feature | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| A-1 | Auth page | Open `Sign in` / `Get started` | Auth page loads cleanly | ☐ Pass / ☐ Fail | |
| A-2 | Role login path | Login as worker/employer/society/admin demo | Correct dashboard opens by role | ☐ Pass / ☐ Fail | |
| A-3 | Navbar actions | Click top nav links | Routes switch correctly | ☐ Pass / ☐ Fail | |
| A-4 | Toast consistency | Use multiple header/actions | Micro-toast text appears consistently | ☐ Pass / ☐ Fail | |
| A-5 | Easy mode toggle | Toggle Easy Mode | UI scales/readability adjusts | ☐ Pass / ☐ Fail | |
| A-6 | Help/Login path | Open `Help/Login` from assist bar | Auth page opens and explains access flow | ☐ Pass / ☐ Fail | |

---

## 7) Dashboard Feature Sweep

| ID | Area | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| D-1 | Worker dashboard | Open Worker dashboard and use overview/jobs/planner/profile tabs | Tabs switch and actions show feedback | ☐ Pass / ☐ Fail | |
| D-2 | Employer dashboard | Open Employer dashboard and review job posting flow | Form inputs, validation, and submit toast work | ☐ Pass / ☐ Fail | |
| D-3 | Society dashboard | Open Society dashboard and review registry/approvals/incidents/notices | Tabs and actions update cleanly | ☐ Pass / ☐ Fail | |
| D-4 | Admin dashboard | Open Admin dashboard and use review/risk controls | State changes and action buttons work | ☐ Pass / ☐ Fail | |

---

## 8) Backend Write-Path UAT (Contact Submissions)

| ID | API | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| B-1 | Valid submit | Trigger contact/hire/interview submit from UI | API returns success (`201`) | ☐ Pass / ☐ Fail | |
| B-2 | Invalid submit | Submit empty required fields | API returns `400` with message | ☐ Pass / ☐ Fail | |
| B-3 | Data persistence | Check backend submissions store/log | New record exists | ☐ Pass / ☐ Fail | |

---

## 9) Cross-Device UAT

| ID | Device | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| D-1 | Desktop (Chrome) | Run core flow (search → view → submit) | No layout or console errors | ☐ Pass / ☐ Fail | |
| D-2 | Mobile width (~390px) | Run same flow in responsive mode | Controls remain usable and visible | ☐ Pass / ☐ Fail | |
| D-3 | Tablet width (~768px) | Search/filter/list interactions | Layout remains stable | ☐ Pass / ☐ Fail | |

---

## 10) Browser Console/Network Audit

- [ ] No uncaught runtime errors in console.
- [ ] No failed `fetch` calls for required user flows.
- [ ] No mixed-content HTTP calls on HTTPS site.
- [ ] No CORS errors.

## 11) Test Data to Record

- Flow completed: ____________________
- Time to complete: ____________________
- Confusing labels or screens: ____________________
- Failed clicks or dead ends: ____________________
- Mobile readability issues: ____________________
- Backend/API issues: ____________________

---

## 12) Exit Criteria (Go/No-Go)

Release is **GO** only if all are true:

- [ ] All Smoke checks pass (`S-1` to `S-4`)
- [ ] All Search and Worker core flows pass (`F-1` to `F-10`, `W-1` to `W-5`)
- [ ] All landing, auth, dashboard, and backend write-path checks pass
- [ ] All write-path checks pass (`B-1` to `B-3`)
- [ ] No P1/P2 issues remain open

## 13) Defect Log Template

| Defect ID | Severity (P1/P2/P3) | Area | Steps to Reproduce | Expected | Actual | Owner | Status |
|---|---|---|---|---|---|---|---|
| UAT-001 |  |  |  |  |  |  |  |
| UAT-002 |  |  |  |  |  |  |  |
