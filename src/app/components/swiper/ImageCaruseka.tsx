"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

interface ImageData {
    src: string; // Accepts string (URL) for external images
}

const positions = [
    '0%',// אופציה 5: במרכז
    '-10%', // אופציה 2: שמאל קרוב
    '-20%', // אופציה 1: שמאל יותר רחוק
    '20%',  // אופציה 4: ימין יותר רחוק
    '10%',  // אופציה 3: ימין קרוב
];

const images: ImageData[] = [
    {
        src: "https://www.photo-art.co.il/wp-content/uploads/2015/09/BY1A4457.webp",
    },
    {
        src: "https://hahacanvas.co.il/wp-content/uploads/2021/11/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA-%D7%99%D7%A4%D7%95%D7%AA-%D7%9C%D7%94%D7%93%D7%A4%D7%A1%D7%94-20.jpg",
    },
    {
        src: "https://hahacanvas.co.il/wp-content/uploads/2021/11/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA-%D7%99%D7%A4%D7%95%D7%AA-%D7%9C%D7%94%D7%93%D7%A4%D7%A1%D7%94-12.jpg",
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiyBIgoU0MJxnogfyHtCBq2GG4dqDo4uFTb_F6NlIN74tK-bSkbH7h2vQ&s",
    },
    {
        src: "https://hahacanvas.co.il/wp-content/uploads/2021/11/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA-%D7%99%D7%A4%D7%95%D7%AA-%D7%9C%D7%94%D7%93%D7%A4%D7%A1%D7%94-12.jpg",
    },
];

export default function ImageCaruseka() {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [dragging, setDragging] = useState<boolean>(false);
    const [startX, setStartX] = useState<number>(0);
    const [currentX, setCurrentX] = useState<number>(0);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const prevSlide = (): void => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const nextSlide = (): void => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
        setDragging(true);
        setStartX(e.clientX);
    };

    const handleDragMove = (e: React.DragEvent<HTMLDivElement>): void => {
        if (dragging) {
            setCurrentX(e.clientX);
        }
    };

    const handleDragEnd = (): void => {
        if (dragging) {
            const distance = currentX - startX;
            if (distance > 100) {
                nextSlide();
            } else if (distance < -100) {
                prevSlide();
            }
            setDragging(false);
            setStartX(0);
            setCurrentX(0);
        }
    };

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                nextSlide();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [isHovered]);

    const handleMouseOver = (): void => {
        setIsHovered(true);
    };

    const handleMouseLeave = (): void => {
        setIsHovered(false);
    };

    return (
        <div className="relative w-full mx-auto pt-40" >
            <div
                className="relative h-[460px] mx-12 group hover:-translate-y-2"
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrag={handleDragMove}
                draggable
            >
                {/* Display the selected image in a circle */}
                < div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{
                        clipPath: "circle(50% at 50% 50%)", // Ensure it's fully circular
                        transition: "transform 0.5s ease-in-out", // Smooth transition
                        zIndex: 10, // Bring selected image to the front
                        width: "50vmin", // Set the width relative to the minimum of viewport width and height (vmin)
                        height: "50vmin", // Set the height relative to the minimum of viewport width and height (vmin)
                    }
                    }
                >
                    <Image
                        src={images[currentIndex].src}
                        alt={`Slider Image ${currentIndex + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full cursor-pointer"
                    />
                </div>
                {/* Display the other images in a circle, with them close together */}
                {
                    images.map((image, index) => {
                        const positionIndex = (index + positions.length - currentIndex) % positions.length; // מחשב את מיקום התמונה ביחס לאינדקס הנוכחי
                        const zIndex = positionIndex == 4 || positionIndex == 1 ? 2 : 1;
                        const size = positionIndex == 4 || positionIndex == 1 ? '40vmin' : '30vmin';
                        console.log(positionIndex, positionIndex in [4, 1, 3]);
                        return (
                            index !== currentIndex && (
                                <div
                                    key={index}
                                    className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                    style={{
                                        zIndex, // קובע zIndex לפי הקרבה למרכז
                                        width: size,
                                        height: size,
                                        clipPath: "circle(50% at 50% 50%)",
                                        filter: "blur(1px)",
                                        left: `calc(50% + ${positions[positionIndex]})`, // מחיל את המיקום בהתאם לרשימה
                                    }
                                    }
                                >
                                    <Image
                                        src={image.src}
                                        alt={`Slider Image ${index + 1}`}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-full cursor-pointer"
                                    />
                                </div>
                            )
                        );
                    })}

            </div>
            {/* Previous and next buttons */}
            <button
                className="absolute left-0 top-1/2 transform h-[459px] rounded-xl hover:bg-[#1a222f] mx-1 -mt-[10px] -translate-y-1/2 bg-[#111927] text-white p-2 group"
                onClick={prevSlide}
            >
                <FaCaretLeft  className="text-gray-400 group-hover:text-white" />
            </button>
            < button
                className="absolute right-0 top-1/2 transform h-[459px] rounded-xl hover:bg-[#1a222f] mx-1 -mt-[10px] -translate-y-1/2 bg-[#111927] text-white p-2 group"
                onClick={nextSlide}
            >
                <FaCaretRight className="text-gray-400 group-hover:text-white" />
            </button>

            {/* Indicator dots */}
            <div className="flex justify-center mt-4" >
                {
                    images.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 w-10 mx-1 ${index === currentIndex
                                ? "bg-[#beff46] rounded-xl"
                                : "bg-gray-300 rounded-xl"
                                } transition-all duration-500 ease-in-out`}
                        > </div>
                    ))}
            </div>
        </div>
    );
}
