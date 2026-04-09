# Field Testing Plan

## Goal
Validate the full Shramik experience in realistic conditions before wider release. This includes every user-facing page, every primary action, and the backend write paths used by the UI.

## Test Group

- 2 Employers
- 2 Workers
- 1 Society manager
- 1 Admin/operations reviewer

## Devices and Conditions

- One low-end Android phone
- One mid/high-end Android phone
- One laptop/desktop browser
- Variable network quality: good Wi-Fi and weak/spotty mobile data
- At least one browser with a cold cache and one with a warm cache

## Preflight Checks

1. Open the deployed frontend URL.
2. Open the backend health endpoint and confirm JSON returns `status: ok`.
3. Confirm the search page note says the correct source, either live backend or local fallback.
4. Confirm browser console is free of red errors.

## Feature Inventory to Test

### Public Experience

- Landing page hero, CTAs, and read-aloud action
- Easy Mode toggle
- Language switch (EN/HI)
- Top navigation and mobile hamburger menu
- Find Workers search experience
- Worker profile details
- Pricing page
- For Societies page
- For Workers page
- Enterprise page
- Auth / Help / Login page

### Transactional Flows

- Hire request submission
- Interview request submission
- Contact submission
- Worker rating submission

### Role Dashboards

- Worker dashboard
- Employer dashboard
- Society dashboard
- Admin dashboard

### Backend/API Checks

- `/api/health`
- `/api/workers`
- `/api/workers/:id`
- `/api/contact`

## Field Test Scenarios

### A. Employer Flow

1. Open the app and go to `Find Workers`.
2. Search by name and skill.
3. Filter by role, city, and rating.
4. Switch grid/list views.
5. Open a worker profile.
6. Submit a hire request.
7. Submit an interview request.

### B. Worker Flow

1. Open the worker path or dashboard.
2. Navigate overview, jobs, planner, and profile tabs.
3. Trigger a save/update action.
4. Confirm toast text is easy to understand.
5. Confirm the mobile layout remains readable.

### C. Society Flow

1. Open the Society Hub.
2. Check entry, registry, approvals, incidents, and notices tabs.
3. Register or approve a worker.
4. Create and resolve an incident.
5. Confirm badge/status updates are visible.

### D. Admin Flow

1. Open the admin area.
2. Review verification, reports, and risk sections.
3. Trigger at least one action in each area.
4. Confirm the UI gives immediate feedback.

### E. Accessibility / Ease-of-Use Flow

1. Toggle Easy Mode.
2. Switch language from English to Hindi and back.
3. Navigate using keyboard only where possible.
4. Check button size, contrast, and focus visibility on mobile.

## What to Record

- Task completion rate
- Time to complete each flow
- User confusion points
- Failed clicks or dead ends
- Unclear button labels
- Mobile readability issues
- Backend/API issues
- Whether testers understood the toast feedback

## Severity Classification

- P0: blocks the core flow entirely
- P1: major confusion or repeated failure
- P2: minor wording, layout, or polish issue

## Exit Criteria

- No P0 issues
- P1 issues documented with owner and target fix date
- At least 80% of field participants complete the core flows successfully
- Backend write-paths return the expected success or validation response

## Output

- Field test findings report
- Prioritized fix backlog
- Recommendation: launch or fix-and-retest
