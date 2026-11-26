import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const TEXT = {
  no: {
    backToMenu: '← Tilbake til meny',
    backToLanding: '← Tilbake',
    redeemSuccess: 'Klippet er nå registrert som brukt!',
    errServer: 'Kunne ikke kontakte serveren.',
    appTitle: 'Time Treat',
    heroTitle: 'Gi bort tid, ikke bare ting.',
    heroSub:
      'Lag et personlig, digitalt klippekort på 1 minutt. Send lenken som gave – mottakeren trenger verken app eller innlogging.',
    heroCta: 'Lag ditt første kort gratis',
    heroLogin: 'Jeg har allerede konto',
    demoTitle: 'Julegave til deg',
    demoFromTo: 'Til Mamma · Fra Per',
    demoPunches: [
      { label: 'Middag etter ditt valg', redeemed: true },
      { label: 'Barnevakt en helg', redeemed: false },
      { label: 'Kaffe på senga', redeemed: false },
    ],
    howItWorks: 'Slik fungerer det',
    step1: '1. Velg klipp og personlig tema.',
    step2: '2. Del den unike lenken (eller legg den i et fysisk kort).',
    step3: '3. Mottakeren løser inn klippene med 4-sifret PIN-kode fra deg.',
    loginTitle: 'Logg inn som giver',
    signupTitle: 'Opprett giverkonto',
    email: 'E-post',
    password: 'Passord (minst 6 tegn)',
    loginBtn: 'Logg inn',
    signupBtn: 'Opprett konto',
    switchToSignup: 'Ny her? Opprett konto',
    switchToLogin: 'Har du konto? Logg inn',
    logout: 'Logg ut',
    createCard: 'Lag nytt kort',
    cardTitle: 'Tittel på kortet',
    sender: 'Fra',
    recipient: 'Til',
    theme: 'Tema',
    punchesLabel: 'Klipp og 4-sifrede PIN-koder',
    addPunch: '+ Legg til klipp',
    saveCard: 'Opprett kort',
    yourCards: 'Dine kort',
    noCards: 'Du har ikke laget noen kort ennå.',
    copyLink: 'Kopier lenke',
    copied: 'Kopiert!',
    showPins: 'Vis PIN-koder',
    hidePins: 'Skjul PIN-koder',
    openCard: 'Åpne kort',
    redeem: 'Løs inn',
    redeemed: 'Brukt',
    enterPin: 'Skriv inn 4-sifret PIN-kode for å bruke klippet:',
    confirmPin: 'Bekreft klipp',
    cancel: 'Avbryt',
    progress: (used, total) => `${used} av ${total} klipp brukt`,
    fromTo: (s, r) => `Til ${r} · Fra ${s}`,
    loading: 'Laster...',
    cardNotFound: 'Fant ikke kortet. Sjekk at lenken er riktig.',
    errInvalidPin: (left) => `Feil PIN-kode. ${left} forsøk igjen før sperre.`,
    errLocked: 'For mange feilforsøk. Dette klippet er sperret i 15 minutter.',
    errAlready: 'Dette klippet er allerede brukt.',
    signupCheckEmail:
      'Konto opprettet! Sjekk e-posten din for bekreftelseslenke før du logger inn.',
  },
  en: {
    backToMenu: '← Back to menu',
    backToLanding: '← Back',
    redeemSuccess: 'Treat successfully redeemed!',
    errServer: 'Could not reach the server.',
    appTitle: 'Time Treat',
    heroTitle: 'Gift your time, not just things.',
    heroSub:
      'Create a personal digital punch card in 1 minute. Share the link as a gift — no app or login required for the recipient.',
    heroCta: 'Create your first card free',
    heroLogin: 'I already have an account',
    demoTitle: 'Holiday Gift for You',
    demoFromTo: 'For Mom · From Per',
    demoPunches: [
      { label: 'Dinner of your choice', redeemed: true },
      { label: 'Babysitting for a weekend', redeemed: false },
      { label: 'Coffee in bed', redeemed: false },
    ],
    howItWorks: 'How it works',
    step1: '1. Add your treats and pick a theme.',
    step2: '2. Share the unique link (or print it in a gift card).',
    step3: '3. The recipient redeems each treat using a 4-digit PIN from you.',
    loginTitle: 'Sign in as giver',
    signupTitle: 'Create giver account',
    email: 'Email',
    password: 'Password (min 6 characters)',
    loginBtn: 'Sign in',
    signupBtn: 'Create account',
    switchToSignup: 'New here? Create account',
    switchToLogin: 'Have an account? Sign in',
    logout: 'Sign out',
    createCard: 'Create new card',
    cardTitle: 'Card title',
    sender: 'From',
    recipient: 'To',
    theme: 'Theme',
    punchesLabel: 'Treats & 4-digit PINs',
    addPunch: '+ Add treat',
    saveCard: 'Create card',
    yourCards: 'Your cards',
    noCards: 'You have not created any cards yet.',
    copyLink: 'Copy link',
    copied: 'Copied!',
    showPins: 'Show PINs',
    hidePins: 'Hide PINs',
    openCard: 'Open card',
    redeem: 'Redeem',
    redeemed: 'Used',
    enterPin: 'Enter the 4-digit PIN to redeem this treat:',
    confirmPin: 'Confirm',
    cancel: 'Cancel',
    progress: (used, total) => `${used} of ${total} used`,
    fromTo: (s, r) => `For ${r} · From ${s}`,
    loading: 'Loading...',
    cardNotFound: 'Card not found. Please check the link.',
    errInvalidPin: (left) => `Incorrect PIN. ${left} attempts remaining.`,
    errLocked: 'Too many failed attempts. Locked for 15 minutes.',
    errAlready: 'This treat has already been redeemed.',
    signupCheckEmail:
      'Account created! Check your email for a confirmation link before signing in.',
  },
}

