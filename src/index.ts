#!/usr/bin/env node

import { getCover } from 'poshett-musicbrainz';
import PoshettWeb from "@fnu/poshett-web";
import Mpd from "mpd";

// TODO Also use `albumart` command (https://www.musicpd.org/doc/html/protocol.html#the-music-database)

const poshett = new PoshettWeb();

poshett.initServer();
poshett.startServer();

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
			getCover(song.Title, song.Artist)
			.then(img => {
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
