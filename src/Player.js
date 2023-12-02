
import { useRef, useState, useEffect, useCallback } from "react";

import data from "./data";
import React from 'react';
import Playlist from "./MyPlaylist";



const Player = () => {
  const refAudio = useRef();
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [looping, setLooping] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loadingPoster, setLoadingPoster] = useState(false);

  const [playList] = useState(data);
  const [selectedSong, setSelectedSong] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
  }

  const toggleMute = () => {
    setMuted(!muted);
  };

  const handlePlay = () => {
    setPaused(!paused);
    paused ? refAudio.current.play() : refAudio.current.pause();
  };

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

  useEffect(() => {
    setLoadingPoster(true);

    if (selectedSong !== null) {
      const { path } = playList[selectedSong];
      refAudio.current.src = `${path}.mp3`;
      refAudio.current.load();
      if (!paused) {
        refAudio.current.play();
      }
    }
  }, [selectedSong, paused, playList]);

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

  const prevSong = () => {
    setPaused(false);
    setSelectedSong((prevSong) => {
      let newSong = prevSong - 1;
      if (newSong < 0) {
        newSong = playList.length - 1;
      }
      return newSong;
    });
  };

  const nextSong = useCallback(() => {
    setSelectedSong((prevSong) => {
      let newSong = prevSong + 1;
      if (newSong > playList.length - 1) {
        newSong = 0;
      }
      return newSong;
    });
    setPaused(false);
  }, [playList]);

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
    setLooping(!looping);
    refAudio.current.loop = !looping;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const playSelectedSong = (index) => {
    setSelectedSong(index);
    setPaused(false);
  };

  return (
    <div className="music-player">
      <audio
        className="audio"
        ref={refAudio}
        loop={looping}
        muted={muted}
      />

        

      <img
        className="poster"
        src={selectedSong !== null ? `${playList[selectedSong].poster}.jpeg` : ''}
        alt="poster"
        onLoad={() => setLoadingPoster(false)}
      />
      {loadingPoster && <p className="loading-poster"></p>}
      <div>
        <p className="song-name">{selectedSong !== null ? playList[selectedSong].songName : ''}</p>
        <p className="singer">{selectedSong !== null ? playList[selectedSong].singer : ''}</p>
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

        <div onClick={handlePlay} className={paused ? "box-playPause2" : "box-playPause"}>
          {paused ? <i className="fas fa-play icon-playPause"></i> : <i className="fas fa-pause icon-playPause2"></i>}
        </div>

        <div onClick={nextSong} className="container-btnPrevNext">
          <i className="fas fa-forward icon-prevNext next"></i>
        </div>
      </div>
      <div className="box-loopEndMuted">
        <div onClick={toggleLoop} className={looping ? "icon-loopColor" : "icon-loop"}>
          <ion-icon name="repeat-outline"></ion-icon>
        </div>
        <div className="btn-show_playlist" onClick={togglePlaylist}>
            {showPlaylist ? <ion-icon name="chevron-down-outline"></ion-icon> : <ion-icon name="chevron-up-outline"></ion-icon>}
        </div>
        <div onClick={toggleMute} className={muted ? "icon-loopColor" : "icon-loop"}>
          {muted ? <ion-icon name="volume-mute-outline"></ion-icon> : <ion-icon name="volume-high-outline"></ion-icon>}
        </div>
      </div>

      <div className={ showPlaylist ? "container_playlist" :  "container_playlist2"}>
      <div className="btn-show_playlist btn-show_playlist2" onClick={togglePlaylist}>
            {showPlaylist ? <ion-icon name="chevron-down-outline"></ion-icon> : <ion-icon name="chevron-up-outline"></ion-icon>}
        </div>
      <Playlist playList={playList} onSongClick={playSelectedSong} />

      </div>
    </div>
  );
}

export default Player;
