import Lenis from 'lenis'
import gsap from 'gsap'

// ===============================
// SELECTORS
// ===============================
const loaders = document.querySelectorAll('.loading')
let activeLoader = null

// ===============================
// RANDOM SELECT
// ===============================
function selectRandomLoader() {
  const index = Math.floor(Math.random() * loaders.length)
  loaders.forEach(el => (el.style.display = 'none'))
  activeLoader = loaders[index]
  activeLoader.style.display = 'block'
  return activeLoader.classList[1]
}

// ===============================
// 1️⃣ CCTV – CAMERA SHAKE (LENIS)
// ===============================
function cctvTimeline() {
  const grid = document.querySelector('.cctv__grid')

  const lenis = new Lenis({ lerp: 0.05 })
  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  function randomTime() {
    const h = String(Math.floor(Math.random() * 24)).padStart(2, '0')
    const m = String(Math.floor(Math.random() * 60)).padStart(2, '0')
    const s = String(Math.floor(Math.random() * 60)).padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  function buildScreens(num) {
    grid.innerHTML = ''
    grid.style.gridTemplateColumns = `repeat(${Math.sqrt(num)}, 1fr)`

    for (let i = 0; i < num; i++) {
      const screen = document.createElement('div')
      screen.className = 'cctv__screen'
      screen.innerHTML = `
        <div class="cctv__noise"></div>
        <div class="cctv__timestamp">REC ● ${randomTime()}</div>
      `
      grid.appendChild(screen)

      // 카메라 미세 흔들림
      gsap.fromTo(
        screen,
        { x: -2, y: -1 },
        {
          x: 2,
          y: 1,
          duration: 0.12,
          repeat: -1,
          yoyo: true,
          ease: 'none'
        }
      )
    }
  }

  // 1 → 2 → 4 → 8
  const steps = [1, 2, 4, 8]
  let stepIndex = 0

  const interval = setInterval(() => {
    buildScreens(steps[stepIndex])
    stepIndex++
    if (stepIndex >= steps.length) clearInterval(interval)
  }, 900)

  // 타임스탬프 랜덤 갱신
  setInterval(() => {
    document.querySelectorAll('.cctv__timestamp').forEach(ts => {
      ts.textContent = `REC ● ${randomTime()}`
    })
  }, 700)
}

// ===============================
// 2️⃣ INTERROGATION – LIGHT FLICKER
// ===============================
function interrogationTimeline() {
  const lenis = new Lenis({ lerp: 0.08 })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  // 처음엔 심하게 흔들림 → 점점 안정
  gsap.fromTo(
    '.interrogation__light',
    { x: -40, rotate: -3 },
    {
      x: 40,
      rotate: 3,
      duration: 0.15,
      repeat: 20,
      yoyo: true,
      ease: 'none',
      onComplete: () => {
        // 마지막에 멈춤
        gsap.to('.interrogation__light', {
          x: 0,
          rotate: 0,
          opacity: 0.9,
          duration: 1.2,
          ease: 'power2.out'
        })
      }
    }
  )
}
// ===============================
// 3️⃣ THREAD – FATE STRING
// ===============================

export function redMoonTimeline() {
  const moon = document.querySelector('.moon-base')
  if (!moon) return

  // 초기 상태
  gsap.set(moon, {
    clipPath: 'inset(0 100% 0 0)',
    backgroundColor: '#ffffff',
    scale: 1
  })

  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' }
  })

  /* 🌙 1. 오른쪽에서 부드럽게 차오름 */
  tl.to(moon, {
    clipPath: 'inset(0 0% 0 0)',
    duration: 4
  })

  /* 🔴 2. 초승달부터 붉게 물듦 (선명한 레드) */
  .to(moon, {
    backgroundColor: '#e60000', // 선명한 붉은색
    boxShadow: `
      0 0 25px rgba(230,0,0,0.6),
      0 0 60px rgba(230,0,0,0.4),
      0 0 120px rgba(230,0,0,0.2)
    `,
    duration: 3
  }, '-=3') // 초승달 시점

  /* 💓 3. 보름달 맥박 */
  .to(moon, {
    scale: 1.05,
    duration: 0.8,
    yoyo: true,
    repeat: 1,
    ease: 'sine.inOut'
  })
  .to(moon, {
  filter: 'brightness(1.2) saturate(1.4)',
  duration: 1
}, '-=1')


  return tl
}


