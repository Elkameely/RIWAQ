import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../services/api';
import { startCheckout } from '../services/payments';
import { COURSES, allLessons, getCourse } from '../data/courses';
import { quizzesForCourse } from '../data/quizzes';
import { PASS_MARK } from '../config';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const EMPTY = { enrolments: [], completed: [], results: [] };

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(EMPTY);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async (u) => {
    setData(u ? await api.getStudentData(u.id) : EMPTY);
  }, []);

  useEffect(() => {
    (async () => {
      const u = await api.getSession();
      setUser(u);
      await refresh(u);
      setReady(true);
    })();
  }, [refresh]);

  const begin = async (u) => {
    setUser(u);
    await refresh(u);
    return u;
  };

  const actions = useMemo(
    () => ({
      signUp: async (f) => begin(await api.signUp(f)),
      signIn: async (f) => begin(await api.signIn(f)),
      demo: async () => begin(await api.seedDemo()),
      signOut: async () => {
        await api.signOut();
        setUser(null);
        setData(EMPTY);
      },
      updateProfile: async (f) => setUser(await api.updateProfile(user.id, f)),
      enroll: async (slug) => {
        const course = getCourse(slug);
        await startCheckout({ user, course });
        await api.enroll(user.id, slug);
        await refresh(user);
      },
      setLessonDone: async (lessonId, done) => {
        await api.setLessonDone(user.id, lessonId, done);
        await refresh(user);
      },
      saveResult: async (quizId, score, total) => {
        await api.saveResult(user.id, quizId, score, total);
        await refresh(user);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, refresh],
  );

  const derived = useMemo(() => {
    const doneSet = new Set(data.completed.map((c) => c.lessonId));
    const best = {};
    data.results.forEach((r) => {
      const pct = r.score / r.total;
      if (!best[r.quizId] || pct > best[r.quizId]) best[r.quizId] = pct;
    });
    const enrolledSlugs = new Set(data.enrolments.map((e) => e.courseId));

    const progress = (course) => {
      const ls = allLessons(course);
      const done = ls.filter((l) => doneSet.has(l.id)).length;
      return { done, total: ls.length, pct: ls.length ? Math.round((done / ls.length) * 100) : 0 };
    };
    const quizState = (course) => {
      const qs = quizzesForCourse(course.slug);
      const passed = qs.filter((q) => (best[q.id] || 0) >= PASS_MARK).length;
      return { passed, total: qs.length };
    };
    const isComplete = (course) => {
      const p = progress(course);
      const q = quizState(course);
      return p.pct === 100 && q.passed === q.total;
    };
    const completionDate = (course) => {
      const ids = new Set(allLessons(course).map((l) => l.id));
      const qids = new Set(quizzesForCourse(course.slug).map((q) => q.id));
      const dates = [
        ...data.completed.filter((c) => ids.has(c.lessonId)).map((c) => c.at),
        ...data.results.filter((r) => qids.has(r.quizId) && r.score / r.total >= PASS_MARK).map((r) => r.at),
      ].sort();
      return dates.length ? new Date(dates[dates.length - 1]) : new Date();
    };

    return {
      doneSet,
      best,
      enrolledSlugs,
      enrolledCourses: COURSES.filter((c) => enrolledSlugs.has(c.slug)),
      progress,
      quizState,
      isComplete,
      completionDate,
    };
  }, [data]);

  const value = { user, ready, data, ...derived, ...actions };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
