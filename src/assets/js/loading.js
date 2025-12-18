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
function fateThreadTimeline() {
  const mainThread = document.querySelector('.thread--main')
  const branchGroup = document.querySelector('.thread__branches')
  const bloodGroup = document.querySelector('.thread__blood')
  const endingText = document.querySelector('.thread__ending')

  if (!mainThread) return

  const startX = 50
  let cycle = 0
  const MAX_CYCLE = 4

  function startCycle() {
    cycle++

    /* 초기화 */
    branchGroup.innerHTML = ''
    bloodGroup.innerHTML = ''
    gsap.set(endingText, { opacity: 0 })

    mainThread.setAttribute('d', `M ${startX} 0 L ${startX} 100`)
    gsap.set(mainThread, {
      strokeDasharray: 120,
      strokeDashoffset: 120,
      opacity: 1
    })

    const tl = gsap.timeline()

    /* 1️⃣ 메인 실 */
    tl.to(mainThread, {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: 'power2.out'
    })

    /* 2️⃣ 분기 생성 */
    tl.call(() => {
      const isEnding = cycle === MAX_CYCLE
      const branchCount = isEnding ? 12 : 6 + cycle * 3

      let created = []

      for (let i = 0; i < branchCount; i++) {
        const burst = isEnding ? Math.pow(2, i) : 1

        for (let j = 0; j < burst; j++) {
          const y = isEnding
            ? gsap.utils.random(15, 85)
            : gsap.utils.random(28, 65)

          const dir = Math.random() > 0.5 ? 1 : -1

          const length = isEnding
            ? gsap.utils.random(90, 160)
            : gsap.utils.random(14, 26)

          const curve = gsap.utils.random(8, 20)

          const branch = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
          )

          branch.setAttribute(
            'd',
            `
            M ${startX} ${y}
            C ${startX + curve * dir} ${y + 10},
              ${startX + length * dir} ${y + 18},
              ${startX + length * dir} ${y + 28}
          `
          )

          branch.classList.add('thread', 'thread--branch')
          branchGroup.appendChild(branch)
          created.push(branch)

          gsap.fromTo(
            branch,
            { strokeDasharray: 100, strokeDashoffset: 100 },
            {
              strokeDashoffset: 0,
              duration: isEnding ? 0.9 : 0.8,
              delay: isEnding
                ? i * 0.05 + j * 0.002   // 🔥 엔딩 폭주
                : i * 0.06,
              ease: 'power2.out'
            }
          )

          /* 🩸 피는 엔딩 제외 */
          if (!isEnding && Math.random() > 0.35) {
            const dropX = startX + length * dir

            const drop = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'circle'
            )

            drop.setAttribute('cx', dropX)
            drop.setAttribute('cy', y + 28)
            drop.setAttribute('r', 1)
            drop.classList.add('blood')
            bloodGroup.appendChild(drop)
            created.push(drop)

            gsap.to(drop, {
              cy: 96,
              opacity: 0,
              duration: 1.1,
              ease: 'power1.in',
              onComplete: () => {
                const stain = document.createElementNS(
                  'http://www.w3.org/2000/svg',
                  'circle'
                )
                stain.setAttribute('cx', dropX)
                stain.setAttribute('cy', 96)
                stain.setAttribute('r', 1.6)
                stain.classList.add('blood')
                stain.style.opacity = 0.6
                bloodGroup.appendChild(stain)
                created.push(stain)

                gsap.fromTo(
                  stain,
                  { scale: 0.6 },
                  {
                    scale: gsap.utils.random(2.2, 3),
                    opacity: 0.3,
                    duration: 1.2,
                    ease: 'power2.out'
                  }
                )
              }
            })
          }
        }
      }

      /* 3️⃣ 전체 소멸 */
      tl.to(
        created,
        {
          opacity: 0,
          duration: isEnding ? 1.4 : 0.9,
          ease: 'power2.in'
        },
        isEnding ? '+=0.8' : '+=1'
      )

      tl.to(mainThread, {
        opacity: 0,
        duration: isEnding ? 1.4 : 0.9,
        ease: 'power2.in',
        onComplete: () => {
          if (isEnding) {
            /* 4️⃣ 엔딩 텍스트 */
            gsap.to(endingText, {
              opacity: 1,
              duration: 1.6,
              ease: 'power2.out'
            })
          } else {
            startCycle()
          }
        }
      })
    })
  }

  startCycle()
}


