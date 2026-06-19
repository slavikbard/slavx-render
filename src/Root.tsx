import React from 'react';
import {Composition} from 'remotion';
import {SlavxAd} from './SlavxAd';
import {Reel1, Reel2, Reel3} from './Reels';
import {Reel4, Reel5} from './Reels2';
import {RussianNewsReel} from './RussianNews';
import {EXAMPLE_NEWS} from './content/news-data';

export const RemotionRoot = () => (
	<>
		<Composition id="SlavxAd"  component={SlavxAd} width={1080} height={1920} fps={30} durationInFrames={510} />
		<Composition id="Reel1"    component={Reel1}   width={1080} height={1920} fps={30} durationInFrames={270} />
		<Composition id="Reel2"    component={Reel2}   width={1080} height={1920} fps={30} durationInFrames={300} />
		<Composition id="Reel3"    component={Reel3}   width={1080} height={1920} fps={30} durationInFrames={270} />
		<Composition id="Reel4"    component={Reel4}   width={1080} height={1920} fps={30} durationInFrames={750} />
		<Composition id="Reel5"    component={Reel5}   width={1080} height={1920} fps={30} durationInFrames={570} />
		<Composition
			id="RussianNewsReel"
			component={RussianNewsReel}
			width={1080}
			height={1920}
			fps={30}
			durationInFrames={450}
			defaultProps={{
				news: EXAMPLE_NEWS,
				brandName: 'НОВОСТИ IL',
			}}
		/>
	</>
);
