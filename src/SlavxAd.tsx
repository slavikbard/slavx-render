import {
	AbsoluteFill, interpolate, spring,
	useCurrentFrame, useVideoConfig,
	Sequence, Easing,
} from 'remotion';
import React from 'react';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const GOLD   = '#C5A059';
const GOLD2  = '#E2C07A';
const WHITE  = '#FFFFFF';
const PLAT   = '#E5E4E2';
const BLACK  = '#000000';
const DARK   = '#0A0A0A';
const CARD   = '#0F0F0F';

const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const BACK = Easing.bezier(0.34, 1.56, 0.64, 1);

function fi(f: number, a: number, b: number, lo = 0, hi = 1, ease = EXPO) {
	return interpolate(f, [a, b], [lo, hi], {
		extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease,
	});
}

// ─── Shared Components ───────────────────────────────────────────────────────

const GoldRule: React.FC<{w?: number; op?: number}> = ({w = 80, op = 1}) => (
	<div style={{width: w, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: op}} />
);

const GoldDot: React.FC = () => (
	<div style={{width: 5, height: 5, borderRadius: '50%', background: GOLD, flexShrink: 0}} />
);

// Thin diagonal lines — sharp geometric accent, NO blur
const GeometricLines: React.FC<{opacity: number}> = ({opacity}) => (
	<svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity}} viewBox="0 0 1080 1920" preserveAspectRatio="none">
		<line x1="0" y1="400" x2="400" y2="0"   stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.18" />
		<line x1="0" y1="900" x2="900" y2="0"   stroke={GOLD} strokeWidth="0.4" strokeOpacity="0.10" />
		<line x1="680" y1="1920" x2="1080" y2="1520" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.18" />
		<line x1="180" y1="1920" x2="1080" y2="1020" stroke={GOLD} strokeWidth="0.4" strokeOpacity="0.10" />
		<rect x="30" y="30" width="1020" height="1860" stroke={GOLD} strokeWidth="1" strokeOpacity="0.07" fill="none" />
		<rect x="50" y="50" width="980"  height="1820" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.04" fill="none" />
	</svg>
);

// Animated border that draws itself
const DrawBorder: React.FC<{progress: number; color?: string; w?: number; h?: number; stroke?: number}> = ({
	progress, color = GOLD, w = 560, h = 520, stroke = 1.5,
}) => {
	const perim = 2 * (w + h);
	const dash  = progress * perim;
	return (
		<svg width={w} height={h} style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}>
			<rect x={stroke / 2} y={stroke / 2} width={w - stroke} height={h - stroke}
				rx="16" fill="none" stroke={color} strokeWidth={stroke} strokeOpacity="0.55"
				strokeDasharray={`${dash} ${perim}`} strokeDashoffset="0" />
		</svg>
	);
};

// Sharp counter — no animation tricks, just clean
const Counter: React.FC<{value: number; suffix: string; size?: number}> = ({value, suffix, size = 80}) => (
	<div style={{display: 'flex', alignItems: 'baseline', gap: 6}}>
		<span style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: size, lineHeight: 1, color: GOLD, letterSpacing: '-0.02em'}}>
			{value}
		</span>
		<span style={{fontFamily: "'Heebo', sans-serif", fontWeight: 700, fontSize: size * 0.38, color: GOLD, direction: 'rtl'}}>
			{suffix}
		</span>
	</div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 1 (0–90f) — Opening: Clean logo reveal with geometric frame
