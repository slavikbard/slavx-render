import {
	AbsoluteFill, interpolate, spring,
	useCurrentFrame, useVideoConfig,
	Sequence, Easing,
} from 'remotion';
import React from 'react';

const GOLD  = '#C5A059';
const GOLD2 = '#E2C07A';
const WHITE = '#FFFFFF';
const PLAT  = '#E5E4E2';
const BLACK = '#000000';
const DARK  = '#0A0A0A';
const CARD  = '#0F0F0F';
const RED   = '#D94F4F';

const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const BACK = Easing.bezier(0.34, 1.56, 0.64, 1);

function fi(f: number, a: number, b: number, lo = 0, hi = 1, ease = EXPO) {
	return interpolate(f, [a, b], [lo, hi], {
		extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease,
	});
}

const GoldRule: React.FC<{w?: number; op?: number}> = ({w = 60, op = 1}) => (
	<div style={{width: w, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: op}} />
);

const GoldDot: React.FC = () => (
	<div style={{width: 5, height: 5, borderRadius: '50%', background: GOLD, flexShrink: 0}} />
);

// Sharp geometric SVG grid — no blur
const Grid: React.FC<{op?: number}> = ({op = 1}) => (
	<svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: op * 0.6}} viewBox="0 0 1080 1920" preserveAspectRatio="none">
		<line x1="0" y1="500" x2="500" y2="0"     stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.15"/>
		<line x1="580" y1="1920" x2="1080" y2="1420" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.15"/>
		<rect x="36" y="36" width="1008" height="1848" stroke={GOLD} strokeWidth="1" strokeOpacity="0.08" fill="none"/>
	</svg>
);

// Animated border draw
const DrawBorder: React.FC<{progress: number; w: number; h: number; stroke?: number}> = ({progress, w, h, stroke = 1.5}) => {
	const p = 2 * (w + h);
	return (
		<svg width={w} height={h} style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}>
			<rect x={stroke/2} y={stroke/2} width={w-stroke} height={h-stroke} rx="14" fill="none"
				stroke={GOLD} strokeWidth={stroke} strokeOpacity="0.6"
				strokeDasharray={`${progress * p} ${p}`}/>
		</svg>
	);
};

// ═══════════════════════════════════════════════════════════════════════════════
// REEL 1 — "3 שניות" : Countdown hook
// ═══════════════════════════════════════════════════════════════════════════════

const BigNumber: React.FC<{n: string; frame: number; active: boolean}> = ({n, frame, active}) => {
	const {fps} = useVideoConfig();
	if (!active) return null;
	const localF = frame;
	const sc  = spring({frame: localF, fps, config: {stiffness: 400, damping: 22, mass: 0.5}});
	const out = fi(localF, 22, 28, 1, 0);
	return (
		<div style={{
			position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
			transform: `scale(${sc})`, opacity: out,
		}}>
			<div style={{
				fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 260,
				lineHeight: 1, color: GOLD, letterSpacing: '-0.02em',
				textShadow: `0 0 80px rgba(197,160,89,0.3)`,
			}}>
				{n}
			</div>
		</div>
	);
};

