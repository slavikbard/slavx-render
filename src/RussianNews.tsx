import {
	AbsoluteFill, interpolate, spring,
	useCurrentFrame, useVideoConfig,
	Sequence, Easing,
} from 'remotion';
import React from 'react';
import {RussianNewsReelProps} from './content/news-data';

const NAVY   = '#0A0F1A';
const RED    = '#D43333';
const RED2   = '#FF4444';
const WHITE  = '#FFFFFF';
const GRAY   = '#8B9CB6';
const BLUE   = '#1B3A6B';
const DARK2  = '#0D1321';

const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const BACK = Easing.bezier(0.34, 1.56, 0.64, 1);

function fi(f: number, a: number, b: number, lo = 0, hi = 1, ease = EXPO) {
	return interpolate(f, [a, b], [lo, hi], {
		extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease,
	});
}

const CATEGORY_COLORS: Record<string, string> = {
	'ПОЛИТИКА': '#2563EB',
	'БЕЗОПАСНОСТЬ': '#DC2626',
	'ЭКОНОМИКА': '#059669',
	'ОБЩЕСТВО': '#7C3AED',
	'БЛИЖНИЙ ВОСТОК': '#D97706',
	'ТЕХНОЛОГИИ': '#0891B2',
};

const NewsGrid: React.FC<{op?: number}> = ({op = 1}) => (
	<svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: op * 0.4}} viewBox="0 0 1080 1920" preserveAspectRatio="none">
		<line x1="0" y1="300" x2="300" y2="0" stroke={RED} strokeWidth="0.5" strokeOpacity="0.1"/>
		<line x1="780" y1="1920" x2="1080" y2="1620" stroke={RED} strokeWidth="0.5" strokeOpacity="0.1"/>
		<rect x="30" y="30" width="1020" height="1860" stroke={RED} strokeWidth="0.8" strokeOpacity="0.06" fill="none"/>
		<line x1="0" y1="960" x2="1080" y2="960" stroke={WHITE} strokeWidth="0.3" strokeOpacity="0.04"/>
	</svg>
);

const RedBar: React.FC<{width: number; opacity: number; top: number}> = ({width, opacity, top}) => (
	<div style={{
		position: 'absolute', top, left: 0, height: 4,
		width: `${width}%`, background: `linear-gradient(90deg, ${RED}, ${RED2}, transparent)`,
		opacity,
	}} />
);