// ─────────────────────────────────────────────────────────────────────────────
const Scene1: React.FC = () => {
	const frame = useCurrentFrame();

	const bgOp     = fi(frame,  0, 20, 0, 1);
	const borderP  = fi(frame,  5, 50, 0, 1, Easing.bezier(0.4, 0, 0.2, 1));

	// Gold streak — just a sharp rectangle, no blur
	const streakX  = fi(frame,  0, 40, -110, 125, Easing.bezier(0.4, 0, 0.2, 1));
	const streakOp = fi(frame, 38, 55, 1, 0);

	const logoOp   = fi(frame, 30, 52, 0, 1);
	const logoY    = fi(frame, 30, 52, 24, 0);
	const ruleOp   = fi(frame, 46, 62, 0, 1);
	const tagOp    = fi(frame, 52, 68, 0, 1);
	const tagY     = fi(frame, 52, 68, 16, 0);

	const sceneOut = fi(frame, 74, 90, 1, 0);

	return (
		<AbsoluteFill style={{background: BLACK, overflow: 'hidden', opacity: bgOp}}>
			<GeometricLines opacity={sceneOut * 0.8} />

			{/* Sharp light streak — no blur */}
			<div style={{
				position: 'absolute', inset: 0, overflow: 'hidden', opacity: streakOp,
			}}>
				<div style={{
					position: 'absolute', top: '-10%', left: `${streakX}%`,
					width: '4%', height: '120%',
					background: `linear-gradient(180deg, transparent 0%, ${GOLD2} 20%, ${WHITE} 50%, ${GOLD2} 80%, transparent 100%)`,
					opacity: 0.7,
				}} />
				<div style={{
					position: 'absolute', top: '-10%', left: `${streakX - 2}%`,
					width: '8%', height: '120%',
					background: `linear-gradient(180deg, transparent 0%, rgba(197,160,89,0.12) 30%, rgba(229,228,226,0.18) 50%, rgba(197,160,89,0.12) 70%, transparent 100%)`,
					opacity: 0.8,
				}} />
			</div>

			{/* Center content */}
			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, opacity: sceneOut}}>

				{/* SLAVX wordmark — sharp, no gradient text */}
				<div style={{opacity: logoOp, transform: `translateY(${logoY}px)`, position: 'relative'}}>
					<div style={{
						fontFamily: "'Montserrat', 'Arial Black', sans-serif",
						fontWeight: 900, fontSize: 120, letterSpacing: '0.24em',
						textTransform: 'uppercase', lineHeight: 1, color: WHITE,
						textShadow: `0 0 80px rgba(197,160,89,0.3), 0 0 160px rgba(197,160,89,0.15)`,
					}}>
						SLAVX
					</div>
					{/* Gold underline accent */}
					<div style={{
						position: 'absolute', bottom: -8, left: '10%', right: '10%',
						height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
						opacity: ruleOp,
					}} />
				</div>

				<div style={{opacity: ruleOp, marginTop: 4}}>
					<GoldRule w={100} />
				</div>

				<div style={{opacity: tagOp, transform: `translateY(${tagY}px)`, textAlign: 'center', direction: 'rtl'}}>
					<p style={{
						fontFamily: "'Heebo', sans-serif", fontSize: 24, fontWeight: 300,
						color: 'rgba(197,160,89,0.9)', margin: 0, letterSpacing: '0.08em',
					}}>
						סטודיו דיגיטלי לבניית אתרים פרימיום
					</p>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 2 (80–175f) — Hero Statement
