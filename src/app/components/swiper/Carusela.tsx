import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './stylesCarusela.css';

// import required modules
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import useDay from "@/app/store/currentDayStore";
import ShowGalery from "./ShowGalery";
import Outfit from "../user/Outfit";


const Carusela: React.FC<{ setChanged: (c: boolean) => void }> = ({ setChanged }) => {
    const { allLooks } = useDay();
    return (
        <div>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                pagination={{ clickable: true, }}
                modules={[EffectCoverflow, Pagination, Navigation]}
            >
                {allLooks.map((look) => (
                    <SwiperSlide key={look?._id || look.id}>
                        <Outfit look={look} setChanged={setChanged} />
                    </SwiperSlide>

                ))}
                <SwiperSlide>
                    <ShowGalery setChanged={setChanged} />
                </SwiperSlide>
            </Swiper>
        </div>
    )

}
export default Carusela

