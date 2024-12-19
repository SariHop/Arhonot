import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';

const SwiperComponent: React.FC = () => {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      loop={true}
    >
      <SwiperSlide>
        <img src="https://via.placeholder.com/800x300" alt="Slide 1" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://via.placeholder.com/800x300" alt="Slide 2" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://via.placeholder.com/800x300" alt="Slide 3" />
      </SwiperSlide>
    </Swiper>
  );
};

export default SwiperComponent;
