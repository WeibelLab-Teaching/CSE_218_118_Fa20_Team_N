import { Client } from "colyseus.js";

const GAME_PROTOCOL = window.location.protocol.replace("http", "ws");

const GAME_ENDPOINT = (window.location.hostname.indexOf("heroku") >= 0 || window.location.hostname.indexOf("now.sh") >= 0 )
    ? `${ GAME_PROTOCOL }//amazeinggameserver.herokuapp.com` // port 80 on heroku or now
    : `${ GAME_PROTOCOL }//${ window.location.hostname }:2657` // port 2657 on localhost

const AUDIO_PROTOCOL = window.location.protocol;

export const AUDIO_ENDPOINT = (window.location.hostname.indexOf("heroku") >= 0 || window.location.hostname.indexOf("now.sh") >= 0 )
    ? `${ AUDIO_PROTOCOL }//amazeingaudioserver.herokuapp.com` // port 80 on heroku or now
    : `${ AUDIO_PROTOCOL }//${ window.location.hostname }:2658` // port 2657 on localhost

export const client = new Client(GAME_ENDPOINT);
