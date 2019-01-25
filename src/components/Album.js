import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
     super(props);

     const album = albumData.find( album => {
       return album.slug === this.props.match.params.slug
     });

     this.state = {
       album: album,
       currentSong: album.songs[0],
       currentTime: 0,
       duration: album.songs[0].duration,
       volume: 0.5,
       isPlaying: false,
       isHovered: false
     };

     this.audioElement = document.createElement('audio');
     this.audioElement.src = album.songs[0].audioSrc;
   }

   componentDidMount() {
     this.eventListeners = {
       timeupdate: e => {
         this.setState({ currentTime: this.audioElement.currentTime });
       },
       durationchange: e => {
         this.setState({ duration: this.audioElement.duration });
       }
     };
     this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
   }

   componentWillUnmount() {
     this.audioElement.src = null;
     this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
   }


   play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

   pause() {
     this.audioElement.pause();
     this.setState({ isPlaying: false });
   }

   setSong(song) {
     this.audioElement.src = song.audioSrc;
     this.setState({ currentSong: song });
   }

   handleSongClick(song) {
     const isSameSong = this.state.currentSong === song;
     if (this.state.isPlaying && isSameSong) {
       this.pause();
     } else {
       if (!isSameSong) { this.setSong(song); }
       this.play();
     }
   }

   handlePrevClick() {
      const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.max(0, currentIndex - 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
    }

    handleNextClick() {
      const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const last = this.state.album.songs.length - 1;
      const newIndex = Math.min(last, currentIndex + 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
    }

    handleTimeChange(e) {
     const newTime = this.audioElement.duration * e.target.value;
     this.audioElement.currentTime = newTime;
     this.setState({ currentTime: newTime });
   }

   handleVolumeChange(e) {
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({ volume: newVolume });
  }

  formatTime(seconds){
    const rounded = Math.floor(seconds);
    const minutes = Math.floor(rounded/60);
    const sec = rounded % 60;
    let time = minutes + ":";
    if(seconds < 10){
       time += "0" ;
    }
    else {
      time += sec;
    }
    return time;
  }

   render() {
     return (
       <section className="album">
         <section id="album-info">
           <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
           <div className="album-details">
             <h1 id="album-title">{this.state.album.title}</h1>
             <h2 className="artist">{this.state.album.artist}</h2>
             <div id="release-info">{this.state.album.releaseInfo}</div>
           </div>
         </section>
         <table id="song-list">
           <colgroup>
             <col id="song-number-column" />
             <col id="song-title-column" />
             <col id="song-duration-column" />
           </colgroup>
           <tbody>
           {
           this.state.album.songs.map( (song,index) =>
           <tr className="song" key={index} onClick={() => this.handleSongClick(song)}
           onMouseEnter={() => this.setState({isHovered: index+1})}
           onMouseLeave={() => this.setState({isHovered: false})} >
             <td className="song-actions">
               <button id="song-action-btns">
               { (this.state.currentSong.title === song.title) ?
                 <span className={this.state.isPlaying ? "ion-pause" : "ion-play"}></span>
                 :
                 (this.state.isHovered === index+1) ?
                 <span className="ion-play"></span>
                 :
                 <span className="song-number">{index+1}</span>
                }
                </button>
               </td>
               <td className="song-title">{song.title}</td>
               <td className="song-duration">{this.formatTime(song.duration)}</td>
           </tr>
         )
         }
           </tbody>
         </table>
         <PlayerBar
           isPlaying={this.state.isPlaying}
           currentSong={this.state.currentSong}
           currentTime={this.audioElement.currentTime}
           duration={this.audioElement.duration}
           volume={this.audioElement.volume}
           handleSongClick={() => this.handleSongClick(this.state.currentSong)}
           handlePrevClick={() => this.handlePrevClick()}
           handleNextClick={() => this.handleNextClick()}
           handleTimeChange={(e) => this.handleTimeChange(e)}
           handleVolumeChange={(e) => this.handleVolumeChange(e)}
         />
       </section>
     );
   }
 }

export default Album;
