import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register plugins
gsap.registerPlugin(ScrollTrigger)

// Configure GSAP
gsap.config({
  nullTargetWarn: false
})

// Export configured GSAP instance
export { gsap }