const PulseRing: React.FC<{frame: number; delay: number}> = ({frame, delay}) => {
	const {fps} = useVideoConfig();
	const sc = spring({frame: frame - delay, fps, config: {stiffness: 40, damping: 8}});
	const op = fi(frame, delay, delay + 30, 0.8, 0);
	return (
		<div style={{
			position: 'absolute', width: 200, height: 200, borderRadius: '50%',
			border: `2px solid ${RED}`, opacity: op, transform: `scale(${sc})`,
		}} />
	);
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 1 — Breaking News Intro (0–60)
// ═══════════════════════════════════════════════════════════════════════════════
const BreakingIntro: React.FC<{frame: number}> = ({frame}) => {
	const {fps} = useVideoConfig();

	const bgOp    = fi(frame, 0, 10, 0, 1);
	const barW    = fi(frame, 0, 25, 0, 100, Easing.bezier(0.4, 0, 0.2, 1));
	const barOp   = fi(frame, 0, 8, 0, 1);
	const textSc  = spring({frame: frame - 12, fps, config: {stiffness: 300, damping: 20, mass: 0.6}});
	const textOp  = fi(frame, 12, 22, 0, 1);
	const flashOp = fi(frame, 8, 14, 0.6, 0);
	const subOp   = fi(frame, 28, 40, 0, 1);
	const subY    = fi(frame, 28, 40, 20, 0);
	const sceneOut = fi(frame, 50, 60, 1, 0);

	return (
		<AbsoluteFill style={{background: NAVY, opacity: bgOp * sceneOut, overflow: 'hidden'}}>
			<NewsGrid />
			<RedBar width={barW} opacity={barOp} top={0} />
			<RedBar width={barW} opacity={barOp * 0.5} top={1916} />

			{/* Flash overlay */}
			<div style={{position: 'absolute', inset: 0, background: RED, opacity: flashOp}} />

			{/* Pulse rings */}
			<div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<PulseRing frame={frame} delay={6} />
				<PulseRing frame={frame} delay={14} />
			</div>

			{/* СРОЧНЫЕ НОВОСТИ */}
			<div style={{
				position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
				alignItems: 'center', justifyContent: 'center', gap: 20,
			}}>
				<div style={{
					opacity: textOp, transform: `scale(${textSc})`,
					fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 72,
					color: WHITE, letterSpacing: '0.08em', textAlign: 'center',
					textShadow: `0 0 60px rgba(212,51,51,0.4)`,
				}}>
					СРОЧНЫЕ
					<br />
					НОВОСТИ
				</div>

				<div style={{
					opacity: subOp, transform: `translateY(${subY}px)`,
					display: 'flex', alignItems: 'center', gap: 16,
				}}>
					<div style={{width: 40, height: 2, background: `linear-gradient(90deg, transparent, ${RED})`}} />
					<div style={{
						fontFamily: "'Roboto', sans-serif", fontSize: 18, fontWeight: 300,
						color: GRAY, letterSpacing: '0.15em',
					}}>
						ИЗРАИЛЬ
					</div>
					<div style={{width: 40, height: 2, background: `linear-gradient(90deg, ${RED}, transparent)`}} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 2 — Headline (55–170)
// ═══════════════════════════════════════════════════════════════════════════════
const HeadlineScene: React.FC<{frame: number; headline: string; subheadline: string; category: string}> = ({
	frame, headline, subheadline, category,
}) => {
	const {fps} = useVideoConfig();
	const catColor = CATEGORY_COLORS[category] || RED;

	const sceneIn  = fi(frame, 0, 14, 0, 1);
	const sceneOut = fi(frame, 100, 115, 1, 0);

	const catSc = spring({frame: frame - 6, fps, config: {stiffness: 200, damping: 22}});
	const catOp = fi(frame, 6, 18, 0, 1);

	const headOp = fi(frame, 18, 32, 0, 1);
	const headY  = fi(frame, 18, 32, 30, 0);

	const lineOp = fi(frame, 34, 46, 0, 1);
	const lineW  = fi(frame, 34, 56, 0, 100, Easing.bezier(0.4, 0, 0.2, 1));

	const subOp = fi(frame, 44, 58, 0, 1);
	const subY  = fi(frame, 44, 58, 16, 0);

	return (
		<AbsoluteFill style={{background: NAVY, overflow: 'hidden', opacity: sceneIn * sceneOut}}>
			<NewsGrid />

			<div style={{
				position: 'absolute', top: 0, left: 0, right: 0, height: 4,
				background: `linear-gradient(90deg, ${catColor}, transparent)`,
				opacity: sceneIn,
			}} />

			<div style={{
				position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
				alignItems: 'flex-start', justifyContent: 'center',
				padding: '0 70px', gap: 24,
			}}>
				{/* Category badge */}
				<div style={{
					opacity: catOp, transform: `scale(${catSc})`,
					background: catColor, borderRadius: 6, padding: '8px 20px',
				}}>
					<span style={{
						fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 16,
						color: WHITE, letterSpacing: '0.12em',
					}}>
						{category}
					</span>
				</div>

				{/* Headline */}
				<div style={{
					opacity: headOp, transform: `translateY(${headY}px)`,
					fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 52,
					color: WHITE, lineHeight: 1.15, maxWidth: 940,
				}}>
					{headline}
				</div>

				{/* Divider line */}
				<div style={{
					width: `${lineW}%`, maxWidth: 200, height: 3,
					background: `linear-gradient(90deg, ${RED}, transparent)`,
					opacity: lineOp,
				}} />

				{/* Subheadline */}
				<div style={{
					opacity: subOp, transform: `translateY(${subY}px)`,
					fontFamily: "'Roboto', sans-serif", fontWeight: 400, fontSize: 28,
					color: GRAY, lineHeight: 1.4, maxWidth: 880,
				}}>
					{subheadline}
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 3 — Detail Lines (165–310)
// ═══════════════════════════════════════════════════════════════════════════════
const DetailLine: React.FC<{text: string; index: number; frame: number; delay: number}> = ({
	text, index, frame, delay,
}) => {
	const {fps} = useVideoConfig();
	const sc = spring({frame: frame - delay, fps, config: {stiffness: 160, damping: 22}});
	const op = fi(frame, delay, delay + 14, 0, 1);
	const barH = fi(frame, delay, delay + 20, 0, 100);

	return (
		<div style={{
			opacity: op, transform: `scale(${sc})`,
			display: 'flex', alignItems: 'stretch', gap: 20, width: '100%',
		}}>
			{/* Red left bar */}
			<div style={{
				width: 4, borderRadius: 2, flexShrink: 0,
				background: `linear-gradient(180deg, ${RED}, ${RED}80)`,
				height: `${barH}%`,
			}} />
			{/* Number + text */}
			<div style={{display: 'flex', flexDirection: 'column', gap: 4, flex: 1}}>
				<span style={{
					fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 16,
					color: RED, letterSpacing: '0.05em',
				}}>
					{String(index + 1).padStart(2, '0')}
				</span>
				<span style={{
					fontFamily: "'Roboto', sans-serif", fontWeight: 400, fontSize: 26,
					color: WHITE, lineHeight: 1.45,
				}}>
					{text}
				</span>
			</div>
		</div>
	);
};

const DetailsScene: React.FC<{frame: number; bodyLines: string[]}> = ({frame, bodyLines}) => {
	const sceneIn  = fi(frame, 0, 14, 0, 1);
	const sceneOut = fi(frame, 130, 145, 1, 0);

	const titleOp = fi(frame, 4, 18, 0, 1);
	const titleY  = fi(frame, 4, 18, -16, 0);

	return (
		<AbsoluteFill style={{background: NAVY, overflow: 'hidden', opacity: sceneIn * sceneOut}}>
			<NewsGrid />

			<div style={{
				position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
				alignItems: 'flex-start', justifyContent: 'center',
				padding: '0 70px', gap: 32,
			}}>
				{/* Section header */}
				<div style={{
					opacity: titleOp, transform: `translateY(${titleY}px)`,
					display: 'flex', alignItems: 'center', gap: 14,
				}}>
					<div style={{width: 8, height: 8, borderRadius: '50%', background: RED}} />
					<span style={{
						fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 18,
						color: GRAY, letterSpacing: '0.2em',
					}}>
						ПОДРОБНОСТИ
					</span>
				</div>

				{/* Detail lines */}
				{bodyLines.map((line, i) => (
					<DetailLine
						key={i}
						text={line}
						index={i}
						frame={frame}
						delay={20 + i * 26}
					/>
				))}
			</div>
		</AbsoluteFill>
	);
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 4 — Commentary (305–380)
// ═══════════════════════════════════════════════════════════════════════════════
const CommentaryScene: React.FC<{frame: number; commentaryLine: string}> = ({frame, commentaryLine}) => {
	const {fps} = useVideoConfig();

	const sceneIn  = fi(frame, 0, 14, 0, 1);
	const sceneOut = fi(frame, 60, 75, 1, 0);

	const quoteOp = fi(frame, 8, 20, 0, 1);
	const quoteSc = spring({frame: frame - 8, fps, config: {stiffness: 100, damping: 18}});

	const textOp = fi(frame, 16, 30, 0, 1);
	const textY  = fi(frame, 16, 30, 20, 0);

	const labelOp = fi(frame, 28, 40, 0, 1);

	return (
		<AbsoluteFill style={{background: NAVY, overflow: 'hidden', opacity: sceneIn * sceneOut}}>
			<NewsGrid />

			{/* Warm accent background */}
			<div style={{
				position: 'absolute', top: '30%', left: '5%', right: '5%', bottom: '30%',
				background: `linear-gradient(135deg, rgba(27,58,107,0.3), rgba(212,51,51,0.08))`,
				borderRadius: 20, border: `1px solid rgba(139,156,182,0.12)`,
			}} />

			<div style={{
				position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
				alignItems: 'center', justifyContent: 'center',
				padding: '0 80px', gap: 30,
			}}>
				{/* Large quote mark */}
				<div style={{
					opacity: quoteOp, transform: `scale(${quoteSc})`,
					fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 120,
					color: RED, lineHeight: 0.6, opacity: quoteOp * 0.3,
				}}>
					«
				</div>

				{/* Commentary text */}
				<div style={{
					opacity: textOp, transform: `translateY(${textY}px)`,
					fontFamily: "'Roboto', sans-serif", fontWeight: 400, fontSize: 30,
					fontStyle: 'italic', color: WHITE, lineHeight: 1.5,
					textAlign: 'center', maxWidth: 860,
				}}>
					{commentaryLine}
				</div>

				{/* Label */}
				<div style={{
					opacity: labelOp, display: 'flex', alignItems: 'center', gap: 12,
				}}>
					<div style={{width: 30, height: 1, background: GRAY}} />
					<span style={{
						fontFamily: "'Roboto', sans-serif", fontWeight: 300, fontSize: 14,
						color: GRAY, letterSpacing: '0.15em',
					}}>
						КОММЕНТАРИЙ
					</span>
					<div style={{width: 30, height: 1, background: GRAY}} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 5 — Brand Outro (375–450)
// ═══════════════════════════════════════════════════════════════════════════════
const OutroScene: React.FC<{frame: number; brandName: string}> = ({frame, brandName}) => {
	const {fps} = useVideoConfig();

	const sceneIn = fi(frame, 0, 14, 0, 1);

	const logoSc = spring({frame: frame - 6, fps, config: {stiffness: 200, damping: 20}});
	const logoOp = fi(frame, 6, 18, 0, 1);

	const ruleOp = fi(frame, 16, 28, 0, 1);
	const ruleW  = fi(frame, 16, 36, 0, 80, Easing.bezier(0.4, 0, 0.2, 1));

	const ctaOp = fi(frame, 24, 38, 0, 1);
	const ctaY  = fi(frame, 24, 38, 16, 0);

	const pulse = 1 + 0.03 * Math.sin((frame / fps) * Math.PI * 2.5);

	return (
		<AbsoluteFill style={{background: NAVY, overflow: 'hidden', opacity: sceneIn}}>
			<NewsGrid />

			<div style={{
				position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
				alignItems: 'center', justifyContent: 'center', gap: 28,
			}}>
				{/* Brand name */}
				<div style={{
					opacity: logoOp, transform: `scale(${logoSc})`,
					fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 56,
					color: WHITE, letterSpacing: '0.1em',
					textShadow: `0 0 40px rgba(212,51,51,0.2)`,
				}}>
					{brandName}
				</div>

				{/* Red rule */}
				<div style={{
					width: ruleW, height: 3, opacity: ruleOp,
					background: `linear-gradient(90deg, transparent, ${RED}, transparent)`,
				}} />

				{/* Subscribe CTA */}
				<div style={{
					opacity: ctaOp, transform: `translateY(${ctaY}px) scale(${pulse})`,
					display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
				}}>
					<div style={{
						background: RED, borderRadius: 12, padding: '14px 40px',
						fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 22,
						color: WHITE, letterSpacing: '0.08em',
					}}>
						ПОДПИСЫВАЙТЕСЬ
					</div>
					<span style={{
						fontFamily: "'Roboto', sans-serif", fontWeight: 300, fontSize: 16,
						color: GRAY, letterSpacing: '0.1em',
					}}>
						СЛЕДИТЕ ЗА НОВОСТЯМИ
					</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════════════════════════════════════════
export const RussianNewsReel: React.FC<RussianNewsReelProps> = ({
	news,
	brandName = 'НОВОСТИ IL',
}) => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill style={{background: NAVY, overflow: 'hidden'}}>
			<style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Roboto:ital,wght@0,300;0,400;0,700;0,900;1,400&display=swap');`}</style>

			{/* Scene 1: Breaking Intro */}
			<Sequence from={0} durationInFrames={65}>
				<BreakingIntro frame={frame} />
			</Sequence>

			{/* Scene 2: Headline */}
			<Sequence from={55} durationInFrames={120}>
				<HeadlineScene
					frame={frame - 55}
					headline={news.headline}
					subheadline={news.subheadline}
					category={news.category}
				/>
			</Sequence>

			{/* Scene 3: Detail Lines */}
			<Sequence from={165} durationInFrames={150}>
				<DetailsScene
					frame={frame - 165}
					bodyLines={news.bodyLines}
				/>
			</Sequence>

			{/* Scene 4: Commentary */}
			<Sequence from={305} durationInFrames={80}>
				<CommentaryScene
					frame={frame - 305}
					commentaryLine={news.commentaryLine}
				/>
			</Sequence>

			{/* Scene 5: Brand Outro */}
			<Sequence from={375} durationInFrames={75}>
				<OutroScene
					frame={frame - 375}
					brandName={brandName}
				/>
			</Sequence>

			{/* Bottom ticker bar */}
			{frame >= 55 && frame < 375 && (
				<div style={{
					position: 'absolute', bottom: 0, left: 0, right: 0, height: 50,
					background: `linear-gradient(0deg, ${DARK2}, transparent)`,
					display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
					paddingBottom: 12, opacity: fi(frame, 55, 70, 0, 0.7),
				}}>
					<div style={{
						overflow: 'hidden', width: '100%', display: 'flex', justifyContent: 'center',
					}}>
						<div style={{
							fontFamily: "'Roboto', sans-serif", fontWeight: 300, fontSize: 13,
							color: GRAY, letterSpacing: '0.08em', whiteSpace: 'nowrap',
							transform: `translateX(${interpolate(frame, [55, 375], [600, -600], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}px)`,
						}}>
							{news.sourceDate} • {news.category} • {news.headline} • {news.subheadline}
						</div>
					</div>
				</div>
			)}
		</AbsoluteFill>
	);
};