// ─────────────────────────────────────────────────────────────────────────────
const Scene2: React.FC = () => {
	const frame = useCurrentFrame();

	const l1Op = fi(frame,  5, 22, 0, 1);
	const l1Y  = fi(frame,  5, 22, 28, 0);
	const l2Op = fi(frame, 20, 38, 0, 1);
	const l2Y  = fi(frame, 20, 38, 28, 0);
	const l3Op = fi(frame, 36, 52, 0, 1);
	const l3Y  = fi(frame, 36, 52, 28, 0);
	const rOp  = fi(frame, 30, 46, 0, 1);
	const sceneOut = fi(frame, 80, 95, 1, 0);

	return (
		<AbsoluteFill style={{background: DARK, overflow: 'hidden'}}>
			<GeometricLines opacity={0.6} />

			{/* Left accent bar */}
			<div style={{
				position: 'absolute', left: 60, top: '25%', bottom: '25%', width: 2,
				background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)`,
				opacity: rOp,
			}} />
			{/* Right accent bar */}
			<div style={{
				position: 'absolute', right: 60, top: '25%', bottom: '25%', width: 2,
				background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)`,
				opacity: rOp,
			}} />

			<div style={{
				position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
				alignItems: 'center', justifyContent: 'center', padding: '0 14%', gap: 22, opacity: sceneOut,
			}}>
				<div style={{opacity: l1Op, transform: `translateY(${l1Y}px)`, textAlign: 'center', direction: 'rtl'}}>
					<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 28, fontWeight: 300, color: 'rgba(229,228,226,0.45)', margin: 0, letterSpacing: '0.04em'}}>
						האתר שלך הוא
					</p>
				</div>

				<div style={{opacity: l2Op, transform: `translateY(${l2Y}px)`, textAlign: 'center', direction: 'rtl'}}>
					<p style={{
						fontFamily: "'Heebo', sans-serif", fontSize: 68, fontWeight: 900,
						color: GOLD, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.05,
						textShadow: `0 0 60px rgba(197,160,89,0.25)`,
					}}>
						הפנים של העסק
					</p>
				</div>

				<div style={{opacity: rOp}}><GoldRule w={80} /></div>

				<div style={{opacity: l3Op, transform: `translateY(${l3Y}px)`, textAlign: 'center', direction: 'rtl', maxWidth: 500}}>
					<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 24, fontWeight: 300, color: 'rgba(229,228,226,0.52)', margin: 0, lineHeight: 1.65}}>
						אנחנו בונים אותו<br/>כמו שמגיע לך
					</p>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 3 (165–280f) — Services: 2 clean cards
