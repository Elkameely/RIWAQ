import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as api from './api'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

const blank = { enrolled: [], done: {}, attempts: [], payments: [], activity: [] }

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [data, setData] = useState(blank)
  const [ready, setReady] = useState(false)
  const [toast, setToast] = useState(null)

  const say = useCallback((msg) => {
    setToast({ msg, id: Date.now() })
    setTimeout(() => setToast((t) => (t && Date.now() - t.id >= 2900 ? null : t)), 3000)
  }, [])

  const hydrate = useCallback(async (u) => {
    setUser(u)
    setData(u ? await api.getData(u.id) : blank)
  }, [])

  useEffect(() => {
    api.getSession().then(hydrate).finally(() => setReady(true))
  }, [hydrate])

  const value = useMemo(
    () => ({
      user, data, ready, say,
      signUp: async (f) => hydrate(await api.signUp(f)),
      signIn: async (f) => hydrate(await api.signIn(f)),
      demo: async () => hydrate(await api.demoLogin()),
      signOut: async () => { await api.signOut(); await hydrate(null) },
      updateProfile: async (p) => setUser(await api.updateProfile(user.id, p)),
      enroll: async (courseId) => setData(await api.enroll(user.id, courseId)),
      toggleLesson: async (lessonId) => setData(await api.toggleLesson(user.id, lessonId)),
      saveAttempt: async (a) => setData(await api.saveAttempt(user.id, a)),
    }),
    [user, data, ready, say, hydrate],
  )

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite">{toast && <div className="toast" key={toast.id}>{toast.msg}</div>}</div>
    </Ctx.Provider>
  )
}
