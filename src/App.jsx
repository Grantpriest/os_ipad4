
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "./App.css";
import albums from "./albums.json";

console.log("Album count:", albums.length);

function App() {
  const audioRef = useRef(null);
  const swiperRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(formatTime(audio.currentTime));
        setDuration(formatTime(audio.duration));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      swiperRef.current?.autoplay.start();
      setCurrentTrack(null);
      setProgress(0);
      setCurrentTime("00:00");
      setDuration("00:00");
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

const handleClick = (index, album) => {
  swiperRef.current?.autoplay.stop();
  swiperRef.current?.slideToLoop(index, 600);
  audioRef.current.pause();                    // ⬅ stop current playback
  audioRef.current.currentTime = 0;            // ⬅ reset playback position
  setIsPlaying(true);
  setCurrentTrack(index);
  audioRef.current.src = `${import.meta.env.BASE_URL}audio/${album.filename}`;
  audioRef.current.play();                     // ⬅ start new track
};

  return (
    <div className="app">
      <div className="carousel-container">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[EffectCoverflow, Autoplay]}
          effect="coverflow"
          slidesPerView={4}
          centeredSlides={true}
          loop={true}
          speed={4300}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          loopedSlides={albums.length}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 300,
            scale: 0.8,
            modifier: 1,
            slideShadows: false,
          }}
          grabCursor={true}
          className="swiper-container"
        >
          {albums.map((album, index) => (
  <SwiperSlide key={index}>
    <div className={`album-slide ${currentTrack === index ? "selected" : ""}`}>
      <img
                  src={`${import.meta.env.BASE_URL}images/${album.image}`}
        alt={album.title}
        onClick={() => handleClick(index, album)}
      />
    </div>
  </SwiperSlide>
))}

        </Swiper>
      </div>

      <div className="track-info-container">
        {currentTrack !== null && (
          <>

            
            <div className="track-title">{albums[currentTrack].track}</div>
            <div className="track-album">{albums[currentTrack].title}</div>
            <div className="track-artist">{albums[currentTrack].artist}</div>
                      <div className="track-timer">
              <span className="timer">{currentTime}</span>
              <div className="track-progress">
                <div className="progress-bar" style={{ width: progress + "%" }}></div>
              </div>
              <span className="timer">{duration}</span>
          </div>
          </>
        )}
      </div>

      <audio ref={audioRef} />
    </div>
  );
}

export default App;
