'client'
import { MOOD } from 'pages/api/constants'
import { useRef, useEffect, useCallback, useState, useMemo } from 'react'
import { audioPlayerQueue } from 'services/AudioPlayerQueueService'

interface Sprite {
  radius: number
  position: number
  width: number
}

interface CanvasProps {
  thinking?: boolean
  active?: boolean
  className?: string
  visualData?: Uint8Array | null
  size: number
}

interface Sprite {
  radius: number
  position: number
  width: number
}

const HEAD_SIZE = 1000
const HEAD_RADIUS = 250
const HEAD_LINE_WIDTH = 30
const HEAD_ANGLE_INCREMENT = Math.PI / 50
const HEAD_START_X = 500
const HEAD_START_Y = 495
const HEAD_ORBIT_RADIUS = 275
const HEAD_ORBIT_LINE_WIDTH_SCALE = 3
const HEAD_ANIMATION_DELAY = 1000 / 30

const Canvas: React.FC<CanvasProps> = ({
  thinking: startAnimation = false,
  active = false,
  size,
  className,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [mouseHover, setMouseHover] = useState(false)
  const [chance, setChance] = useState(0)
  const [scaled, setScaled] = useState(false)
  const [sentiment, setSentiment] = useState<MOOD>('neutral')
  const offsets: Sprite[] = useMemo(() => {
    const arr: Sprite[] = []
    for (let j = 0; j < 40; j++) {
      arr.push({
        radius: Math.random() * 150,
        position: Math.random() * 200,
        width: Math.random() * 20,
      })
    }
    return arr
  }, [])

  const animate = useCallback(() => {
    let visualData: Uint8Array | null = null
    if (audioPlayerQueue.isPlaying()) {
      audioPlayerQueue.stepVisualizer()
      visualData = audioPlayerQueue.getVisualData()
      if (audioPlayerQueue.getSentiment() !== sentiment) {
        setSentiment(audioPlayerQueue.getSentiment())
      }
    }

    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d')
      const ctx = canvasCtxRef.current
      const drawHead = (ctx: CanvasRenderingContext2D) => {
        const scale = size / HEAD_SIZE
        ctx.fillStyle = '#FFFFFF50'
        if (!scaled) {
          setScaled(true)
        }
        ctx.fillRect(0, 0, HEAD_SIZE * scale, HEAD_SIZE * scale)
        ctx.beginPath()
        ctx.lineWidth = HEAD_LINE_WIDTH * scale
        const gradient = ctx.createLinearGradient(
          HEAD_START_X * scale,
          HEAD_START_Y * scale,
          HEAD_SIZE * scale,
          HEAD_START_Y * scale,
        )
        gradient.addColorStop(0, active ? '#53CCF9' : '#7c96a0')
        gradient.addColorStop(0.5, active ? '#71F6AB' : '#9bc4ad')
        gradient.addColorStop(1.0, 'white')
        ctx.strokeStyle = gradient
        //if (!visualData) {
        ctx.lineCap = 'round'
        ctx.ellipse(
          // head
          HEAD_START_X * scale,
          HEAD_START_Y * scale,
          (mouseHover ? HEAD_RADIUS * 1.02 : HEAD_RADIUS) * scale * 1.1,
          (mouseHover ? HEAD_RADIUS * 1.02 : HEAD_RADIUS) * scale * 0.85,
          0,
          (Math.PI * 3) / 4,
          (Math.PI * 9) / 4,
        )
        //}
        ctx.stroke()
        ctx.beginPath()
        ctx.ellipse(
          // left ear
          (HEAD_START_X * scale) / 2.5,
          HEAD_START_Y * scale,
          (mouseHover ? HEAD_RADIUS * 1.02 : HEAD_RADIUS) * scale * 0.05,
          (mouseHover ? HEAD_RADIUS * 1.02 : HEAD_RADIUS) * scale * 0.25,
          0,
          Math.PI * 2,
          0,
        )
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.ellipse(
          // right ear
          HEAD_START_X * scale * 1.598,
          HEAD_START_Y * scale,
          (mouseHover ? HEAD_RADIUS * 1.02 : HEAD_RADIUS) * scale * 0.05,
          (mouseHover ? HEAD_RADIUS * 1.02 : HEAD_RADIUS) * scale * 0.25,
          0,
          Math.PI * 2,
          0,
        )
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.stroke()
        ctx.lineCap = 'round'

        ctx.beginPath()
        ctx.arc(
          // left mic
          (HEAD_START_X - 160) * scale,
          (HEAD_START_X + 155) * scale,
          (mouseHover ? 1.08 : 1) * 10,
          0,
          Math.PI * 2,
        )
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(
          // right mic
          (HEAD_START_X + 160) * scale,
          (HEAD_START_X + 155) * scale,
          (mouseHover ? 1.08 : 1) * 10,
          0,
          Math.PI * 2,
        )
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(
          HEAD_START_X * scale,
          (HEAD_START_Y + HEAD_RADIUS + HEAD_LINE_WIDTH * scale) * scale,
        )
        // ctx.lineTo(HEAD_START_X * scale, HEAD_SIZE * 2)
        ctx.stroke()

        const sleeping = (
          ctx: CanvasRenderingContext2D,
          scale: number,
          gradient: CanvasGradient,
        ) => {
          ctx.beginPath() // right eye (sleeping)
          ctx.moveTo((HEAD_START_X + 50) * scale, (HEAD_START_X + 5) * scale)
          ctx.quadraticCurveTo(
            (HEAD_START_X + 110) * scale,
            (HEAD_START_X + 90) * scale,
            (HEAD_START_X + 170) * scale,
            (HEAD_START_X + 5) * scale,
          )
          ctx.quadraticCurveTo(
            (HEAD_START_X + 110) * scale,
            (HEAD_START_X + 50) * scale,
            (HEAD_START_X + 50) * scale,
            (HEAD_START_X + 5) * scale,
          )
          // ctx.stroke()
          ctx.fillStyle = gradient
          ctx.fill()
          ctx.beginPath() // left eye (sleeping)
          ctx.moveTo((HEAD_START_X - 50) * scale, (HEAD_START_X + 5) * scale)
          ctx.quadraticCurveTo(
            (HEAD_START_X - 110) * scale,
            (HEAD_START_X + 90) * scale,
            (HEAD_START_X - 170) * scale,
            (HEAD_START_X + 5) * scale,
          )
          ctx.quadraticCurveTo(
            (HEAD_START_X - 110) * scale,
            (HEAD_START_X + 50) * scale,
            (HEAD_START_X - 50) * scale,
            (HEAD_START_X + 5) * scale,
          )
          // ctx.stroke()
          ctx.fillStyle = gradient
          ctx.fill()

          ctx.beginPath() // big Z (sleeping)
          const startLocation = chance % 120
          const newSize = scale + startLocation * 0.0015
          ctx.moveTo(
            (HEAD_START_X + 300 - startLocation) * newSize,
            (HEAD_START_X - 220 - startLocation) * newSize,
          )
          ctx.lineTo(
            (HEAD_START_X + 230 - startLocation) * newSize,
            (HEAD_START_X - 220 - startLocation) * newSize,
          )
          ctx.lineTo(
            (HEAD_START_X + 300 - startLocation) * newSize,
            (HEAD_START_X - 290 - startLocation) * newSize,
          )
          ctx.lineTo(
            (HEAD_START_X + 230 - startLocation) * newSize,
            (HEAD_START_X - 290 - startLocation) * newSize,
          )
          ctx.stroke()
          const startLocation2 = chance % 160
          const newSize2 = scale + startLocation2 * 0.00075
          ctx.beginPath() // small Z (sleeping)
          ctx.moveTo(
            (HEAD_START_X + 190 + startLocation2) * newSize2,
            (HEAD_START_X - 310 - startLocation2) * newSize2,
          )
          ctx.lineTo(
            (HEAD_START_X + 145 + startLocation2) * newSize2,
            (HEAD_START_X - 310 - startLocation2) * newSize2,
          )
          ctx.lineTo(
            (HEAD_START_X + 190 + startLocation2) * newSize2,
            (HEAD_START_X - 360 - startLocation2) * newSize2,
          )
          ctx.lineTo(
            (HEAD_START_X + 145 + startLocation2) * newSize2,
            (HEAD_START_X - 360 - startLocation2) * newSize2,
          )
          ctx.stroke()
        }

        const normal = (
          ctx: CanvasRenderingContext2D,
          scale: number,
          gradient: CanvasGradient,
        ) => {
          ctx.beginPath()
          ctx.ellipse(
            // left eye (normal)
            (HEAD_START_X - 80) * scale,
            (HEAD_START_X - 15) * scale,
            (mouseHover ? 1.08 : 1) * 5.7,
            (mouseHover ? 1.08 : 1) * 21,
            0,
            0,
            Math.PI * 2,
          )
          ctx.stroke()
          ctx.fillStyle = gradient
          ctx.fill()

          ctx.beginPath()
          ctx.ellipse(
            // left eye (normal)
            (HEAD_START_X + 80) * scale,
            (HEAD_START_X - 15) * scale,
            (mouseHover ? 1.08 : 1) * 5.7,
            (mouseHover ? 1.08 : 1) * 21,
            0,
            0,
            Math.PI * 2,
          )
          ctx.stroke()
          ctx.fillStyle = gradient
          ctx.fill()
        }

        const smiling = (
          ctx: CanvasRenderingContext2D,
          scale: number,
          gradient: CanvasGradient,
        ) => {
          ctx.beginPath() // right eye (smiling)
          ctx.moveTo((HEAD_START_X + 50) * scale, (HEAD_START_X + 5) * scale)
          ctx.quadraticCurveTo(
            (HEAD_START_X + 110) * scale,
            (HEAD_START_X - 90) * scale,
            (HEAD_START_X + 170) * scale,
            (HEAD_START_X - 15) * scale,
          )
          ctx.quadraticCurveTo(
            (HEAD_START_X + 110) * scale,
            (HEAD_START_X - 50) * scale,
            (HEAD_START_X + 50) * scale,
            (HEAD_START_X + 5) * scale,
          )
          // ctx.stroke()
          ctx.fillStyle = gradient
          ctx.fill()
          ctx.beginPath() // left eye (smiling)
          ctx.moveTo((HEAD_START_X - 50) * scale, (HEAD_START_X + 5) * scale)
          ctx.quadraticCurveTo(
            (HEAD_START_X - 110) * scale,
            (HEAD_START_X - 90) * scale,
            (HEAD_START_X - 170) * scale,
            (HEAD_START_X - 15) * scale,
          )
          ctx.quadraticCurveTo(
            (HEAD_START_X - 110) * scale,
            (HEAD_START_X - 50) * scale,
            (HEAD_START_X - 50) * scale,
            (HEAD_START_X + 5) * scale,
          )
          // ctx.stroke()
          ctx.fillStyle = gradient
          ctx.fill()
        }

        const confused = (
          ctx: CanvasRenderingContext2D,
          scale: number,
          gradient: CanvasGradient,
        ) => {
          ctx.beginPath() // right eye (confused)
          ctx.ellipse(
            (HEAD_START_X + 80) * scale,
            (HEAD_START_X - 25) * scale,
            (mouseHover ? 1.08 : 1) * 9,
            (mouseHover ? 1.08 : 1) * 20,
            0,
            0,
            Math.PI * 2,
          )
          ctx.stroke()
          ctx.fillStyle = gradient
          ctx.fill()

          ctx.beginPath() // left eye (confused)
          ctx.ellipse(
            (HEAD_START_X - 80) * scale,
            (HEAD_START_X - 15) * scale,
            (mouseHover ? 1.08 : 1) * 14,
            (mouseHover ? 1.08 : 1) * 22,
            0,
            (Math.PI * -3) / 8,
            (Math.PI * 10) / 8,
          )
          ctx.fillStyle = gradient
          ctx.fill()

          ctx.beginPath() // question mark dot (confused)
          ctx.arc(
            (HEAD_START_X + 280) * scale,
            (HEAD_START_X - 200) * scale,
            6,
            0,
            Math.PI * 2,
          )
          ctx.fillStyle = gradient
          ctx.fill()

          ctx.beginPath() // question mark curve (confused)
          ctx.moveTo((HEAD_START_X + 280) * scale, (HEAD_START_X - 250) * scale)
          ctx.quadraticCurveTo(
            (HEAD_START_X + 280) * scale,
            (HEAD_START_X - 270) * scale,
            (HEAD_START_X + 300) * scale,
            (HEAD_START_X - 285) * scale,
          )
          ctx.quadraticCurveTo(
            (HEAD_START_X + 330) * scale,
            (HEAD_START_X - 325) * scale,
            (HEAD_START_X + 280) * scale,
            (HEAD_START_X - 335) * scale,
          )
          ctx.quadraticCurveTo(
            (HEAD_START_X + 255) * scale,
            (HEAD_START_X - 330) * scale,
            (HEAD_START_X + 250) * scale,
            (HEAD_START_X - 300) * scale,
          )
          ctx.stroke()
        }

        const sad = (
          ctx: CanvasRenderingContext2D,
          scale: number,
          gradient: CanvasGradient,
        ) => {
          ctx.beginPath() // left eye (sad)
          ctx.ellipse(
            (HEAD_START_X - 80) * scale,
            (HEAD_START_X - 15) * scale,
            (mouseHover ? 1.08 : 1) * 5.7 * 1.8,
            (mouseHover ? 1.08 : 1) * 21 * 1.25,
            0,
            (Math.PI * -1) / 4,
            (Math.PI * 9) / 8,
          )
          // ctx.stroke()
          ctx.fillStyle = gradient
          ctx.fill()

          ctx.beginPath() // right eye (sad)
          ctx.ellipse(
            (HEAD_START_X + 80) * scale,
            (HEAD_START_X - 15) * scale,
            (mouseHover ? 1.08 : 1) * 5.7 * 1.8,
            (mouseHover ? 1.08 : 1) * 21 * 1.25,
            0,
            (Math.PI * -1) / 8,
            (Math.PI * 5) / 4,
          )
          // ctx.stroke()
          ctx.fillStyle = gradient
          ctx.fill()
        }

        const bored = (
          ctx: CanvasRenderingContext2D,
          scale: number,
          gradient: CanvasGradient,
        ) => {
          ctx.beginPath() // left eye (bored)
          ctx.ellipse(
            (HEAD_START_X - 80) * scale,
            (HEAD_START_X - 15) * scale,
            (mouseHover ? 1.08 : 1) * 5.7 * 1.8,
            (mouseHover ? 1.08 : 1) * 21 * 1.25,
            0,
            (Math.PI * -1) / 8,
            (Math.PI * 9) / 8,
          )
          ctx.fillStyle = gradient
          ctx.fill()

          ctx.beginPath() // right eye (bored)
          ctx.ellipse(
            (HEAD_START_X + 80) * scale,
            (HEAD_START_X - 15) * scale,
            (mouseHover ? 1.08 : 1) * 5.7 * 1.8,
            (mouseHover ? 1.08 : 1) * 21 * 1.25,
            0,
            (Math.PI * -1) / 8,
            (Math.PI * 9) / 8,
          )
          ctx.fillStyle = gradient
          ctx.fill()
        }

        // emotions?
        if (!active) {
          sleeping(ctx, scale, gradient)
        } else {
          if (sentiment === 'happy') {
            smiling(ctx, scale, gradient)
          } else if (sentiment === 'bored') {
            bored(ctx, scale, gradient)
          } else if (sentiment === 'sad') {
            sad(ctx, scale, gradient)
          } else if (sentiment === 'confused') {
            confused(ctx, scale, gradient)
          } else {
            normal(ctx, scale, gradient)
          }
        }
        if (startAnimation) {
          ctx.lineCap = 'butt'
          offsets.forEach((offset, i) => {
            const angle =
              i % 2 === 0
                ? -1 * chance + offset.position
                : chance + offset.position
            const radius = (HEAD_ORBIT_RADIUS + offset.radius) * scale
            orbit(ctx, gradient, scale, angle, radius, offset.width)
          })
        }
        if (visualData) {
          const pi = Math.PI / visualData.length
          visualData.forEach((amp, i) => {
            const angle = i * pi
            const radius = amp * scale
            if (radius + HEAD_RADIUS > 255 && radius + HEAD_RADIUS < 300) {
              ctx.beginPath()
              ctx.lineWidth = (scale * 10) / HEAD_ORBIT_LINE_WIDTH_SCALE
              ctx.arc(
                HEAD_START_X * scale,
                HEAD_START_Y * scale,
                radius + HEAD_RADIUS * scale,
                angle,
                angle + pi,
              )
              ctx.stroke()
              ctx.beginPath()
              ctx.lineWidth = (scale * 10) / HEAD_ORBIT_LINE_WIDTH_SCALE
              ctx.arc(
                HEAD_START_X * scale,
                HEAD_START_Y * scale,
                radius + HEAD_RADIUS * scale,
                -angle,
                -angle - pi,
              )
              ctx.stroke()
            }
          })
        }

        ctx.lineCap = 'butt'
      }
      const orbit = (
        ctx: CanvasRenderingContext2D,
        gradient: CanvasGradient,
        scale: number,
        angle: number,
        radius: number,
        lineWidth: number,
      ) => {
        ctx.lineCap = 'round'
        ctx.strokeStyle = gradient
        ctx.beginPath()
        ctx.lineWidth = (scale * lineWidth) / HEAD_ORBIT_LINE_WIDTH_SCALE
        ctx.arc(
          HEAD_START_X * scale,
          HEAD_START_Y * scale,
          radius,
          angle / 25,
          angle / 25 + HEAD_ANGLE_INCREMENT,
        )
        ctx.stroke()
      }
      drawHead(ctx as CanvasRenderingContext2D)
      setTimeout(() => {
        setChance((prevChance) => prevChance + 1)
        //requestAnimationFrame(animate) // recursive call to animate
      }, HEAD_ANIMATION_DELAY)
    }
  }, [
    sentiment,
    size,
    scaled,
    active,
    mouseHover,
    startAnimation,
    chance,
    offsets,
  ])
  useEffect(() => {
    const animationId = requestAnimationFrame(animate) // get the ID of this animation frame
    return () => cancelAnimationFrame(animationId) // use the cleanup function to cancel the animation when the component unmounts
  }, [animate])

  if (size < 0) {
    return null
  }

  return (
    <canvas
      style={{ background: 'transparent' }}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
      className={className}
      ref={canvasRef}
      width={size}
      height={size}
    />
  )
}

export default Canvas