// ─────────────────────────────────────────────────────────────────────────────
const Card: React.FC<{
	icon: string; title: string; sub: string; features: string[];
	frame: number; delay: number; sceneOut: number;
}> = ({icon, title, sub, features, frame, delay, sceneOut}) => {
	const {fps} = useVideoConfig();
	const sc = spring({frame: frame - delay, fps, config: {stiffness: 120, damping: 20}});
	const op = fi(frame, delay, delay + 18, 0, 1);
	const borderP = fi(frame, delay + 4, delay + 38, 0, 1, Easing.bezier(0.4, 0, 0.2, 1));

	const W = 420, H = 430;

	return (
		<div style={{opacity: op * sceneOut, transform: `scale(${sc})`, position: 'relative', width: W, height: H}}>
			<DrawBorder progress={borderP} w={W} h={H} />
			<div style={{
				position: 'absolute', inset: 0,
				background: CARD,
				borderRadius: 16,
				padding: '36px 32px',
				display: 'flex', flexDirection: 'column', gap: 14,
			}}>
				{/* Icon box */}
				<div style={{
					width: 56, height: 56, borderRadius: 12,
					background: 'rgba(197,160,89,0.1)',
					border: `1px solid rgba(197,160,89,0.3)`,
					display: 'flex', alignItems: 'center', justifyContent: 'center',
					fontSize: 26,
				}}>
					{icon}
				</div>

				{/* Title */}
				<div style={{fontFamily: "'Heebo', sans-serif", fontSize: 28, fontWeight: 900, color: WHITE, direction: 'rtl', lineHeight: 1.1}}>
					{title}
				</div>
				<div style={{fontFamily: "'Heebo', sans-serif", fontSize: 14, fontWeight: 300, color: GOLD, direction: 'rtl', letterSpacing: '0.05em'}}>
					{sub}
				</div>

				<GoldRule w={50} />

				{/* Features */}
				<div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4}}>
					{features.map((f, i) => (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, direction: 'rtl'}}>
							<GoldDot />
							<span style={{fontFamily: "'Heebo', sans-serif", fontSize: 15, color: 'rgba(229,228,226,0.75)'}}>
								{f}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

const Scene3: React.FC = () => {
	const frame = useCurrentFrame();
	const sceneOut = fi(frame, 92, 115, 1, 0);
	const hdrOp = fi(frame, 0, 18, 0, 1);
	const hdrY  = fi(frame, 0, 18, -18, 0);

	return (
		<AbsoluteFill style={{background: BLACK, overflow: 'hidden'}}>
			<GeometricLines opacity={0.5} />

			{/* Section header */}
			<div style={{position: 'absolute', top: '7%', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: hdrOp, transform: `translateY(${hdrY}px)`}}>
				<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 13, color: 'rgba(197,160,89,0.7)', letterSpacing: '0.28em', margin: 0, textTransform: 'uppercase', direction: 'rtl'}}>
					מה אנחנו בונים
				</p>
				<GoldRule w={60} />
			</div>

			{/* Cards */}
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '0 5%'}}>
				<Card icon="🖥️" title="אתר עסקי" sub="נוכחות דיגיטלית מלאה"
					features={['עד 6 עמודים מותאמים', 'SEO מלא + אנליטיקס', 'עיצוב ייחודי למותג', 'נגישות AA']}
					frame={frame} delay={6} sceneOut={sceneOut} />
				<Card icon="⚡" title="דף נחיתה" sub="ממיר, מהיר, ממוקד"
					features={['עד 4 סקשנים חדים', 'אופטימיזציה למובייל', 'מוכן ב-72 שעות', 'נגישות AA']}
					frame={frame} delay={22} sceneOut={sceneOut} />
			</div>
		</AbsoluteFill>
	);
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 4 (268–368f) — 3 Pillars: sharp icon + text, no blur
// ─────────────────────────────────────────────────────────────────────────────
const Pillar: React.FC<{icon: string; num: string; label: string; sub: string; delay: number; frame: number; sceneOut: number}> = ({
	icon, num, label, sub, delay, frame, sceneOut,
}) => {
	const {fps} = useVideoConfig();
	const sc = spring({frame: frame - delay, fps, config: {stiffness: 140, damping: 20}});
	const op = fi(frame, delay, delay + 16, 0, 1);

	return (
		<div style={{opacity: op * sceneOut, transform: `scale(${sc})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 220}}>
			{/* Icon frame */}
			<div style={{
				width: 90, height: 90, borderRadius: 20,
				background: 'rgba(197,160,89,0.08)',
				border: `1.5px solid rgba(197,160,89,0.4)`,
				display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
			}}>
				<div style={{fontSize: 30}}>{icon}</div>
				<div style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 13, color: GOLD, letterSpacing: '0.05em'}}>{num}</div>
			</div>
			<div style={{textAlign: 'center', direction: 'rtl'}}>
				<div style={{fontFamily: "'Heebo', sans-serif", fontSize: 22, fontWeight: 700, color: WHITE, letterSpacing: '0.01em'}}>{label}</div>
				<div style={{fontFamily: "'Heebo', sans-serif", fontSize: 13, fontWeight: 300, color: 'rgba(197,160,89,0.7)', marginTop: 5, letterSpacing: '0.04em'}}>{sub}</div>
			</div>
		</div>
	);
};

const Scene4: React.FC = () => {
	const frame = useCurrentFrame();
	const sceneOut = fi(frame, 82, 100, 1, 0);
	const hdrOp = fi(frame, 0, 18, 0, 1);
	const dividerSc = fi(frame, 30, 58, 0, 1, Easing.bezier(0.4, 0, 0.2, 1));

	return (
		<AbsoluteFill style={{background: DARK, overflow: 'hidden'}}>
			<GeometricLines opacity={0.5} />

			<div style={{position: 'absolute', top: '8%', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: hdrOp}}>
				<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 13, color: 'rgba(197,160,89,0.7)', letterSpacing: '0.28em', margin: 0, textTransform: 'uppercase', direction: 'rtl'}}>
					למה SLAVX
				</p>
				<GoldRule w={60} />
			</div>

			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0}}>
				<Pillar icon="⚡" num="72H"  label="72 שעות"      sub="מהרעיון לאוויר"       delay={5}  frame={frame} sceneOut={sceneOut} />

				<div style={{width: 1, height: 120, background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)`, transform: `scaleY(${dividerSc})`, margin: '0 20px', opacity: 0.4}} />

				<Pillar icon="🎯" num="SEO" label="SEO מלא"      sub="תוצאות שנמצאות"      delay={20} frame={frame} sceneOut={sceneOut} />

				<div style={{width: 1, height: 120, background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)`, transform: `scaleY(${dividerSc})`, margin: '0 20px', opacity: 0.4}} />

				<Pillar icon="📱" num="AA"  label="מובייל ראשון" sub="חווית משתמש מושלמת"  delay={35} frame={frame} sceneOut={sceneOut} />
			</div>
		</AbsoluteFill>
	);
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 5 (358–438f) — Social proof: clean card, bold numbers
// ─────────────────────────────────────────────────────────────────────────────
const Scene5: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps}  = useVideoConfig();

	const cardSc  = spring({frame: frame - 4, fps, config: {stiffness: 80, damping: 18}});
	const cardOp  = fi(frame, 4, 22, 0, 1);
	const starsOp = fi(frame, 18, 34, 0, 1);
	const numOp   = fi(frame, 30, 46, 0, 1);
	const numSc   = spring({frame: frame - 30, fps, config: {stiffness: 150, damping: 18}});
	const quoteOp = fi(frame, 44, 58, 0, 1);
	const quoteY  = fi(frame, 44, 58, 20, 0);
	const sceneOut = fi(frame, 62, 80, 1, 0);

	const borderP = fi(frame, 6, 45, 0, 1, Easing.bezier(0.4, 0, 0.2, 1));
	const W = 700, H = 560;

	return (
		<AbsoluteFill style={{background: BLACK, overflow: 'hidden'}}>
			<GeometricLines opacity={0.5} />

			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sceneOut}}>
				<div style={{position: 'relative', width: W, height: H, opacity: cardOp, transform: `scale(${cardSc})`}}>
					<DrawBorder progress={borderP} w={W} h={H} stroke={1.5} />
					<div style={{
						position: 'absolute', inset: 0, background: CARD,
						borderRadius: 16, padding: '48px 56px',
						display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
					}}>
						{/* Stars */}
						<div style={{display: 'flex', gap: 6, opacity: starsOp}}>
							{Array.from({length: 5}).map((_, i) => (
								<svg key={i} width={28} height={28} viewBox="0 0 24 24" fill={GOLD}>
									<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
								</svg>
							))}
						</div>

						{/* Big rating number */}
						<div style={{opacity: numOp, transform: `scale(${numSc})`, textAlign: 'center'}}>
							<Counter value={5} suffix=".0" size={96} />
							<div style={{fontFamily: "'Heebo', sans-serif", fontSize: 15, color: 'rgba(229,228,226,0.4)', letterSpacing: '0.1em', direction: 'rtl', marginTop: 6}}>
								מתוך 50 ביקורות מאומתות
							</div>
						</div>

						<GoldRule w={80} />

						{/* Quote */}
						<div style={{opacity: quoteOp, transform: `translateY(${quoteY}px)`, textAlign: 'center', direction: 'rtl', maxWidth: 480}}>
							<div style={{
								fontFamily: "'Heebo', sans-serif", fontSize: 12, color: GOLD,
								letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12,
							}}>
								לקוחות אומרים
							</div>
							<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 19, fontWeight: 300, color: 'rgba(229,228,226,0.65)', margin: 0, lineHeight: 1.7, fontStyle: 'italic'}}>
								"האתר שקיבלנו עבר את כל הציפיות —<br />מהיר, יפה ומביא תוצאות אמיתיות"
							</p>
						</div>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 6 (428–510f) — Grand Reveal: crisp logo + pulsing CTA
// ─────────────────────────────────────────────────────────────────────────────
const Scene6: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps}  = useVideoConfig();

	const logoOp  = fi(frame,  6, 26, 0, 1);
	const logoSc  = spring({frame: frame - 6, fps, config: {stiffness: 80, damping: 18}});
	// Shimmer line sweep
	const shimmerX = fi(frame, 14, 48, -130, 230, Easing.bezier(0.4, 0, 0.2, 1));

	const ruleOp  = fi(frame, 26, 40, 0, 1);
	const tagOp   = fi(frame, 32, 48, 0, 1);
	const tagY    = fi(frame, 32, 48, 14, 0);
	const ctaOp   = fi(frame, 44, 58, 0, 1);
	const telOp   = fi(frame, 52, 65, 0, 1);

	// Soft pulse on CTA
	const ctaScale = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);
	const ctaBord  = 0.5 + 0.5 * Math.abs(Math.sin((frame / fps) * Math.PI * 2));

	// Top + bottom thin gold bars
	const barSc = fi(frame, 2, 22, 0, 1);

	return (
		<AbsoluteFill style={{background: BLACK, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
			<GeometricLines opacity={0.7} />

			{/* Top bar */}
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, transform: `scaleX(${barSc})`, transformOrigin: 'center'}} />
			{/* Bottom bar */}
			<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, transform: `scaleX(${barSc})`, transformOrigin: 'center'}} />

			{/* SLAVX — white, crisp, shimmer via overlay */}
			<div style={{opacity: logoOp, transform: `scale(${logoSc})`, position: 'relative', display: 'inline-block', overflow: 'hidden'}}>
				<div style={{
					fontFamily: "'Montserrat', 'Arial Black', sans-serif",
					fontWeight: 900, fontSize: 120, letterSpacing: '0.22em',
					textTransform: 'uppercase', lineHeight: 1, color: WHITE,
					textShadow: `0 0 60px rgba(197,160,89,0.2)`,
				}}>
					SLAVX
				</div>
				{/* Shimmer — a white slash moving across */}
				<div style={{
					position: 'absolute', top: 0, bottom: 0,
					left: `${shimmerX}px`, width: 60,
					background: 'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.45) 40%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.45) 60%, transparent 100%)',
					pointerEvents: 'none',
				}} />
			</div>

			{/* Gold rule */}
			<div style={{opacity: ruleOp, marginTop: 16}}>
				<GoldRule w={100} />
			</div>

			{/* Tagline */}
			<div style={{opacity: tagOp, transform: `translateY(${tagY}px)`, textAlign: 'center', direction: 'rtl', marginTop: 14}}>
				<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 23, fontWeight: 300, color: 'rgba(197,160,89,0.88)', margin: 0, letterSpacing: '0.08em'}}>
					סטודיו דיגיטלי לבניית אתרים פרימיום
				</p>
			</div>

			{/* CTA */}
			<div style={{marginTop: 34, opacity: ctaOp, transform: `scale(${ctaScale})`}}>
				<div style={{
					border: `2px solid rgba(197,160,89,${ctaBord})`,
					background: 'rgba(197,160,89,0.08)',
					color: GOLD,
					fontFamily: "'Heebo', sans-serif", fontWeight: 900, fontSize: 24,
					letterSpacing: '0.1em', direction: 'rtl',
					padding: '18px 56px', borderRadius: 6,
				}}>
					שלחו הודעה עכשיו ✦
				</div>
			</div>

			{/* Contact */}
			<div style={{marginTop: 24, opacity: telOp, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
				<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 19, fontWeight: 300, color: 'rgba(229,228,226,0.45)', margin: 0, letterSpacing: '0.14em', direction: 'ltr'}}>
					054-792-1821
				</p>
				<p style={{fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: 'rgba(197,160,89,0.4)', margin: 0, letterSpacing: '0.22em', textTransform: 'uppercase'}}>
					SLAVX.SITE
				</p>
			</div>
		</AbsoluteFill>
	);
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — 510 frames = 17 seconds @ 30fps
// ─────────────────────────────────────────────────────────────────────────────
export const SlavxAd: React.FC = () => (
	<AbsoluteFill style={{background: BLACK}}>
		<style>{`@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&family=Montserrat:wght@700;900&display=swap');`}</style>
		<Sequence from={0}   durationInFrames={92}><Scene1 /></Sequence>
		<Sequence from={78}  durationInFrames={100}><Scene2 /></Sequence>
		<Sequence from={163} durationInFrames={120}><Scene3 /></Sequence>
		<Sequence from={265} durationInFrames={106}><Scene4 /></Sequence>
		<Sequence from={356} durationInFrames={84}><Scene5 /></Sequence>
		<Sequence from={426} durationInFrames={84}><Scene6 /></Sequence>
	</AbsoluteFill>
);
