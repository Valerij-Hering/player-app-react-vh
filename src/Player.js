import { useRef, useState, useEffect, useCallback } from "react"
import data from "./data";
import React from 'react';



const Player = () => {

    const refAudio = useRef();
    const[paused, setPaused] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [looping, setLooping] = useState(false);
    const [muted, setMuted] = useState(false);

    const toggleMute = () => {
        setMuted(!muted);
    };

    const handlepiay = () => {
        setPaused(!paused);
        paused ? refAudio.current.play() : refAudio.current.pause();
    }

    const handleTimeUpdate = () => {
        setCurrentTime(refAudio.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(refAudio.current.duration);
    };

    useEffect(() => {
        const audioElement = refAudio.current;

        if (audioElement) {
            audioElement.addEventListener('timeupdate', handleTimeUpdate);
            audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);

            return () => {
                audioElement.removeEventListener('timeupdate', handleTimeUpdate);
                audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, []);

    const calculateProgress = () => {
        return (currentTime / duration) * 100;
    };

    const handleProgressBarClick = (event) => {
        const progressBar = event.currentTarget;
        const clickPosition = event.clientX - progressBar.getBoundingClientRect().left;
        const progressBarWidth = progressBar.clientWidth;
        const newTime = (clickPosition / progressBarWidth) * duration;

        if (paused) {
            refAudio.current.play();
            setPaused(false);
        }

        refAudio.current.currentTime = newTime;
    };

    const [song, setSong] = useState(0);
    const {path, poster, songName, singer} = data[song];

    useEffect(() => {
        if (!paused) {
            refAudio.current.play();
        } else {
            refAudio.current.pause();
        }
    }, [paused, song]);

    const prevSong = () => {
        setPaused(false);
        setSong((prevSong) => {
            let newSong = prevSong - 1;
            if (newSong < 0) {
                newSong = data.length - 1;
            }
            return newSong;
        });
    };

    const nextSong = useCallback(() => {
        setSong((prevSong) => {
            let newSong = prevSong + 1;
            if (newSong > data.length - 1) {
                newSong = 0;
            }
            return newSong;
        });
        setPaused(false);
    }, []);

    useEffect(() => {
        const audioElement = refAudio.current;

        const handleEnded = () => {
            if (!looping) {
                nextSong();
            }
        };

        if (audioElement) {
            audioElement.addEventListener('timeupdate', handleTimeUpdate);
            audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
            audioElement.addEventListener('ended', handleEnded);

            return () => {
                audioElement.removeEventListener('timeupdate', handleTimeUpdate);
                audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audioElement.removeEventListener('ended', handleEnded);
            };
        }
    }, [looping, nextSong]);

    const toggleLoop = () => {
        setLooping(!looping); // Step 2
        refAudio.current.loop = !looping; // Step 4
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="music-player">
            
                <audio className="audio"
                ref={refAudio}
                src={`${path}.mp3`}
                loop={looping}
                muted={muted}
                >
                </audio>

        <img className="poster" src={`${poster}.jpeg`} alt="poster"/>
        <div>
            <p className="song-name">{songName}</p>
            <p className="singer">{singer}</p>
        </div>
        <div className="container-progressBar-timeDisplay">
            <div className="progressBar" onClick={handleProgressBarClick}>
                <div className="progress" style={{ width: `${calculateProgress()}%` }}></div>
            </div>
            <div className="timeDisplay">
                <span>{formatTime(currentTime)}</span>  <span>{formatTime(duration)}</span>
            </div>
        </div>
        <div className="container-buttons">
            <div onClick={prevSong} className="container-btnPrevNext">
                <i className="fas fa-backward icon-prevNext prev"></i>
            </div>

            <div onClick={handlepiay} className={ paused ? "box-playPause2" : "box-playPause"}>
                { paused ? <i className="fas fa-play icon-playPause"></i> : <i className="fas fa-pause icon-playPause2"></i>}
            </div>

            <div onClick={nextSong} className="container-btnPrevNext">
                <i className="fas fa-forward icon-prevNext next"></i>
            </div>
        </div>
            <div className="box-loopEndMuted">
                <div onClick={toggleLoop} className={ looping ? "icon-loopColor" : "icon-loop"}>
                    <ion-icon name="repeat-outline"></ion-icon>
                </div>
                <div onClick={toggleMute} className={ muted ? "icon-loopColor" : "icon-loop"}>
                    {muted ? <ion-icon name="volume-mute-outline"></ion-icon> : <ion-icon name="volume-high-outline"></ion-icon>}
                </div>
            </div>

            {/* <div className={ showPlayList ? "container_playlist" : "container_playlist2"}>
            {playList.map(element => {
                const { songName, poster, singer, timeSong } = element;
                return (
                    <div className="box_song">
                        <img className="playList_poster" src={`${poster}.jpeg`} alt="poster"/>
                        <div className="playList_box_songNameEndSinger">
                            <p className="playList_songName">{songName}</p>
                            <p className="playList_singer">{singer}</p>
                        </div>
                        <p className="playList_songTime">{timeSong}</p>
                    </div>
                )
            })}
        </div>
            <nav>
                <button to="/options" className={"link"}><ion-icon name="options-outline"></ion-icon></button>
                <button to="/" onClick={showPlayer} className="link"><ion-icon name="play-outline"></ion-icon></button>
                <button onClick={toggleshowPlayList} to="playlist" className={ showPlayList ? "linkActive" : "link"}><ion-icon name="list-outline"></ion-icon></button>
            </nav> */}
        </div>
    )
}

export default Player





