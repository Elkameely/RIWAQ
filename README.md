# Riwaqul Ilm · رواق العلم

Online Arabic academy for working adults. React + Vite, plain CSS, no backend required to preview.

```bash
npm install
npm run dev       # development
npm run build     # production build in dist/
```

## Structure
```
src/
  data/        site.js (EDIT FIRST) · courses.js · schedule.js · quizzes.js
  lib/         api.js ← the only file that talks to a backend · AppContext.jsx · progress.js
  components/  Brand · Shared (CourseCard, WeekGrid) · PublicLayout
  pages/       Home · Public (courses, auth, about, contact) · app/ (student dashboard)
docs/
  SETUP_GUIDE.md   connect Supabase, Paystack, hosting
  schema.sql       database tables and security rules
```

Demo student: open **Sign in → Open demo student account**.
