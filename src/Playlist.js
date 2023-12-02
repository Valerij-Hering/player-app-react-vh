// Playlist.js
import React from 'react';

const Playlist = ({ playList, onSongClick }) => {
  return (
    <div className="playlist ">
      {playList.map((element, index) => (
        <div
          key={index}
          className="playlist-song box_song"
          onClick={() => onSongClick(index)}
        >
          <img src={`${element.poster}.jpeg`} alt="poster" className='playList_poster'/>
          <div className='playList_box_songNameEndSinger'>
            <p className="playlist-song-name">{element.songName}</p>
            <p className="playlist-singer">{element.singer}</p>
          </div>
          <p className='playList_songTime'>{element.timeSong}</p>
        </div>
      ))}
    </div>
  );
};

export default Playlist;