export const Reel1: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scA_out = fi(frame, 86, 98, 1, 0);
	const topOp   = fi(frame, 0, 16, 0, 1);

	// Scene B: message
	const bOp  = fi(frame, 96, 112, 0, 1);
	const bOut = fi(frame, 198, 212, 1, 0);
	const l1Op = fi(frame, 100, 116, 0, 1); const l1Y = fi(frame, 100, 116, 28, 0);
	const l2Op = fi(frame, 116, 132, 0, 1); const l2Y = fi(frame, 116, 132, 28, 0);
	const l3Op = fi(frame, 132, 148, 0, 1); const l3Y = fi(frame, 132, 148, 28, 0);

	// Scene C: CTA
	const cOp  = fi(frame, 210, 224, 0, 1);
	const ctaP = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);
	const ctaBd= 0.5 + 0.5 * Math.abs(Math.sin((frame / fps) * Math.PI * 2));

	const shimX = fi(frame, 222, 256, -130, 230, Easing.bezier(0.4, 0, 0.2, 1));

	return (
		<AbsoluteFill style={{background: BLACK, overflow: 'hidden'}}>
			<Grid />

			{/* Top gold bars */}
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: fi(frame, 0, 12, 0, 1)}} />

			{/* Scene A — countdown */}
			<Sequence from={0} durationInFrames={100}>
				<AbsoluteFill style={{opacity: scA_out}}>
					<div style={{position: 'absolute', top: '9%', left: 0, right: 0, textAlign: 'center', direction: 'rtl', opacity: topOp}}>
						<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 26, fontWeight: 300, color: 'rgba(229,228,226,0.45)', margin: 0, letterSpacing: '0.06em'}}>
							הלקוח מחליט תוך
						</p>
					</div>

					<BigNumber n="3" frame={frame}       active={frame >= 4  && frame < 32} />
					<BigNumber n="2" frame={frame - 30}  active={frame >= 30 && frame < 58} />
					<BigNumber n="1" frame={frame - 56}  active={frame >= 56 && frame < 84} />

					<div style={{position: 'absolute', bottom: '9%', left: 0, right: 0, textAlign: 'center', direction: 'rtl', opacity: fi(frame, 68, 82, 0, 1) * fi(frame, 88, 98, 1, 0)}}>
						<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 24, fontWeight: 300, color: 'rgba(229,228,226,0.4)', margin: 0, letterSpacing: '0.06em'}}>
							אם לסמוך עליך — או לברוח
						</p>
					</div>
				</AbsoluteFill>
			</Sequence>

			{/* Scene B — message */}
			<Sequence from={94} durationInFrames={120}>
				<AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 12%', gap: 20, opacity: bOp * bOut}}>
					{/* Left/Right bars */}
					<div style={{position: 'absolute', left: 50, top: '22%', bottom: '22%', width: 2, background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)`, opacity: fi(frame, 6, 22, 0, 1)}} />
					<div style={{position: 'absolute', right: 50, top: '22%', bottom: '22%', width: 2, background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)`, opacity: fi(frame, 6, 22, 0, 1)}} />

					<div style={{opacity: l1Op, transform: `translateY(${l1Y}px)`, textAlign: 'center', direction: 'rtl'}}>
						<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 30, fontWeight: 300, color: 'rgba(229,228,226,0.45)', margin: 0}}>האתר שלך הוא</p>
					</div>
					<div style={{opacity: l2Op, transform: `translateY(${l2Y}px)`, textAlign: 'center', direction: 'rtl'}}>
						<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 66, fontWeight: 900, color: GOLD, margin: 0, lineHeight: 1.05, textShadow: `0 0 40px rgba(197,160,89,0.2)`}}>
							הרושם הראשון
						</p>
					</div>
					<GoldRule w={70} op={fi(frame, 16, 30, 0, 1)} />
					<div style={{opacity: l3Op, transform: `translateY(${l3Y}px)`, textAlign: 'center', direction: 'rtl', maxWidth: 440}}>
						<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 24, fontWeight: 300, color: 'rgba(229,228,226,0.5)', margin: 0, lineHeight: 1.6}}>
							תן לנו לוודא שהוא מושלם
						</p>
					</div>
				</AbsoluteFill>
			</Sequence>

			{/* Scene C — CTA */}
			<Sequence from={208} durationInFrames={62}>
				<AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: cOp}}>
					{/* Logo */}
					<div style={{position: 'relative', overflow: 'hidden'}}>
						<div style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 96, letterSpacing: '0.22em', color: WHITE, textShadow: `0 0 40px rgba(197,160,89,0.15)`}}>
							SLAVX
						</div>
						<div style={{position: 'absolute', top: 0, bottom: 0, left: `${shimX}px`, width: 55, background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.8), transparent)', pointerEvents: 'none'}} />
					</div>
					<GoldRule w={80} />
					<div style={{transform: `scale(${ctaP})`, border: `2px solid rgba(197,160,89,${ctaBd})`, background: 'rgba(197,160,89,0.08)', color: GOLD, fontFamily: "'Heebo', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: '0.1em', direction: 'rtl', padding: '16px 50px', borderRadius: 6}}>
						שלחו הודעה עכשיו ✦
					</div>
					<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 17, color: 'rgba(229,228,226,0.4)', direction: 'ltr', letterSpacing: '0.12em', margin: 0}}>054-792-1821</p>
					<p style={{fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(197,160,89,0.4)', letterSpacing: '0.22em', margin: 0}}>SLAVX.SITE</p>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};

// ═══════════════════════════════════════════════════════════════════════════════
// REEL 2 — "לפני ואחרי" : Clean split wipe
// ═══════════════════════════════════════════════════════════════════════════════

const BadSite: React.FC = () => (
	<div style={{width: '100%', height: '100%', background: '#E0E0E0', padding: 18, display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'sans-serif'}}>
		{/* Fake nav */}
		<div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: 8}}>
			<div style={{height: 16, width: 80, background: '#bbb', borderRadius: 2}} />
			<div style={{display: 'flex', gap: 8}}>
				{[50, 40, 55].map((w, i) => <div key={i} style={{height: 10, width: w, background: '#ccc', borderRadius: 2}} />)}
			</div>
		</div>
		{/* Hero placeholder */}
		<div style={{height: 110, background: '#C8C8C8', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<div style={{color: '#aaa', fontSize: 10, fontFamily: 'sans-serif'}}>IMAGE PLACEHOLDER</div>
		</div>
		{/* Text lines */}
		{[80, 65, 72, 58].map((w, i) => <div key={i} style={{height: 10, width: `${w}%`, background: '#C4C4C4', borderRadius: 2}} />)}
		{/* Ugly CTA */}
		<div style={{height: 30, width: '45%', background: '#4A90D9', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<div style={{color: 'white', fontSize: 9, fontWeight: 700}}>לחץ כאן לפרטים</div>
		</div>
		{/* Footer */}
		<div style={{marginTop: 6, height: 1, background: '#ccc'}} />
		<div style={{display: 'flex', gap: 8}}>
			{['ראשי','אודות','צור קשר','מדיניות'].map(t => <div key={t} style={{fontSize: 7, color: '#aaa'}}>{t}</div>)}
		</div>
	</div>
);

const GoodSite: React.FC = () => (
	<div style={{width: '100%', height: '100%', background: '#0D0D0D', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'sans-serif'}}>
		<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(197,160,89,0.2)', paddingBottom: 8}}>
			<div style={{color: GOLD, fontFamily: 'serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em'}}>SLAVX</div>
			<div style={{display: 'flex', gap: 12}}>
				{['Work', 'About', 'Contact'].map(t => <div key={t} style={{color: 'rgba(229,228,226,0.5)', fontSize: 8, letterSpacing: '0.1em'}}>{t}</div>)}
			</div>
		</div>
		<div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10}}>
			<div style={{color: WHITE, fontSize: 20, fontWeight: 700, lineHeight: 1.15}}>Elevate Your<br /><span style={{color: GOLD}}>Digital Presence</span></div>
			<div style={{color: 'rgba(229,228,226,0.38)', fontSize: 8, lineHeight: 1.7, maxWidth: 160}}>Premium web experiences for discerning brands worldwide.</div>
			<div style={{display: 'inline-flex', alignSelf: 'flex-start', background: GOLD, color: BLACK, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', padding: '7px 16px', borderRadius: 3}}>GET STARTED</div>
		</div>
		<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6}}>
			{['⚡ 72h', '🎯 SEO', '📱 AA'].map((t, i) => (
				<div key={i} style={{background: 'rgba(197,160,89,0.07)', border: '1px solid rgba(197,160,89,0.2)', borderRadius: 5, padding: '6px 4px', textAlign: 'center', color: GOLD, fontSize: 9, fontWeight: 700}}>{t}</div>
			))}
		</div>
	</div>
);

export const Reel2: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Intro: 0-64
	const iOp  = fi(frame, 0, 16, 0, 1);
	const iOut = fi(frame, 54, 66, 1, 0);

	// Split: 62-232
	const sOp  = fi(frame, 62, 76, 0, 1);
	const sOut = fi(frame, 218, 232, 1, 0);
	const wipe = fi(frame, 68, 110, 0, 100, Easing.bezier(0, 0.55, 0.45, 1));
	const badLOp  = fi(frame, 68, 82, 0, 1);
	const goodLOp = fi(frame, 110, 124, 0, 1);
	const featsOp = fi(frame, 120, 138, 0, 1);

	// CTA: 230-300
	const cOp = fi(frame, 230, 244, 0, 1);
	const ctaP = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);
	const ctaBd= 0.5 + 0.5 * Math.abs(Math.sin((frame / fps) * Math.PI * 2));

	const SZ = {W: 680, H: 460};

	return (
		<AbsoluteFill style={{background: BLACK, overflow: 'hidden'}}>
			<Grid />
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: fi(frame, 0, 12, 0, 1)}} />

			{/* Intro */}
			<Sequence from={0} durationInFrames={68}>
				<AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 12%', gap: 22, opacity: iOp * iOut}}>
					<div style={{textAlign: 'center', direction: 'rtl'}}>
						<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 26, fontWeight: 300, color: 'rgba(229,228,226,0.4)', margin: '0 0 10px', lineHeight: 1.5}}>
							רוב האתרים בישראל
						</p>
						<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 64, fontWeight: 900, color: RED, margin: '0 0 10px', lineHeight: 1.05, textShadow: `0 0 40px rgba(217,79,79,0.25)`}}>
							מפסידים לקוחות
						</p>
						<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 24, fontWeight: 300, color: 'rgba(229,228,226,0.35)', margin: 0}}>
							בלי לדעת
						</p>
					</div>
					<GoldRule w={70} />
					<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 20, fontWeight: 300, color: 'rgba(229,228,226,0.4)', margin: 0, textAlign: 'center', direction: 'rtl'}}>
						הנה ההבדל בין אתר רגיל<br />לאתר שמביא תוצאות
					</p>
				</AbsoluteFill>
			</Sequence>

			{/* Split screen */}
			<Sequence from={60} durationInFrames={175}>
				<AbsoluteFill style={{opacity: sOp * sOut}}>
					{/* Bad side */}
					<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<div style={{position: 'relative', width: SZ.W, height: SZ.H, borderRadius: 14, overflow: 'hidden', border: `2px solid rgba(217,79,79,0.35)`}}>
							<BadSite />
						</div>
					</div>

					{/* Good side wipe */}
					<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: `inset(0 ${100 - wipe}% 0 0)`}}>
						<div style={{position: 'relative', width: SZ.W, height: SZ.H, borderRadius: 14, overflow: 'hidden', border: `2px solid rgba(197,160,89,0.45)`}}>
							<GoodSite />
						</div>
					</div>

					{/* Wipe divider line */}
					{wipe > 1 && wipe < 99 && (
						<div style={{position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)', left: `calc(50% + ${(wipe - 50) / 100 * SZ.W}px)`, width: 2, height: SZ.H, background: GOLD}} />
					)}

					{/* Labels */}
					<div style={{position: 'absolute', top: `calc(50% - ${SZ.H / 2}px - 42px)`, left: `calc(50% - ${SZ.W / 2}px)`, opacity: badLOp}}>
						<div style={{background: 'rgba(217,79,79,0.12)', border: '1px solid rgba(217,79,79,0.4)', borderRadius: 6, padding: '6px 16px'}}>
							<span style={{fontFamily: "'Heebo', sans-serif", fontSize: 15, fontWeight: 700, color: '#e07070', direction: 'rtl'}}>❌ אתר רגיל</span>
						</div>
					</div>
					<div style={{position: 'absolute', top: `calc(50% - ${SZ.H / 2}px - 42px)`, right: `calc(50% - ${SZ.W / 2}px)`, opacity: goodLOp}}>
						<div style={{background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.4)', borderRadius: 6, padding: '6px 16px'}}>
							<span style={{fontFamily: "'Heebo', sans-serif", fontSize: 15, fontWeight: 700, color: GOLD, direction: 'rtl'}}>✦ SLAVX</span>
						</div>
					</div>

					{/* Feature lists below */}
					<div style={{
						position: 'absolute',
						top: `calc(50% + ${SZ.H / 2}px + 20px)`,
						left: '50%', transform: 'translateX(-50%)',
						width: SZ.W, opacity: featsOp,
						display: 'flex', justifyContent: 'space-between',
					}}>
						<div style={{display: 'flex', flexDirection: 'column', gap: 5, direction: 'rtl'}}>
							{['עיצוב ישן', 'ללא SEO', 'לא מובייל'].map((t, i) => (
								<div key={i} style={{display: 'flex', alignItems: 'center', gap: 6}}>
									<div style={{width: 14, height: 14, borderRadius: '50%', background: 'rgba(217,79,79,0.2)', border: '1px solid rgba(217,79,79,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
										<span style={{color: RED, fontSize: 8, fontWeight: 700}}>✕</span>
									</div>
									<span style={{fontFamily: "'Heebo', sans-serif", fontSize: 13, color: 'rgba(217,79,79,0.75)'}}>{t}</span>
								</div>
							))}
						</div>
						<div style={{display: 'flex', flexDirection: 'column', gap: 5, direction: 'rtl', alignItems: 'flex-end'}}>
							{['עיצוב פרימיום', 'SEO מלא', 'מובייל ראשון'].map((t, i) => (
								<div key={i} style={{display: 'flex', alignItems: 'center', gap: 6}}>
									<span style={{fontFamily: "'Heebo', sans-serif", fontSize: 13, color: 'rgba(197,160,89,0.8)'}}>{t}</span>
									<div style={{width: 14, height: 14, borderRadius: '50%', background: 'rgba(197,160,89,0.15)', border: '1px solid rgba(197,160,89,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
										<span style={{color: GOLD, fontSize: 8, fontWeight: 700}}>✓</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</AbsoluteFill>
			</Sequence>

			{/* CTA */}
			<Sequence from={228} durationInFrames={72}>
				<AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: cOp}}>
					<div style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 92, letterSpacing: '0.22em', color: WHITE, textShadow: `0 0 40px rgba(197,160,89,0.15)`}}>SLAVX</div>
					<GoldRule w={80} />
					<div style={{textAlign: 'center', direction: 'rtl'}}>
						<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 22, color: 'rgba(229,228,226,0.5)', margin: 0}}>תרצה את האתר שמביא תוצאות?</p>
					</div>
					<div style={{transform: `scale(${ctaP})`, border: `2px solid rgba(197,160,89,${ctaBd})`, background: 'rgba(197,160,89,0.08)', color: GOLD, fontFamily: "'Heebo', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: '0.1em', direction: 'rtl', padding: '16px 50px', borderRadius: 6}}>
						שלחו הודעה עכשיו ✦
					</div>
					<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 16, color: 'rgba(229,228,226,0.4)', direction: 'ltr', letterSpacing: '0.12em', margin: 0}}>054-792-1821</p>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};

// ═══════════════════════════════════════════════════════════════════════════════
// REEL 3 — "72 שעות" : Steps + live countdown
// ═══════════════════════════════════════════════════════════════════════════════

const Step: React.FC<{n: string; title: string; sub: string; frame: number; delay: number}> = ({n, title, sub, frame, delay}) => {
	const {fps} = useVideoConfig();
	const sc = spring({frame: frame - delay, fps, config: {stiffness: 160, damping: 22}});
	const op = fi(frame, delay, delay + 14, 0, 1);

	return (
		<div style={{opacity: op, transform: `scale(${sc})`, display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl', width: '100%'}}>
			{/* Number badge */}
			<div style={{
				width: 54, height: 54, borderRadius: 12, flexShrink: 0,
				background: 'rgba(197,160,89,0.09)', border: `1.5px solid rgba(197,160,89,0.45)`,
				display: 'flex', alignItems: 'center', justifyContent: 'center',
			}}>
				<span style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 20, color: GOLD}}>{n}</span>
			</div>
			{/* Text */}
			<div style={{display: 'flex', flexDirection: 'column', gap: 3}}>
				<div style={{fontFamily: "'Heebo', sans-serif", fontSize: 22, fontWeight: 700, color: WHITE}}>{title}</div>
				<div style={{fontFamily: "'Heebo', sans-serif", fontSize: 14, fontWeight: 300, color: 'rgba(197,160,89,0.65)'}}>{sub}</div>
			</div>
		</div>
	);
};

export const Reel3: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Scene A: 0-66 — "72 שעות" hero
	const aOp  = fi(frame, 0, 16, 0, 1);
	const aOut = fi(frame, 54, 68, 1, 0);
	const numSc = spring({frame: frame - 4, fps, config: {stiffness: 55, damping: 16}});
	const numOp = fi(frame, 4, 24, 0, 1);
	const subOp = fi(frame, 24, 38, 0, 1); const subY = fi(frame, 24, 38, 16, 0);

	// Scene B: 64-196 — 3 steps
	const bOp  = fi(frame, 64, 78, 0, 1);
	const bOut = fi(frame, 183, 198, 1, 0);
	const hOp  = fi(frame, 64, 80, 0, 1); const hY = fi(frame, 64, 80, -16, 0);
	const divSc = fi(frame, 90, 115, 0, 1, Easing.bezier(0.4, 0, 0.2, 1));

	// Scene C: 195-270 — countdown + CTA
	const cOp    = fi(frame, 195, 210, 0, 1);
	const timerV = Math.max(0, Math.round(72 - fi(frame, 210, 262, 0, 72, Easing.linear)));
	const ctaOp  = fi(frame, 236, 252, 0, 1);
	const ctaP   = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);
	const ctaBd  = 0.5 + 0.5 * Math.abs(Math.sin((frame / fps) * Math.PI * 2));

	return (
		<AbsoluteFill style={{background: DARK, overflow: 'hidden'}}>
			<Grid />
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: fi(frame, 0, 12, 0, 1)}} />

			{/* Scene A */}
			<Sequence from={0} durationInFrames={70}>
				<AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: aOp * aOut}}>
					<div style={{fontFamily: "'Heebo', sans-serif", fontSize: 26, fontWeight: 300, color: 'rgba(229,228,226,0.45)', direction: 'rtl', letterSpacing: '0.06em'}}>
						האתר שלך יהיה מוכן תוך
					</div>
					{/* Big 72 */}
					<div style={{opacity: numOp, transform: `scale(${numSc})`, display: 'flex', alignItems: 'baseline', gap: 14}}>
						<div style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 168, lineHeight: 1, color: GOLD, textShadow: `0 0 60px rgba(197,160,89,0.25)`}}>
							72
						</div>
						<div style={{fontFamily: "'Heebo', sans-serif", fontWeight: 700, fontSize: 44, color: GOLD, direction: 'rtl', paddingBottom: 14}}>
							שעות
						</div>
					</div>
					<div style={{opacity: subOp, transform: `translateY(${subY}px)`, textAlign: 'center', direction: 'rtl', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
						<GoldRule w={70} />
						<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 21, fontWeight: 300, color: 'rgba(229,228,226,0.45)', margin: 0, letterSpacing: '0.04em'}}>
							מהרעיון — לאתר חי ופועל
						</p>
					</div>
				</AbsoluteFill>
			</Sequence>

			{/* Scene B — Steps */}
			<Sequence from={62} durationInFrames={138}>
				<AbsoluteFill style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 11%', gap: 0, opacity: bOp * bOut}}>
					<div style={{opacity: hOp, transform: `translateY(${hY}px)`, marginBottom: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
						<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 13, color: 'rgba(197,160,89,0.65)', letterSpacing: '0.26em', margin: 0, textTransform: 'uppercase', direction: 'rtl'}}>
							הדרך מהרעיון לאתר
						</p>
						<GoldRule w={55} />
					</div>

					<Step n="01" title="שיחת ייעוץ חינמית"  sub="מבינים את העסק, הצרכים והמטרות" frame={frame - 62} delay={6} />

					<div style={{display: 'flex', alignItems: 'center', direction: 'rtl', gap: 0, margin: '14px 0', paddingRight: 27, opacity: fi(frame - 62, 22, 36, 0, 1)}}>
						<div style={{width: 1, height: 30, background: `linear-gradient(180deg, rgba(197,160,89,0.5), rgba(197,160,89,0.2))`, transform: `scaleY(${divSc})`}} />
					</div>

					<Step n="02" title="עיצוב ופיתוח"        sub="בונים, מעצבים ומשכללים עבורך" frame={frame - 62} delay={28} />

					<div style={{display: 'flex', alignItems: 'center', direction: 'rtl', margin: '14px 0', paddingRight: 27, opacity: fi(frame - 62, 44, 58, 0, 1)}}>
						<div style={{width: 1, height: 30, background: `linear-gradient(180deg, rgba(197,160,89,0.5), rgba(197,160,89,0.2))`, transform: `scaleY(${divSc})`}} />
					</div>

					<Step n="03" title="העלאה לאוויר"        sub="האתר עולה — תוך 72 שעות בלבד" frame={frame - 62} delay={50} />
				</AbsoluteFill>
			</Sequence>

			{/* Scene C — Live countdown + CTA */}
			<Sequence from={193} durationInFrames={77}>
				<AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, opacity: cOp}}>
					<div style={{textAlign: 'center'}}>
						<div style={{fontFamily: "'Heebo', sans-serif", fontSize: 17, fontWeight: 300, color: 'rgba(229,228,226,0.4)', direction: 'rtl', marginBottom: 6}}>ספירה לאחור</div>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 12, justifyContent: 'center'}}>
							<div style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 130, lineHeight: 1, color: GOLD, minWidth: 200, textAlign: 'center', textShadow: `0 0 40px rgba(197,160,89,0.2)`}}>
								{String(timerV).padStart(2, '0')}
							</div>
							<div style={{fontFamily: "'Heebo', sans-serif", fontWeight: 700, fontSize: 34, color: GOLD, paddingBottom: 12}}>שע'</div>
						</div>
					</div>

					<GoldRule w={70} />

					<div style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 80, letterSpacing: '0.22em', color: WHITE, textShadow: `0 0 30px rgba(197,160,89,0.1)`}}>
						SLAVX
					</div>

					<div style={{opacity: ctaOp, transform: `scale(${ctaP})`}}>
						<div style={{border: `2px solid rgba(197,160,89,${ctaBd})`, background: 'rgba(197,160,89,0.08)', color: GOLD, fontFamily: "'Heebo', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: '0.1em', direction: 'rtl', padding: '16px 50px', borderRadius: 6}}>
							שלחו הודעה עכשיו ✦
						</div>
					</div>
					<p style={{fontFamily: "'Heebo', sans-serif", fontSize: 16, color: 'rgba(229,228,226,0.4)', direction: 'ltr', letterSpacing: '0.12em', margin: 0, opacity: ctaOp}}>054-792-1821</p>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
