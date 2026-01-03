import { useEffect, useRef } from 'react';
import type { MousePosition } from '@/hooks/use-mouse-position';
import * as styles from './mouse-path-canvas.css';

interface TrailPoint {
	x: number;
	y: number;
	size: number;
	alpha: number;
	prevX?: number;
	prevY?: number;
}

interface MousePathCanvasProps {
	container: HTMLElement;
	mousePosition: MousePosition;
	disabled?: boolean;
}

export function MousePathCanvas({
	container,
	mousePosition,
	disabled = false,
}: MousePathCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const trailPointsRef = useRef<TrailPoint[]>([]);
	const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
	const animationFrameRef = useRef<number | null>(null);

	// Initialize canvas context
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d', {
			alpha: true,
			desynchronized: true,
			willReadFrequently: false,
		});

		if (!ctx) {
			console.error('Canvas 2D not supported');
			return;
		}

		ctxRef.current = ctx;

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	// Handle resize
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const resizeCanvas = () => {
			const rect = container.getBoundingClientRect();
			const dpr = window.devicePixelRatio || 1;

			canvas.style.width = `${rect.width}px`;
			canvas.style.height = `${rect.height}px`;
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;

			const ctx = ctxRef.current;
			if (ctx) {
				ctx.scale(dpr, dpr);
			}
		};

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	}, [container]);

	// Animation loop
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;

		if (!canvas || !ctx) return;

		// Handle disabled state separately to avoid full re-initialization
		if (disabled) {
			// Clear canvas and stop animation when disabled
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			trailPointsRef.current = [];
			lastMousePosRef.current = null;
			return;
		}

		const maxTrailLength = 25;
		const trailDecay = 0.96;

		let cachedRect = container.getBoundingClientRect();
		let rectCacheTime = performance.now();
		const RECT_CACHE_DURATION = 100;

		// Pre-calculate colors
		const baseR = 8;
		const baseG = 6;
		const baseB = 7;

		// Drawing with radial gradient
		const drawPoint = (point: TrailPoint) => {
			const radius = point.size / 2;
			const gradient = ctx.createRadialGradient(
				point.x,
				point.y,
				0,
				point.x,
				point.y,
				radius,
			);
			gradient.addColorStop(0, `rgba(${baseR},${baseG},${baseB},${point.alpha})`);
			gradient.addColorStop(
				0.5,
				`rgba(${baseR},${baseG},${baseB},${point.alpha * 0.6})`,
			);
			gradient.addColorStop(
				0.8,
				`rgba(${baseR},${baseG},${baseB},${point.alpha * 0.2})`,
			);
			gradient.addColorStop(1, `rgba(${baseR},${baseG},${baseB},0)`);
			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
			ctx.fill();
		};

		const render = () => {
			animationFrameRef.current = requestAnimationFrame(render);

			const now = performance.now();
			if (now - rectCacheTime > RECT_CACHE_DURATION) {
				cachedRect = container.getBoundingClientRect();
				rectCacheTime = now;
			}

			const mouseX = mousePosition.x - cachedRect.left;
			const mouseY = mousePosition.y - cachedRect.top;

			const hasMouseMoved =
				!lastMousePosRef.current ||
				Math.abs(mouseX - lastMousePosRef.current.x) > 0.1 ||
				Math.abs(mouseY - lastMousePosRef.current.y) > 0.1;

			if (hasMouseMoved) {
				if (lastMousePosRef.current) {
					const dx = mouseX - lastMousePosRef.current.x;
					const dy = mouseY - lastMousePosRef.current.y;
					const velocity = Math.sqrt(dx * dx + dy * dy);

					const baseSize = 100;
					const velocitySize = Math.min(velocity * 3, 150);
					const blobSize = baseSize + velocitySize;

					const steps = Math.min(Math.max(1, Math.floor(velocity / 15)), 5);

					for (let i = 0; i < steps; i++) {
						const t = (i + 1) / steps;
						const interpX = lastMousePosRef.current.x + dx * t;
						const interpY = lastMousePosRef.current.y + dy * t;

						trailPointsRef.current.unshift({
							x: interpX,
							y: interpY,
							size: blobSize,
							alpha: 1.0,
						});
					}
				} else {
					trailPointsRef.current.unshift({
						x: mouseX,
						y: mouseY,
						size: 100,
						alpha: 1.0,
					});
				}

				if (trailPointsRef.current.length > maxTrailLength) {
					trailPointsRef.current = trailPointsRef.current.slice(
						0,
						maxTrailLength,
					);
				}

				lastMousePosRef.current = { x: mouseX, y: mouseY };
			}

			// Decay trail points
			let validCount = 0;
			for (let i = 0; i < trailPointsRef.current.length; i++) {
				const point = trailPointsRef.current[i];
				const sizeMultiplier = 1.0 - (i / maxTrailLength) * 0.5;
				point.alpha *= trailDecay;
				point.size *= 0.98 * sizeMultiplier;

				if (point.alpha > 0.02) {
					if (validCount !== i) {
						trailPointsRef.current[validCount] = point;
					}
					validCount++;
				}
			}
			trailPointsRef.current.length = validCount;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (trailPointsRef.current.length === 0) return;

			for (let i = trailPointsRef.current.length - 1; i >= 0; i--) {
				drawPoint(trailPointsRef.current[i]);
			}
		};

		animationFrameRef.current = requestAnimationFrame(render);

		const handleMouseLeave = () => {
			trailPointsRef.current = [];
			lastMousePosRef.current = null;
		};

		container.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			container.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, [container, mousePosition, disabled]);

	return <canvas ref={canvasRef} className={styles.mousePathCanvasStyles} />;
}