const randomPin = () => String(Math.floor(1000 + Math.random() * 9000))

export default function App() {
  const [lang, setLang] = useState('no')
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  )
  const t = TEXT[lang]

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    )
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const params = new URLSearchParams(window.location.search)
  const publicCardId = params.get('card')

  return (
    <div className="app-shell">
 <header
        className="top-bar"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
        }}
      >
        <div style={{ justifySelf: 'start' }}>
          <button
            className="btn-secondary btn-small"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <div
          className="brand"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: 'clamp(1.25rem, 4.5vw, 1.75rem)',
            whiteSpace: 'nowrap',
          }}
        >
          <img
            src="/icon-192.jpg"
            alt="Time Treat"
            style={{ width: 36, height: 36, borderRadius: 9 }}
          />
          <span>{t.appTitle}</span>
        </div>
        <div style={{ justifySelf: 'end' }}>
          <button
            className="btn-secondary btn-small"
            onClick={() => setLang(lang === 'no' ? 'en' : 'no')}
          >
            {lang === 'no' ? 'EN' : 'NO'}
          </button>
        </div>
      </header>

      {publicCardId ? (
        <PublicCardView cardId={publicCardId} t={t} />
      ) : (
        <AdminApp t={t} />
      )}
    </div>
  )
}

function PublicCardView({ cardId, t }) {
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activePunch, setActivePunch] = useState(null)
  const [pinInput, setPinInput] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const loadCard = async () => {
    setLoading(true)
    const { data, error: rpcError } = await supabase.rpc('get_public_card', {
      p_card_id: cardId,
    })
    if (!rpcError && data) setCard(data)
    setLoading(false)
  }

  useEffect(() => {
    loadCard()
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session)
    })
  }, [cardId])

  const handleRedeem = async (e) => {
    e.preventDefault()
    if (!activePunch) return
    setSubmitting(true)
    setError('')

    const { data, error: rpcError } = await supabase.rpc('redeem_punch', {
      p_punch_id: activePunch.id,
      p_pin: pinInput,
    })

    setSubmitting(false)

    if (rpcError || !data) {
      setError(t.errServer)
      return
    }

    if (data.success) {
      setActivePunch(null)
      setPinInput('')
      setSuccessMsg(t.redeemSuccess)
      loadCard()
    } else if (data.error === 'invalid_pin') {
      setError(t.errInvalidPin(data.attempts_left))
    } else if (data.error === 'locked') {
      setError(t.errLocked)
    } else if (data.error === 'already_redeemed') {
      setError(t.errAlready)
      loadCard()
    }
  }

  if (loading) return <div className="panel">{t.loading}</div>
  if (!card) return <div className="panel">{t.cardNotFound}</div>

  const usedCount = card.punches.filter((p) => p.redeemed).length

  return (
    <div className={`gift-card theme-${card.theme || 'cream'}`}>
      {isLoggedIn && (
        <button
          className="btn-secondary btn-small"
          style={{ marginBottom: '1rem' }}
          onClick={() => (window.location.href = window.location.origin)}
        >
          {t.backToMenu}
        </button>
      )}

      <h1>{card.title}</h1>
      <div className="card-meta">
        <div>{t.fromTo(card.sender, card.recipient)}</div>
        <div>{t.progress(usedCount, card.punches.length)}</div>
      </div>

      {successMsg && <div className="info-box">{successMsg}</div>}

      <div className="punch-grid">
        {card.punches.map((punch) => (
          <div
            key={punch.id}
            className={`punch-item ${punch.redeemed ? 'redeemed' : ''}`}
          >
            <div>
              <strong>{punch.label}</strong>
            </div>
            {punch.redeemed ? (
              <span className="badge badge-done">{t.redeemed}</span>
            ) : (
              <button
                className="btn-primary btn-small"
                onClick={() => {
                  setActivePunch(punch)
                  setPinInput('')
                  setError('')
                  setSuccessMsg('')
                }}
              >
                {t.redeem}
              </button>
            )}
          </div>
        ))}
      </div>

      {activePunch && (
        <form className="pin-modal" onSubmit={handleRedeem}>
          <h3>{activePunch.label}</h3>
          <p>{t.enterPin}</p>
          {error && <div className="error-box">{error}</div>}
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="0000"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
            autoFocus
            required
          />
          <div className="row">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setActivePunch(null)}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || pinInput.length !== 4}
            >
              {t.confirmPin}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function AdminApp({ t }) {
  const [session, setSession] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMsg, setAuthMsg] = useState('')
  const [authErr, setAuthErr] = useState('')

  const [cards, setCards] = useState([])
  const [openPins, setOpenPins] = useState({})
  const [copiedId, setCopiedId] = useState(null)

  const [title, setTitle] = useState('')
  const [sender, setSender] = useState('')
  const [recipient, setRecipient] = useState('')
  const [theme, setTheme] = useState('cream')
  const [punches, setPunches] = useState([
    { label: 'Middag etter ditt valg', pin: randomPin() },
    { label: 'Frikveld', pin: randomPin() },
    { label: 'Kaffe på senga', pin: randomPin() },
  ])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const loadCards = async () => {
    const { data } = await supabase
      .from('cards')
      .select('*, punches(*, punch_secrets(pin_code))')
      .order('created_at', { ascending: false })
    if (data) setCards(data)
  }

  useEffect(() => {
    if (session) loadCards()
  }, [session])

  const handleAuth = async (e) => {
    e.preventDefault()
    setAuthErr('')
    setAuthMsg('')

    if (authMode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setAuthErr(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setAuthErr(error.message)
      else setAuthMsg(t.signupCheckEmail)
    }
  }

  const handleCreateCard = async (e) => {
    e.preventDefault()
    setSaving(true)

    const { data: card, error: cardErr } = await supabase
      .from('cards')
      .insert({
        owner_id: session.user.id,
        title,
        sender,
        recipient,
        theme,
      })
      .select()
      .single()

    if (cardErr || !card) {
      setSaving(false)
      return
    }

    const validPunches = punches.filter((p) => p.label.trim() !== '')
    const { data: insertedPunches } = await supabase
      .from('punches')
      .insert(
        validPunches.map((p, idx) => ({
          card_id: card.id,
          sort_order: idx + 1,
          label: p.label.trim(),
        }))
      )
      .select()

    if (insertedPunches) {
      await supabase.from('punch_secrets').insert(
        insertedPunches.map((p, idx) => ({
          punch_id: p.id,
          owner_id: session.user.id,
          pin_code: validPunches[idx].pin,
        }))
      )
    }

    setTitle('')
    setSender('')
    setRecipient('')
    setPunches([{ label: '', pin: randomPin() }])
    setSaving(false)
    loadCards()
  }

  const copyCardLink = (id) => {
    const url = `${window.location.origin}/?card=${id}`
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!session) {
    if (!showAuth) {
      return (
        <>
          <div className="panel" style={{ textAlign: 'center' }}>
            <img
              src="/icon-192.jpg"
              alt="Time Treat"
              style={{ width: 64, height: 64, borderRadius: 16, marginBottom: '1rem' }}
            />
            <h1 style={{ marginTop: 0 }}>{t.heroTitle}</h1>
            <p style={{ opacity: 0.85, marginBottom: '1.5rem' }}>{t.heroSub}</p>
            <button
              className="btn-primary"
              style={{ width: '100%', marginBottom: '0.6rem' }}
              onClick={() => {
                setAuthMode('signup')
                setShowAuth(true)
              }}
            >
              {t.heroCta}
            </button>
            <button
              className="btn-secondary"
              style={{ width: '100%' }}
              onClick={() => {
                setAuthMode('login')
                setShowAuth(true)
              }}
            >
              {t.heroLogin}
            </button>
          </div>

          <div
            className="gift-card theme-cream"
            style={{ marginTop: '1rem', pointerEvents: 'none' }}
          >
            <h2 style={{ marginTop: 0 }}>{t.demoTitle}</h2>
            <div className="card-meta">
              <div>{t.demoFromTo}</div>
              <div>{t.progress(1, 3)}</div>
            </div>
            <div className="punch-grid">
              {t.demoPunches.map((p, idx) => (
                <div
                  key={idx}
                  className={`punch-item ${p.redeemed ? 'redeemed' : ''}`}
                >
                  <div>
                    <strong>{p.label}</strong>
                  </div>
                  {p.redeemed ? (
                    <span className="badge badge-done">{t.redeemed}</span>
                  ) : (
                    <span className="btn-primary btn-small">{t.redeem}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="panel" style={{ marginTop: '1rem' }}>
            <h3 style={{ marginTop: 0 }}>{t.howItWorks}</h3>
            <p>{t.step1}</p>
            <p>{t.step2}</p>
            <p style={{ marginBottom: 0 }}>{t.step3}</p>
          </div>
        </>
      )
    }

    return (
      <form className="panel" onSubmit={handleAuth}>
        <button
          type="button"
          className="btn-secondary btn-small"
          style={{ marginBottom: '1rem' }}
          onClick={() => {
            setShowAuth(false)
            setAuthErr('')
            setAuthMsg('')
          }}
        >
          {t.backToLanding}
        </button>
        <h2>{authMode === 'login' ? t.loginTitle : t.signupTitle}</h2>
        {authErr && <div className="error-box">{authErr}</div>}
        {authMsg && <div className="info-box">{authMsg}</div>}
        <label>{t.email}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>{t.password}</label>
        <input
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          {authMode === 'login' ? t.loginBtn : t.signupBtn}
        </button>
        <button
          type="button"
          className="btn-secondary"
          style={{ width: '100%', marginTop: '0.6rem' }}
          onClick={() => {
            setAuthMode(authMode === 'login' ? 'signup' : 'login')
            setAuthErr('')
            setAuthMsg('')
          }}
        >
          {authMode === 'login' ? t.switchToSignup : t.switchToLogin}
        </button>
      </form>
    )
  }

  return (
    <>
      <div className="panel">
        <div className="top-bar" style={{ marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>{t.createCard}</h2>
          <button
            className="btn-secondary btn-small"
            onClick={() => supabase.auth.signOut()}
          >
            {t.logout}
          </button>
        </div>

        <form onSubmit={handleCreateCard}>
          <label>{t.cardTitle}</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="F.eks. Bursdagsgave til mamma"
            required
          />
          <div className="row">
            <div>
              <label>{t.sender}</label>
              <input
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                required
              />
            </div>
            <div>
              <label>{t.recipient}</label>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>
          </div>

          <label>{t.theme}</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="cream">Krem / Cream</option>
            <option value="sage">Salviegrønn / Sage</option>
            <option value="midnight">Midnatt / Midnight</option>
          </select>

          <label>{t.punchesLabel}</label>
          {punches.map((p, idx) => (
            <div className="punch-input-row" key={idx}>
              <input
                value={p.label}
                placeholder={`Klipp #${idx + 1}`}
                onChange={(e) => {
                  const next = [...punches]
                  next[idx].label = e.target.value
                  setPunches(next)
                }}
                required
              />
              <input
                className="pin-field"
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={p.pin}
                onChange={(e) => {
                  const next = [...punches]
                  next[idx].pin = e.target.value.replace(/\D/g, '')
                  setPunches(next)
                }}
                required
              />
              {punches.length > 1 && (
                <button
                  type="button"
                  className="btn-secondary btn-small"
                  onClick={() =>
                    setPunches(punches.filter((_, i) => i !== idx))
                  }
                  aria-label="Fjern"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <div className="row" style={{ marginTop: '0.75rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                setPunches([...punches, { label: '', pin: randomPin() }])
              }
            >
              {t.addPunch}
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {t.saveCard}
            </button>
          </div>
        </form>
      </div>

      <div className="panel">
        <h2>{t.yourCards}</h2>
        {cards.length === 0 ? (
          <p>{t.noCards}</p>
        ) : (
          cards.map((c) => {
            const sortedPunches = [...(c.punches || [])].sort(
              (a, b) => a.sort_order - b.sort_order
            )
            return (
              <div className="admin-card-item" key={c.id}>
                <strong>{c.title}</strong>
                <div className="card-meta" style={{ marginBottom: '0.6rem' }}>
                  {t.fromTo(c.sender, c.recipient)}
                </div>
                <div className="row">
                  <button
                    className="btn-primary btn-small"
                    onClick={() => copyCardLink(c.id)}
                  >
                    {copiedId === c.id ? t.copied : t.copyLink}
                  </button>
                  <button
                    className="btn-secondary btn-small"
                    onClick={() =>
                      window.open(
                        `${window.location.origin}/?card=${c.id}`,
                        '_blank'
                      )
                    }
                  >
                    {t.openCard}
                  </button>
                  <button
                    className="btn-secondary btn-small"
                    onClick={() =>
                      setOpenPins({ ...openPins, [c.id]: !openPins[c.id] })
                    }
                  >
                    {openPins[c.id] ? t.hidePins : t.showPins}
                  </button>
                </div>

                {openPins[c.id] && (
                  <div className="pin-list">
                    {sortedPunches.map((p) => (
                      <div className="pin-list-row" key={p.id}>
                        <span>
                          {p.label} {p.redeemed ? '✓' : ''}
                        </span>
                        <span className="code-pill">
                          {p.punch_secrets?.pin_code || '----'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </>
  )
}