
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "./App.css";
import albums from "./albums.json";

function App() {
  const audioRef = useRef(null);
  const swiperRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [progress, setProgress] = useState(0);


  useEffect(() => {
  const audio = audioRef.current;

  const updateProgress = () => {
    if (audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(percent);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    swiperRef.current?.autoplay.start();
    setCurrentTrack(null);
    setProgress(0);
  };

  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("ended", handleEnded);
  return () => {
    audio.removeEventListener("timeupdate", updateProgress);
    audio.removeEventListener("ended", handleEnded);
  };
}, []);


  const handleClick = (index, album) => {
    swiperRef.current?.slideToLoop(index, 600); // center the slide
    setIsPlaying(true);
    swiperRef.current?.autoplay.stop();
    audioRef.current.src = `/audio/${album.filename}`;
    audioRef.current.play();
    setCurrentTrack(index);
  };

  return (
    <div className="app">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[EffectCoverflow, Autoplay]}
        effect="coverflow"
        slidesPerView={3}
        centeredSlides={true}
        loop={true}
        speed={4300}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 60,
          stretch: 0,
          depth: 200,
          scale: .8,
          modifier: 1,
          slideShadows: false,
        }}
        grabCursor={true}
        allowTouchMove={true}
        className="swiper-container"
      >
        {albums.map((album, index) => (
          <SwiperSlide key={index}>
                <div className="album-slide">
                  <img src={`/images/${album.image}`} alt={album.title} onClick={() => handleClick(index, album)} />
                  <div className="track-info">
                    <div className="track-title">{album.title}</div>
                    <div className="track-artist">{album.artist}</div>
                    <div className="track-progress">
                      <div
                        className="progress-bar"
                        style={{ width: currentTrack === index ? progress + "%" : "0%" }}
                      ></div>
                    </div>
                  </div>
                </div>
          </SwiperSlide>

        ))}
      </Swiper>
      <audio ref={audioRef} />
    </div>
  );
}

export default App;
