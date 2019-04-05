#!/usr/bin/env node

import { getCover } from 'poshett-file';
import Mpd from "mpd";

// TODO Also use `albumart` command (https://www.musicpd.org/doc/html/protocol.html#the-music-database)

export type CAImage = {
	edit: 37284546,
	id: 12750224075,
	image: string;

	thumbnails: {
		250: string;
		500: string;
		1200: string;
		small: string;
		large: string;
	},

	comment: string;
	approved: boolean;
	front:false;
	types: CAType[];
	back: boolean;
}

export type CAType =
	'Front' |
	'Back' |
	'Booklet' |
	'Medium' |
	'Tray' |
	'Obi' |
	'Spine' |
	'Track' |
	'Liner' |
	'Sticker' |
	'Poster' |
	'Watermark' |
	'Raw/Unedited' |
	'Other';

const mpd = Mpd.connect({
	host: "mpd.fixme.ch",
	port: 6600
});

mpd.on("ready", () => {
	console.log("MPD connected");
	querySong();
});

mpd.on('system-player', () => {
	querySong();
});

function querySong() {
	mpd.sendCommand(Mpd.cmd("status", []), (err, msg) => {
		if (err) {
			throw err;
		}

		if (err) throw err
		// console.log(msgStr)
		let status = Mpd.parseKeyValueMessage(msg);

		if (status.state === 'play') {
		}

		console.log(status.song);

		if (!status.song) {
			throw "No song found";
		}

		mpd.sendCommand(Mpd.cmd("playlistinfo", [status.song]), (err, msg) => {
			if (err) {
				throw err;
			}

			if (err) throw err;
			let song = Mpd.parseKeyValueMessage(msg);
			console.log(song);
			console.log(song.file);

			getCover(song.file)
			.then((img: CAImage) => {
				console.log(img.image);
				poshett.setCurrentMusic({ imgUrl: img.image });
			})
			.catch((err) => {
				console.error(err);
			});
		});
	});
}

if (require.main === module) {
	// PoshettMusicBrainz.getCover();
}
