# QA Checklist

## Core Quality Gates
- [x] Install dependencies successfully
- [x] Lint passes (`npm run lint`)
- [x] Production build passes (`npm run build`)
- [x] Preview server starts (`npm run preview`)

## Field-Test Ready Gates
- [ ] Frontend deployed URL opens successfully on Render
- [ ] Backend health endpoint returns `status: ok`
- [ ] Frontend uses live backend URL through `VITE_API_BASE_URL`
- [ ] Backend allows the deployed frontend via `FRONTEND_ORIGIN`
- [ ] Search page shows live backend or local fallback status clearly

## Navigation and Routing
- [ ] Top nav links route correctly (Find Workers, Pricing, For Societies, For Workers, Enterprise)
- [ ] Auth entry points (Sign in, Get started, Help/Login) route correctly
- [ ] Dashboard routes load correctly by role
- [ ] Mobile hamburger menu opens and closes without layout issues
- [ ] Easy Mode toggle is visible and usable on desktop and mobile
- [ ] Language toggle changes text without breaking layout

## Search and Discovery
- [ ] Filters apply correctly (role, city, rating, sort, radius)
- [ ] Grid/List toggle switches reliably
- [ ] Location actions work (detect, show/hide details, clear)
- [ ] Recommendation section updates with filters/location
- [ ] Worker profile opens from search results
- [ ] Search page note correctly reflects live backend vs local fallback

## Dashboard Usability
- [ ] Worker dashboard tabs and key actions work
- [ ] Employer dashboard tabs and key actions work
- [ ] Society dashboard tabs and key actions work
- [ ] Admin dashboard tabs and key actions work
- [ ] Each dashboard shows immediate toast/feedback for key actions

## UX and Accessibility
- [ ] Toast feedback appears for major actions
- [ ] Mobile layout usable at common breakpoints
- [ ] Keyboard navigation works for primary controls
- [ ] Text contrast is readable on liquid-glass surfaces
- [ ] Buttons and inputs remain large enough in Easy Mode
- [ ] Focus state is visible on primary controls

## API and Submission Flows
- [ ] Hire request submission returns success feedback
- [ ] Interview request submission returns success feedback
- [ ] Contact submission returns success feedback
- [ ] Empty required fields return a friendly validation message
- [ ] Backend `/api/workers` returns a valid list payload
- [ ] Backend `/api/workers/:id` returns a single worker record

## Final Sign-off
- [ ] Manual smoke test completed on Chrome
- [ ] Manual smoke test completed on Edge
- [ ] Optional smoke test on mobile browser
- [ ] Release sign-off approved

## QA Execution Plan (Day-by-Day)

### Day 1
- [ ] Navigation and auth route validation
- [ ] Dashboard entry-point validation by role

### Day 2
- [ ] Search/filter matrix validation
- [ ] Grid/List + recommendation behavior validation

### Day 3
- [ ] Worker + Employer dashboard action sweep
- [ ] Society + Admin dashboard action sweep

### Day 4
- [ ] Accessibility pass (keyboard, focus, labels)
- [ ] Visual consistency and contrast pass

### Day 5
- [ ] Performance smoke pass
- [ ] Final regression + sign-off prep