// ===============================
// 4️⃣ AFTER THE SHOT – FLASH
// ===============================
export function chessLoading() {
  const lines = [
    "증거를 인멸하는 중...",
    "비밀 거래를 준비 중...",
    "타겟을 추적 중...",
    "배신자를 선별하는 중..."
  ];

  const el = document.querySelector(".typewriter");
  if (!el) return;

  const text = lines[Math.floor(Math.random() * lines.length)];
  let i = 0;

  el.textContent = "";

  const typing = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(typing);
  }, 80);
}


// ===============================
// 5️⃣ HALLWAY – CAMERA PUSH
// ===============================
function hallwayTimeline() {
  const dot = document.querySelector('.hallway__dot')
  const target = document.querySelector('.door--target')

  if (!dot || !target) return

  /* Lenis */
  const lenis = new Lenis({ lerp: 0.08 })
  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  /* 📌 404 span 위치 기준 계산 */
  const targetRect = target.getBoundingClientRect()
  const dotRect = dot.getBoundingClientRect()

  // dot이 404 "글자 왼쪽 살짝 앞"에 멈추게
  const targetX =
    targetRect.left -
    dotRect.width -
    6 // 글자와 살짝 간격

  /* 타임라인 */
  const tl = gsap.timeline()

  tl
    /* 1️⃣ 왼쪽 화면 밖 → 404 앞 */
    .fromTo(
      dot,
      { x: -window.innerWidth * 0.6 },
      {
        x: targetX,
        duration: 3.4,
        ease: 'power1.inOut'
      }
    )

    /* 2️⃣ 문 앞 정적 */
    .to({}, { duration: 0.25 })

    /* 3️⃣ 똑똑 노크 (404 글자를 향해) */
    .to(dot, {
      x: targetX + 6,
      duration: 0.08,
      ease: 'power1.in'
    })
    .to(dot, {
      x: targetX,
      duration: 0.12,
      ease: 'power1.out'
    })
    .to(dot, {
      x: targetX + 5,
      duration: 0.08,
      ease: 'power1.in'
    })
    .to(dot, {
      x: targetX,
      duration: 0.14,
      ease: 'power1.out'
    })

    /* 4️⃣ 마지막 노크 */
    .to(dot, {
      x: targetX + 8,
      duration: 0.06,
      ease: 'power2.in'
    })
    .to(dot, {
      x: targetX,
      duration: 0.2,
      ease: 'power2.out'
    })

  /* 🔥 화면 흔들림 (404에 가까울수록) */
  gsap.ticker.add(() => {
    const dotX = dot.getBoundingClientRect().left
    const distance = Math.abs(targetRect.left - dotX)

    let intensity = gsap.utils.clamp(
      0,
      1,
      1 - distance / window.innerWidth
    )

    // 노크 중에는 살짝 줄임
    if (tl.progress() > 0.7) intensity *= 0.4

    const shake = intensity * 12

    gsap.to('.loading--hallway', {
      x: gsap.utils.random(-shake, shake),
      y: gsap.utils.random(-shake * 0.6, shake * 0.6),
      duration: 0.06,
      ease: 'none',
      overwrite: true
    })
  })
}
// ===============================
// 6️⃣ ROSE & BLOOD – DRIP
// ===============================
function roseTimeline() {
  gsap.to('.drop', {
    y: 140,
    scale: 2.5,
    opacity: 0,
    stagger: 0.35,
    duration: 2,
    repeat: -1
  })
}

// ===============================
// 7️⃣ BLOOD PACT – SIGN
// ===============================


// ===============================
// INIT (EXPORTED)
// ===============================
export function loading() {
  if (!loaders.length) return

  const selected = selectRandomLoader()

  switch (selected) {
    case 'loading--cctv':
      cctvTimeline()
      break
    case 'loading--interrogation':
      interrogationTimeline()
      break
    case 'loading--redmoon':
      redMoonTimeline()
      break
    case 'loading--chess':   // ✅ 추가
      chessLoading()
      break
    case 'loading--hallway':
      hallwayTimeline()
      break
    case 'loading--rose':
      roseTimeline()
      break
  }
}