// ===============================
// 4️⃣ AFTER THE SHOT – FLASH
// ===============================
function shotTimeline() {
  const image = document.querySelector('.shot__image')
  const flash = document.querySelector('.shot__flash')
  const smoke = document.querySelector('.shot__smoke')
  const bg = document.querySelector('.shot__bg')

  const lenis = new Lenis({ lerp: 0.05 })
  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1.8
  })

tl
  /* 1️⃣ 시작 상태 */
  .set(bg, { backgroundColor: '#fff' })
  .set(image, {
    x: 0,
    y: 0
  })

  /* 2️⃣ 왼쪽 → 중앙 (느리고 부드럽게) */
  .to(image, {
    x: window.innerWidth * 0.5,
    duration: 2.6,              // ⬅ 더 느리게
    ease: 'power3.out'           // ⬅ 더 부드럽게
  })

  /* 2-1️⃣ 거의 멈추듯 감속 */
  .to(image, {
    x: '+=8',                    // 아주 살짝만 더 이동
    duration: 0.4,
    ease: 'power1.out'
  })

  /* 3️⃣ 정적 (긴장 유지) */
  .to({}, { duration: 0.35 })

  /* 4️⃣ 총성 순간 */
  .to(bg, {
    backgroundColor: '#000',
    duration: 0.05,
    ease: 'none'
  })

  /* 5️⃣ 플래시 */
  .to(flash, { opacity: 1, duration: 0.03 })
  .to(flash, { opacity: 0, duration: 0.15 })

  /* 6️⃣ 반동 */
  .to(image, {
    x: '+=40',
    duration: 0.06,
    ease: 'power4.out'
  })
  .to(image, {
    x: '-=20',
    duration: 0.25,
    ease: 'power2.out'
  })

/* 7️⃣ 붉은 연기 확산 */
.to(smoke, {
  opacity: 0.75,
  scale: 1.25,          // ⬅ 크게 퍼짐
  duration: 0.6,
  ease: 'power2.out'
})
.to(smoke, {
  opacity: 0,
  scale: 1.6,           // ⬅ 더 넓게 확산
  duration: 1.3,
  ease: 'power2.in'
})

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
// export function bloodPactTimeline(onFinish) {
//   const stage = document.querySelector('.pact__stage')
//   const paper = document.querySelector('.pact__paper')
//   const ink = document.querySelector('.signature__ink')
//   const quill = document.querySelector('.signature__quill-shadow')
//   const envelope = document.querySelector('.pact__envelope')
//   const text = document.querySelector('.loading__text')

//   gsap.set([stage, text], { opacity: 0 })
//   gsap.set(ink, { width: 0 })
//   gsap.set(quill, { opacity: 0 })

//   const tl = gsap.timeline()

//   tl
//     /* 등장 */
//     .to(stage, { opacity: 1, duration: 0.6 })

//     /* 서명 */
//     .to(quill, { opacity: 1, duration: 0.3 })
//     .to(ink, {
//       width: '100%',
//       duration: 2,
//       ease: 'power2.out',
//       onUpdate() {
//         gsap.set(quill, { x: ink.offsetWidth })
//       }
//     }, '<')
//     .to(quill, { opacity: 0, duration: 0.3 })

//     /* 봉투로 들어감 */
//     .to(paper, {
//       y: 130,
//       scale: 0.95,
//       duration: 1.4,
//       ease: 'power2.inOut'
//     }, '+=0.2')

//     /* 봉투 + 계약서만 사라짐 */
//     .to([paper, envelope], {
//       opacity: 0,
//       duration: 1
//     })

//     /* 텍스트 유지 */
//     .to(text, {
//       opacity: 1,
//       duration: 1.2
//     })

//   tl.eventCallback('onComplete', () => {
//     if (onFinish) onFinish()
//   })
// }


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
    case 'loading--thread':
      fateThreadTimeline()
      break
    case 'loading--shot':
      shotTimeline()
      break
    case 'loading--hallway':
      hallwayTimeline()
      break
    case 'loading--rose':
      roseTimeline()
      break
    // case 'loading--pact':
    //   bloodPactTimeline()
    //   break
  }
}
