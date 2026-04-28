import {
	AbsoluteFill, interpolate, spring,
	useCurrentFrame, useVideoConfig,
	Sequence, Easing, Img, staticFile,
} from 'remotion';
import React from 'react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const GOLD  = '#C5A059';
const GOLD2 = '#E2C07A';
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const DARK  = '#0A0A0A';
const CARD  = '#0F0F0F';

const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const SILK = Easing.bezier(0.4, 0, 0.2, 1);

function fi(f: number, a: number, b: number, lo = 0, hi = 1, ease = EXPO) {
	return interpolate(f, [a, b], [lo, hi], {
		extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease,
	});
}

// ─── Shared decorative components ────────────────────────────────────────────

const GoldLine: React.FC<{w?: number; op?: number}> = ({w = 80, op = 1}) => (
	<div style={{
		width: w, height: 2, opacity: op,
		background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
	}} />
);

const GeomLines: React.FC<{op?: number}> = ({op = 1}) => (
	<svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: op * 0.55}} viewBox="0 0 1080 1920" preserveAspectRatio="none">
		<line x1="0" y1="450" x2="450" y2="0" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.15" />
		<line x1="630" y1="1920" x2="1080" y2="1470" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.15" />
		<rect x="34" y="34" width="1012" height="1852" stroke={GOLD} strokeWidth="1" strokeOpacity="0.07" fill="none" />
	</svg>
);

const TopBar: React.FC<{f: number}> = ({f}) => (
	<div style={{
		position: 'absolute', top: 0, left: 0, right: 0, height: 3,
		background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
		opacity: fi(f, 0, 14, 0, 1),
	}} />
);

// ─── BROWSER MOCKUP (for LB Geves landscape screenshot) ──────────────────────

const BrowserMockup: React.FC<{
	scrollY: number; // px — how far down the page we've scrolled
	opacity: number;
	scale?: number;
	translateY?: number;
}> = ({scrollY, opacity, scale = 1, translateY = 0}) => {
	const SCREEN_W = 860;
	const SCREEN_H = 480;
	const IMG_H = 920; // approx page height when image fills 100% width

	return (
		<div style={{
			opacity,
			transform: `scale(${scale}) translateY(${translateY}px)`,
			width: SCREEN_W,
			flexShrink: 0,
			filter: `drop-shadow(0 30px 80px rgba(0,0,0,0.85))`,
		}}>
			{/* Screen + browser chrome */}
			<div style={{
				width: SCREEN_W, height: SCREEN_H,
				background: '#1a1a1a',
				borderRadius: '14px 14px 0 0',
				border: '6px solid #252525',
				overflow: 'hidden',
			}}>
				{/* Chrome bar */}
				<div style={{
					height: 36, background: '#2d2d2d',
					display: 'flex', alignItems: 'center',
					padding: '0 14px', gap: 8, flexShrink: 0,
				}}>
					{['#FF5F57', '#FFBD2E', '#28C840'].map((c, i) => (
						<div key={i} style={{width: 11, height: 11, borderRadius: '50%', background: c}} />
					))}
					<div style={{
						flex: 1, height: 20, borderRadius: 10,
						background: '#3a3a3a', marginLeft: 8,
						display: 'flex', alignItems: 'center', justifyContent: 'center',
					}}>
						<span style={{
							fontSize: 10, color: 'rgba(255,255,255,0.35)',
							fontFamily: 'monospace', letterSpacing: '0.04em',
						}}>
							lbgeves.co.il
						</span>
					</div>
				</div>
				{/* Screenshot area */}
				<div style={{overflow: 'hidden', height: SCREEN_H - 36}}>
					<Img
						src={staticFile('lbgeves.jpg')}
						style={{
							width: '100%',
							height: IMG_H,
							objectFit: 'cover',
							objectPosition: 'top center',
							transform: `translateY(${-scrollY}px)`,
							display: 'block',
						}}
					/>
				</div>
			</div>
			{/* Base */}
			<div style={{
				width: SCREEN_W, height: 20,
				background: 'linear-gradient(180deg, #252525, #1a1a1a)',
				borderRadius: '0 0 4px 4px',
			}} />
			<div style={{
				width: SCREEN_W + 100, height: 10, margin: '0 auto',
				background: 'linear-gradient(180deg, #1a1a1a, #111)',
				borderRadius: 6,
			}} />
		</div>
	);
};

// ─── PHONE MOCKUP ─────────────────────────────────────────────────────────────

const PhoneMockup: React.FC<{
	children: React.ReactNode;
	opacity: number;
	scale?: number;
	translateX?: number;
}> = ({children, opacity, scale = 1, translateX = 0}) => (
	<div style={{
		opacity,
		transform: `scale(${scale}) translateX(${translateX}px)`,
		width: 300, height: 620,
		borderRadius: 48,
		overflow: 'hidden',
		border: '8px solid #1C1C1E',
		boxShadow: `
			0 0 0 1px rgba(255,255,255,0.07),
			0 40px 90px rgba(0,0,0,0.9),
			inset 0 1px 0 rgba(255,255,255,0.06)
		`,
		background: '#000',
		position: 'relative',
		flexShrink: 0,
	}}>
		{/* Dynamic Island */}
		<div style={{
			position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
			width: 105, height: 28, background: '#000', borderRadius: 14,
			zIndex: 20,
		}} />
		{children}
	</div>
);

// ─── ELADFIT phone content ─────────────────────────────────────────────────────

const EladFitSite: React.FC<{scrollY: number}> = ({scrollY}) => (
	<div style={{
		width: '100%', height: 1200,
		background: '#0A0A0A',
		transform: `translateY(${-scrollY}px)`,
	}}>
		{/* Hero image */}
		<div style={{width: '100%', height: 340, position: 'relative', overflow: 'hidden'}}>
			<Img
				src={staticFile('elad-hero.png')}
				style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top'}}
			/>
			{/* Gradient overlay */}
			<div style={{
				position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 50%, #0A0A0A 100%)',
			}} />
			{/* Logo */}
			<div style={{position: 'absolute', bottom: 18, left: 0, right: 0, textAlign: 'center'}}>
				<span style={{
					fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 32,
					color: WHITE, letterSpacing: '0.06em',
				}}>
					ELAD<span style={{color: '#E8420A'}}>FIT</span>
				</span>
				<div style={{
					fontFamily: "'Heebo', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)',
					letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 2,
				}}>
					BY SLAVX
				</div>
			</div>
		</div>

		{/* Content */}
		<div style={{padding: '20px 18px', direction: 'rtl', display: 'flex', flexDirection: 'column', gap: 16}}>
			<div style={{textAlign: 'center'}}>
				<div style={{
					fontFamily: "'Heebo', sans-serif", fontSize: 22, fontWeight: 900,
					color: WHITE, lineHeight: 1.3,
				}}>
					מאמן כושר אישי<br />
					<span style={{color: '#E8420A'}}>ומדריך תזונה</span>
				</div>
				<div style={{
					fontFamily: "'Heebo', sans-serif", fontSize: 12,
					color: 'rgba(255,255,255,0.4)', marginTop: 6,
				}}>
					אלעד דוייטש — יוצרים יחד את הגרסה הטובה ביותר שלך
				</div>
			</div>

			{/* CTA */}
			<div style={{
				background: '#E8420A', borderRadius: 10, padding: '14px',
				textAlign: 'center', color: WHITE,
				fontFamily: "'Heebo', sans-serif", fontWeight: 900, fontSize: 17,
				letterSpacing: '0.02em',
			}}>
				קבע שיחת היכרות חינם
			</div>

			{/* Services */}
			{['אימון אישי', 'תוכנית תזונה מותאמת', 'מעקב ותמיכה שוטפת'].map(s => (
				<div key={s} style={{
					background: 'rgba(232,66,10,0.07)',
					border: '1px solid rgba(232,66,10,0.18)',
					borderRadius: 10, padding: '13px 16px',
					display: 'flex', alignItems: 'center', gap: 12,
				}}>
					<div style={{width: 5, height: 5, borderRadius: '50%', background: '#E8420A', flexShrink: 0}} />
					<span style={{fontFamily: "'Heebo', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.75)'}}>{s}</span>
				</div>
			))}
		</div>
	</div>
);

// ─── ELAD TRAIL phone content ──────────────────────────────────────────────────

const EladTrailSite: React.FC<{scrollY: number}> = ({scrollY}) => (
	<div style={{
		width: '100%', height: 1100,
		background: '#0D1A0F',
		transform: `translateY(${-scrollY}px)`,
	}}>
		{/* Hero */}
		<div style={{width: '100%', height: 310, position: 'relative', overflow: 'hidden'}}>
			<Img
				src={staticFile('elad-trail-hero.png')}
				style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top'}}
			/>
			<div style={{
				position: 'absolute', inset: 0,
				background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, #0D1A0F 100%)',
			}} />
			<div style={{
				position: 'absolute', bottom: 14, left: 0, right: 0,
				textAlign: 'center', direction: 'rtl',
			}}>
				<div style={{
					fontFamily: "'Heebo', sans-serif", fontSize: 12, fontWeight: 300,
					color: 'rgba(255,255,255,0.5)', letterSpacing: '0.25em', textTransform: 'uppercase',
				}}>
					המסלול של
				</div>
				<div style={{
					fontFamily: "'Heebo', sans-serif", fontSize: 34, fontWeight: 900,
					color: WHITE, lineHeight: 1, marginTop: 2,
				}}>
					אלעד
				</div>
			</div>
		</div>

		{/* Content */}
		<div style={{padding: '18px 16px', direction: 'rtl', display: 'flex', flexDirection: 'column', gap: 14}}>
			<div style={{textAlign: 'center'}}>
				<div style={{
					fontFamily: "'Heebo', sans-serif", fontSize: 19, fontWeight: 700, color: WHITE, lineHeight: 1.35,
				}}>
					יוצר תוכן | מסע | הרפתקאות<br />
					<span style={{color: '#4CAF5C'}}>בארץ ובעולם</span>
				</div>
				<div style={{
					fontFamily: "'Heebo', sans-serif", fontSize: 12,
					color: 'rgba(255,255,255,0.38)', marginTop: 6,
				}}>
					מסלולים ייחודיים, סרטוני טבע וקהילה פעילה
				</div>
			</div>

			{/* CTA */}
			<div style={{
				background: 'linear-gradient(135deg, #2D7A3A, #4CAF5C)',
				borderRadius: 10, padding: '13px',
				textAlign: 'center', color: WHITE,
				fontFamily: "'Heebo', sans-serif", fontWeight: 900, fontSize: 16,
			}}>
				הצטרף למסלול הבא
			</div>

			{/* Content items */}
			{['מסלולי טבע ייחודיים', 'סרטוני יוטיוב', 'קהילה פעילה'].map(s => (
				<div key={s} style={{
					background: 'rgba(76,175,92,0.08)',
					border: '1px solid rgba(76,175,92,0.2)',
					borderRadius: 10, padding: '12px 15px',
					display: 'flex', alignItems: 'center', gap: 12,
				}}>
					<div style={{width: 5, height: 5, borderRadius: '50%', background: '#4CAF5C', flexShrink: 0}} />
					<span style={{fontFamily: "'Heebo', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.7)'}}>{s}</span>
				</div>
			))}
		</div>
	</div>
);

// ─── PROJECT LABEL ─────────────────────────────────────────────────────────────

const ProjectLabel: React.FC<{
	name: string;
	category: string;
	accent: string;
	opacity: number;
	translateY?: number;
}> = ({name, category, accent, opacity, translateY = 0}) => (
	<div style={{
		opacity,
		transform: `translateY(${translateY}px)`,
		display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
		direction: 'rtl', textAlign: 'center',
	}}>
		<div style={{
			background: `rgba(${accent},0.12)`,
			border: `1px solid rgba(${accent},0.35)`,
			borderRadius: 6, padding: '4px 14px',
		}}>
			<span style={{
				fontFamily: "'Heebo', sans-serif", fontSize: 12, fontWeight: 700,
				color: `rgb(${accent})`, letterSpacing: '0.15em', textTransform: 'uppercase',
			}}>
				{category}
			</span>
		</div>
		<div style={{
			fontFamily: "'Heebo', sans-serif", fontSize: 32, fontWeight: 900,
			color: WHITE, letterSpacing: '-0.01em',
		}}>
			{name}
		</div>
	</div>
);

// ─────────────────────────────────────────────────────────────────────────────
// REEL 4 — "הפרויקטים שלנו" — Portfolio showcase
// 750f = 25s @ 30fps
// ─────────────────────────────────────────────────────────────────────────────

export const Reel4: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// ── Scene A: Intro (0–80f) ──
	const aOut = fi(frame, 66, 80, 1, 0);
	const hOp  = fi(frame, 6, 26, 0, 1);
	const hY   = fi(frame, 6, 26, 28, 0);
	const sOp  = fi(frame, 22, 40, 0, 1);
	const sY   = fi(frame, 22, 40, 18, 0);
	const rOp  = fi(frame, 16, 32, 0, 1);

	// ── Scene B: LB Geves (68–255f) ──
	const bRelF  = frame - 68;
	const bIn    = fi(bRelF, 0, 22, 0, 1);
	const bOut   = fi(bRelF, 153, 170, 1, 0);
	const bSc    = spring({frame: bRelF, fps, config: {stiffness: 70, damping: 18}});
	const bScY   = fi(bRelF, 0, 22, 30, 0);
	const bScroll= fi(bRelF, 20, 140, 0, 220, Easing.bezier(0.0, 0.55, 0.45, 1));
	const bLblOp = fi(bRelF, 14, 32, 0, 1);
	const bLblY  = fi(bRelF, 14, 32, 14, 0);

	// ── Scene C: EladFit (238–435f) ──
	const cRelF  = frame - 238;
	const cIn    = fi(cRelF, 0, 22, 0, 1);
	const cOut   = fi(cRelF, 163, 180, 1, 0);
	const cSc    = spring({frame: cRelF, fps, config: {stiffness: 70, damping: 18}});
	const cTx    = fi(cRelF, 0, 22, 60, 0, EXPO);
	const cScroll= fi(cRelF, 18, 145, 0, 320, Easing.bezier(0.0, 0.55, 0.45, 1));
	const cLblOp = fi(cRelF, 14, 32, 0, 1);
	const cLblY  = fi(cRelF, 14, 32, 14, 0);

	// ── Scene D: Elad Trail (418–620f) ──
	const dRelF  = frame - 418;
	const dIn    = fi(dRelF, 0, 22, 0, 1);
	const dOut   = fi(dRelF, 160, 178, 1, 0);
	const dSc    = spring({frame: dRelF, fps, config: {stiffness: 70, damping: 18}});
	const dTx    = fi(dRelF, 0, 22, -60, 0, EXPO);
	const dScroll= fi(dRelF, 18, 142, 0, 280, Easing.bezier(0.0, 0.55, 0.45, 1));
	const dLblOp = fi(dRelF, 14, 32, 0, 1);
	const dLblY  = fi(dRelF, 14, 32, 14, 0);

	// ── Scene E: CTA (610–750f) ──
	const eRelF = frame - 610;
	const eOp   = fi(eRelF, 0, 18, 0, 1);
	const eSc   = spring({frame: eRelF, fps, config: {stiffness: 60, damping: 18}});
	const ctaSc = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);
	const ctaBd = 0.5 + 0.5 * Math.abs(Math.sin((frame / fps) * Math.PI * 2));

	return (
		<AbsoluteFill style={{background: BLACK, overflow: 'hidden'}}>
			<style>{`@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&family=Montserrat:wght@700;900&display=swap');`}</style>
			<GeomLines />
			<TopBar f={frame} />

			{/* ── SCENE A: INTRO ── */}
			<Sequence from={0} durationInFrames={82}>
				<AbsoluteFill style={{
					display: 'flex', flexDirection: 'column',
					alignItems: 'center', justifyContent: 'center',
					gap: 20, opacity: aOut,
				}}>
					<div style={{opacity: hOp, transform: `translateY(${hY}px)`, textAlign: 'center', direction: 'rtl'}}>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 13,
							color: 'rgba(197,160,89,0.6)', letterSpacing: '0.28em',
							margin: '0 0 14px', textTransform: 'uppercase',
						}}>
							עבודות אחרונות
						</p>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 60, fontWeight: 900,
							color: WHITE, margin: 0, lineHeight: 1.1,
							textShadow: `0 0 60px rgba(197,160,89,0.15)`,
						}}>
							הפרויקטים שלנו
						</p>
					</div>
					<div style={{opacity: rOp}}><GoldLine w={90} /></div>
					<div style={{opacity: sOp, transform: `translateY(${sY}px)`, textAlign: 'center', direction: 'rtl', maxWidth: 500}}>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 22, fontWeight: 300,
							color: 'rgba(229,228,226,0.48)', margin: 0, lineHeight: 1.6,
						}}>
							כך נראות הנוכחויות הדיגיטליות<br />שאנחנו בונים ללקוחות שלנו
						</p>
					</div>
				</AbsoluteFill>
			</Sequence>

			{/* ── SCENE B: LB Geves ── */}
			{frame >= 68 && frame < 258 && (
				<AbsoluteFill style={{
					display: 'flex', flexDirection: 'column',
					alignItems: 'center', justifyContent: 'center',
					gap: 28, padding: '0 6%',
					opacity: bIn * bOut,
				}}>
					<ProjectLabel
						name="אל.בי. גבס"
						category="אתר עסקי"
						accent="30,107,158"
						opacity={bLblOp}
						translateY={bLblY}
					/>
					<BrowserMockup
						scrollY={bScroll}
						opacity={1}
						scale={bSc * 0.82}
						translateY={bScY}
					/>
					<div style={{
						opacity: fi(bRelF, 32, 50, 0, 1),
						direction: 'rtl', textAlign: 'center',
					}}>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 15, fontWeight: 300,
							color: 'rgba(197,160,89,0.65)', margin: 0, letterSpacing: '0.06em',
						}}>
							אתר מלא ✦ בלוג ✦ SEO ✦ נגישות AA
						</p>
					</div>
				</AbsoluteFill>
			)}

			{/* ── SCENE C: EladFit ── */}
			{frame >= 238 && frame < 438 && (
				<AbsoluteFill style={{
					display: 'flex', flexDirection: 'column',
					alignItems: 'center', justifyContent: 'center',
					gap: 24, padding: '0 5%',
					opacity: cIn * cOut,
				}}>
					<ProjectLabel
						name="EladFit"
						category="מאמן כושר מקצועי"
						accent="232,66,10"
						opacity={cLblOp}
						translateY={cLblY}
					/>
					<PhoneMockup opacity={1} scale={cSc} translateX={cTx}>
						<EladFitSite scrollY={cScroll} />
					</PhoneMockup>
					<div style={{
						opacity: fi(cRelF, 32, 50, 0, 1),
						direction: 'rtl', textAlign: 'center',
					}}>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 15, fontWeight: 300,
							color: 'rgba(197,160,89,0.65)', margin: 0, letterSpacing: '0.06em',
						}}>
							מובייל ✦ אנימציות ✦ מוביל לפעולה
						</p>
					</div>
				</AbsoluteFill>
			)}

			{/* ── SCENE D: Elad Trail ── */}
			{frame >= 418 && frame < 622 && (
				<AbsoluteFill style={{
					display: 'flex', flexDirection: 'column',
					alignItems: 'center', justifyContent: 'center',
					gap: 24, padding: '0 5%',
					opacity: dIn * dOut,
				}}>
					<ProjectLabel
						name="המסלול של אלעד"
						category="יוצר תוכן"
						accent="76,175,92"
						opacity={dLblOp}
						translateY={dLblY}
					/>
					<PhoneMockup opacity={1} scale={dSc} translateX={dTx}>
						<EladTrailSite scrollY={dScroll} />
					</PhoneMockup>
					<div style={{
						opacity: fi(dRelF, 32, 50, 0, 1),
						direction: 'rtl', textAlign: 'center',
					}}>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 15, fontWeight: 300,
							color: 'rgba(197,160,89,0.65)', margin: 0, letterSpacing: '0.06em',
						}}>
							מיתוג ✦ עיצוב ✦ חוויית משתמש
						</p>
					</div>
				</AbsoluteFill>
			)}

			{/* ── SCENE E: CTA ── */}
			{frame >= 610 && (
				<AbsoluteFill style={{
					display: 'flex', flexDirection: 'column',
					alignItems: 'center', justifyContent: 'center',
					gap: 24, opacity: eOp,
				}}>
					<div style={{transform: `scale(${eSc})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
						<div style={{textAlign: 'center', direction: 'rtl'}}>
							<p style={{
								fontFamily: "'Heebo', sans-serif", fontSize: 24, fontWeight: 300,
								color: 'rgba(229,228,226,0.4)', margin: '0 0 10px',
							}}>
								הפרויקט הבא?
							</p>
							<p style={{
								fontFamily: "'Heebo', sans-serif", fontSize: 70, fontWeight: 900,
								color: GOLD, margin: 0, lineHeight: 1, letterSpacing: '-0.01em',
								textShadow: `0 0 60px rgba(197,160,89,0.25)`,
							}}>
								שלך.
							</p>
						</div>
						<GoldLine w={80} />
						<div style={{
							fontFamily: "'Montserrat', sans-serif", fontWeight: 900,
							fontSize: 88, letterSpacing: '0.22em', color: WHITE,
							textShadow: `0 0 40px rgba(197,160,89,0.1)`,
						}}>
							SLAVX
						</div>
						<div style={{transform: `scale(${ctaSc})`}}>
							<div style={{
								border: `2px solid rgba(197,160,89,${ctaBd})`,
								background: 'rgba(197,160,89,0.08)',
								color: GOLD, fontFamily: "'Heebo', sans-serif",
								fontWeight: 900, fontSize: 22, letterSpacing: '0.08em',
								direction: 'rtl', padding: '18px 54px', borderRadius: 6,
							}}>
								שלחו הודעה עכשיו ✦
							</div>
						</div>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 16,
							color: 'rgba(229,228,226,0.35)', direction: 'ltr',
							letterSpacing: '0.12em', margin: 0,
						}}>
							054-792-1821
						</p>
						<p style={{
							fontFamily: "'Montserrat', sans-serif", fontSize: 12,
							color: 'rgba(197,160,89,0.35)', letterSpacing: '0.22em', margin: 0,
						}}>
							SLAVX.SITE
						</p>
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ─────────────────────────────────────────────────────────────────────────────
// REEL 5 — "נוכחות דיגיטלית" — Why digital presence matters
// 570f = 19s @ 30fps
// ─────────────────────────────────────────────────────────────────────────────

const ValueProp: React.FC<{
	icon: string;
	title: string;
	sub: string;
	delay: number;
	frame: number;
}> = ({icon, title, sub, delay, frame}) => {
	const {fps} = useVideoConfig();
	const sc = spring({frame: frame - delay, fps, config: {stiffness: 130, damping: 22}});
	const op = fi(frame, delay, delay + 16, 0, 1);

	return (
		<div style={{
			opacity: op, transform: `scale(${sc})`,
			display: 'flex', alignItems: 'center', gap: 20,
			direction: 'rtl', width: '100%',
		}}>
			<div style={{
				width: 56, height: 56, borderRadius: 14, flexShrink: 0,
				background: 'rgba(197,160,89,0.09)',
				border: '1.5px solid rgba(197,160,89,0.35)',
				display: 'flex', alignItems: 'center', justifyContent: 'center',
				fontSize: 26,
			}}>
				{icon}
			</div>
			<div>
				<div style={{
					fontFamily: "'Heebo', sans-serif", fontSize: 22, fontWeight: 700,
					color: WHITE, lineHeight: 1.2,
				}}>
					{title}
				</div>
				<div style={{
					fontFamily: "'Heebo', sans-serif", fontSize: 14, fontWeight: 300,
					color: 'rgba(197,160,89,0.65)', marginTop: 3, lineHeight: 1.4,
				}}>
					{sub}
				</div>
			</div>
		</div>
	);
};

export const Reel5: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// ── Scene A: Hook (0–82f) ──
	const aOut = fi(frame, 68, 82, 1, 0);
	const h1Op = fi(frame, 6, 24, 0, 1); const h1Y = fi(frame, 6, 24, 28, 0);
	const h2Op = fi(frame, 22, 40, 0, 1); const h2Y = fi(frame, 22, 40, 24, 0);
	const h3Op = fi(frame, 36, 54, 0, 1); const h3Y = fi(frame, 36, 54, 20, 0);
	const rAOp = fi(frame, 30, 46, 0, 1);

	// ── Scene B: Value props (78–370f) ──
	const bOp  = fi(frame, 78, 94, 0, 1);
	const bOut = fi(frame, 354, 370, 1, 0);
	const bRel = frame - 78;
	const hdrOp = fi(bRel, 0, 16, 0, 1); const hdrY = fi(bRel, 0, 16, -14, 0);
	const divSc = fi(bRel, 18, 52, 0, 1, SILK);

	// ── Scene C: Core message (358–468f) ──
	const cRel = frame - 358;
	const cOp  = fi(cRel, 0, 18, 0, 1);
	const cOut = fi(cRel, 82, 98, 1, 0);
	const cSc  = spring({frame: cRel - 4, fps, config: {stiffness: 60, damping: 18}});
	const l1Op = fi(cRel, 4, 22, 0, 1); const l1Y = fi(cRel, 4, 22, 20, 0);
	const l2Op = fi(cRel, 20, 38, 0, 1); const l2Y = fi(cRel, 20, 38, 20, 0);
	const l3Op = fi(cRel, 36, 54, 0, 1); const l3Y = fi(cRel, 36, 54, 20, 0);

	// ── Scene D: CTA (456–570f) ──
	const dRel = frame - 456;
	const dOp  = fi(dRel, 0, 18, 0, 1);
	const dSc  = spring({frame: dRel - 2, fps, config: {stiffness: 65, damping: 18}});
	const ctaSc = 1 + 0.04 * Math.sin((frame / fps) * Math.PI * 2);
	const ctaBd = 0.5 + 0.5 * Math.abs(Math.sin((frame / fps) * Math.PI * 2));
	const shimX  = fi(dRel, 18, 54, -130, 230, SILK);

	return (
		<AbsoluteFill style={{background: DARK, overflow: 'hidden'}}>
			<style>{`@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&family=Montserrat:wght@700;900&display=swap');`}</style>
			<GeomLines />
			<TopBar f={frame} />

			{/* ── SCENE A: HOOK ── */}
			<Sequence from={0} durationInFrames={84}>
				<AbsoluteFill style={{
					display: 'flex', flexDirection: 'column',
					alignItems: 'center', justifyContent: 'center',
					padding: '0 12%', gap: 18, opacity: aOut,
				}}>
					{/* Left/right accent bars */}
					<div style={{position: 'absolute', left: 52, top: '22%', bottom: '22%', width: 2, background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)`, opacity: rAOp}} />
					<div style={{position: 'absolute', right: 52, top: '22%', bottom: '22%', width: 2, background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)`, opacity: rAOp}} />

					<div style={{opacity: h1Op, transform: `translateY(${h1Y}px)`, textAlign: 'center', direction: 'rtl'}}>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 26, fontWeight: 300,
							color: 'rgba(229,228,226,0.42)', margin: 0, letterSpacing: '0.04em',
						}}>
							כל יום שהלקוח מחפש אותך
						</p>
					</div>
					<div style={{opacity: h2Op, transform: `translateY(${h2Y}px)`, textAlign: 'center', direction: 'rtl'}}>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 66, fontWeight: 900,
							color: GOLD, margin: 0, lineHeight: 1.05, letterSpacing: '-0.01em',
							textShadow: `0 0 60px rgba(197,160,89,0.2)`,
						}}>
							הוא מוצא את<br />המתחרה
						</p>
					</div>
					<div style={{opacity: rAOp}}><GoldLine w={80} /></div>
					<div style={{opacity: h3Op, transform: `translateY(${h3Y}px)`, textAlign: 'center', direction: 'rtl', maxWidth: 460}}>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 22, fontWeight: 300,
							color: 'rgba(229,228,226,0.48)', margin: 0, lineHeight: 1.65,
						}}>
							נוכחות דיגיטלית חזקה<br />היא לא יתרון — היא הכרח
						</p>
					</div>
				</AbsoluteFill>
			</Sequence>

			{/* ── SCENE B: VALUE PROPS ── */}
			<Sequence from={76} durationInFrames={298}>
				<AbsoluteFill style={{
					display: 'flex', flexDirection: 'column',
					justifyContent: 'center', padding: '0 10%',
					gap: 0, opacity: bOp * bOut,
				}}>
					<div style={{
						opacity: hdrOp, transform: `translateY(${hdrY}px)`,
						marginBottom: 36, display: 'flex', flexDirection: 'column',
						alignItems: 'center', gap: 12,
					}}>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 13,
							color: 'rgba(197,160,89,0.6)', letterSpacing: '0.28em',
							margin: 0, textTransform: 'uppercase', direction: 'rtl',
						}}>
							מה אתר מקצועי עושה בשבילך
						</p>
						<GoldLine w={60} />
					</div>

					<ValueProp
						icon="📱" delay={8}
						title="עובד בשבילך 24/7"
						sub="האתר מייצג אותך ומושך לקוחות — גם בלילה"
						frame={bRel}
					/>

					<div style={{
						margin: '22px 0 22px 76px',
						width: 1, height: 28,
						background: `linear-gradient(180deg, rgba(197,160,89,0.5), rgba(197,160,89,0.1))`,
						transform: `scaleY(${divSc})`,
					}} />

					<ValueProp
						icon="🎯" delay={32}
						title="לקוחות חדשים מגוגל"
						sub="SEO נכון מביא אנשים שמחפשים בדיוק מה שאתה מוכר"
						frame={bRel}
					/>

					<div style={{
						margin: '22px 0 22px 76px',
						width: 1, height: 28,
						background: `linear-gradient(180deg, rgba(197,160,89,0.5), rgba(197,160,89,0.1))`,
						transform: `scaleY(${divSc})`,
					}} />

					<ValueProp
						icon="💎" delay={56}
						title="אמינות ורושם ראשון"
						sub="הלקוח שיפוט את העסק שלך לפי האתר — לפני שדיברתם"
						frame={bRel}
					/>

					<div style={{
						margin: '22px 0 22px 76px',
						width: 1, height: 28,
						background: `linear-gradient(180deg, rgba(197,160,89,0.5), rgba(197,160,89,0.1))`,
						transform: `scaleY(${divSc})`,
					}} />

					<ValueProp
						icon="⚡" delay={80}
						title="72 שעות — מוכן לאוויר"
						sub="SLAVX בונה את הנוכחות הדיגיטלית שלך בזמן שיא"
						frame={bRel}
					/>
				</AbsoluteFill>
			</Sequence>

			{/* ── SCENE C: CORE MESSAGE ── */}
			<Sequence from={356} durationInFrames={114}>
				<AbsoluteFill style={{
					display: 'flex', flexDirection: 'column',
					alignItems: 'center', justifyContent: 'center',
					padding: '0 11%', gap: 20,
					opacity: cOp * cOut,
					transform: `scale(${cSc})`,
				}}>
					<div style={{opacity: l1Op, transform: `translateY(${l1Y}px)`, textAlign: 'center', direction: 'rtl'}}>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 28, fontWeight: 300,
							color: 'rgba(229,228,226,0.42)', margin: 0,
						}}>
							עסק מצליח
						</p>
					</div>
					<div style={{opacity: l2Op, transform: `translateY(${l2Y}px)`, textAlign: 'center', direction: 'rtl'}}>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 74, fontWeight: 900,
							color: GOLD, margin: 0, lineHeight: 1.05, letterSpacing: '-0.02em',
							textShadow: `0 0 80px rgba(197,160,89,0.3)`,
						}}>
							מתחיל<br />באתר מצליח
						</p>
					</div>
					<div style={{opacity: fi(cRel, 18, 34, 0, 1)}}><GoldLine w={90} /></div>
					<div style={{opacity: l3Op, transform: `translateY(${l3Y}px)`, textAlign: 'center', direction: 'rtl', maxWidth: 480}}>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 22, fontWeight: 300,
							color: 'rgba(229,228,226,0.5)', margin: 0, lineHeight: 1.65,
						}}>
							אנחנו לא בונים אתרים —<br />אנחנו בונים כלי צמיחה לעסק שלך
						</p>
					</div>
				</AbsoluteFill>
			</Sequence>

			{/* ── SCENE D: CTA ── */}
			<Sequence from={454} durationInFrames={116}>
				<AbsoluteFill style={{
					display: 'flex', flexDirection: 'column',
					alignItems: 'center', justifyContent: 'center',
					gap: 22, opacity: dOp,
					transform: `scale(${dSc})`,
				}}>
					{/* Top/bottom gold bars */}
					<div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`}} />
					<div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`}} />

					{/* SLAVX with shimmer */}
					<div style={{position: 'relative', overflow: 'hidden'}}>
						<div style={{
							fontFamily: "'Montserrat', sans-serif", fontWeight: 900,
							fontSize: 110, letterSpacing: '0.22em',
							textTransform: 'uppercase', lineHeight: 1, color: WHITE,
							textShadow: `0 0 60px rgba(197,160,89,0.2)`,
						}}>
							SLAVX
						</div>
						<div style={{
							position: 'absolute', top: 0, bottom: 0,
							left: `${shimX}px`, width: 60,
							background: 'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.5) 60%, transparent 100%)',
							pointerEvents: 'none',
						}} />
					</div>

					<GoldLine w={100} />

					<div style={{textAlign: 'center', direction: 'rtl'}}>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 22, fontWeight: 300,
							color: 'rgba(197,160,89,0.85)', margin: 0, letterSpacing: '0.06em',
						}}>
							סטודיו דיגיטלי לבניית אתרים פרימיום
						</p>
					</div>

					<div style={{transform: `scale(${ctaSc})`}}>
						<div style={{
							border: `2px solid rgba(197,160,89,${ctaBd})`,
							background: 'rgba(197,160,89,0.08)',
							color: GOLD, fontFamily: "'Heebo', sans-serif",
							fontWeight: 900, fontSize: 24, letterSpacing: '0.08em',
							direction: 'rtl', padding: '18px 56px', borderRadius: 6,
						}}>
							שלחו הודעה עכשיו ✦
						</div>
					</div>

					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
						<p style={{
							fontFamily: "'Heebo', sans-serif", fontSize: 18, fontWeight: 300,
							color: 'rgba(229,228,226,0.38)', margin: 0, direction: 'ltr', letterSpacing: '0.14em',
						}}>
							054-792-1821
						</p>
						<p style={{
							fontFamily: "'Montserrat', sans-serif", fontSize: 12,
							color: 'rgba(197,160,89,0.38)', margin: 0, letterSpacing: '0.22em',
						}}>
							SLAVX.SITE
						</p>
					</div>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
