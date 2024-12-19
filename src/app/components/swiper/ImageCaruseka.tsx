"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import IOutfit from "@/app/types/IOutfit";

export default function ImageCaruseka({ looks }: { looks: IOutfit[] }) {
    const [positions, setPositions] = useState<string[]>([]);
    const [sizeConfig, setSizeConfig] = useState<{ large: string; small: string }>({
        large: "15vmin",
        small: "25vmin",
    });
    const [cemterSize, setCenterSize] = useState<"50vmin" | "30vmin">();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [dragging, setDragging] = useState<boolean>(false);
    const [startX, setStartX] = useState<number>(0);
    const [currentX, setCurrentX] = useState<number>(0);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const updatePositions = () => {
        if (window.innerWidth >= 600) {
            // מסכים גדולים
            setPositions([
                "0%",
                "-10%",
                looks.length > 3 ? "-20%" : "10%",
                looks.length > 4 ? "20%" : "10%",
                "10%",
            ]);
            setSizeConfig({ large: "30vmin", small: "40vmin" });
            setCenterSize("50vmin");
        } else {
            // מסכים קטנים
            setPositions([
                "0%",
                "-15%",
                looks.length > 3 ? "-30%" : "15%",
                looks.length > 4 ? "30%" : "15%",
                "15%",
            ]);
            setSizeConfig({ large: "15vmin", small: "25vmin" });
            setCenterSize("30vmin");
        }
    };

    useEffect(() => {
        updatePositions();
        window.addEventListener("resize", updatePositions);
        return () => window.removeEventListener("resize", updatePositions);
    }, []);

    const prevSlide = (): void => {
        // setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + looks.length) % looks.length);
    };

    const nextSlide = (): void => {
        // setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % looks.length);
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
        <div className="relative w-full mx-auto" >
            <div
                className="relative mx-12 group hover:-translate-y-2" style={{ height: cemterSize }}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrag={handleDragMove}
                draggable
            >
                {/* Display the selected image in a circle */}
                {looks[currentIndex] && (
                    < div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                        style={{
                            clipPath: "circle(50% at 50% 50%)", // Ensure it's fully circular
                            transition: "transform 0.5s ease-in-out", // Smooth transition
                            zIndex: 10, // Bring selected image to the front
                            width: cemterSize, // Set the width relative to the minimum of viewport width and height (vmin)
                            height: cemterSize, // Set the height relative to the minimum of viewport width and height (vmin)
                        }
                        }
                    >
                        <Image
                            src={looks[currentIndex]?.img || "https://hahacanvas.co.il/wp-content/uploads/2021/11/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA-%D7%99%D7%A4%D7%95%D7%AA-%D7%9C%D7%94%D7%93%D7%A4%D7%A1%D7%94-12.jpg"}
                            alt={`Slider Image ${currentIndex + 1}`}
                            fill // גורם לתמונה למלא את הקונטיינר
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // שיפור ביצועים לפי גודל המסך
                            style={{ objectFit: "cover" }} // מחליף את objectFit
                            className="rounded-full cursor-pointer"
                        />
                    </div>)
                }
                {
                    looks.map((look, index) => {
                        const positionIndex = (index + looks.length + 1 - currentIndex) % looks.length; // מחשב את מיקום התמונה ביחס לאינדקס הנוכחי
                        const zIndex = positionIndex == 4 || positionIndex == 1 ? 2 : 1;
                        const size =
                            window.innerWidth >= 600 // בדיקה אם המסך גדול
                                ? positions[positionIndex] === "-10%" || positions[positionIndex] === "10%"
                                    ? sizeConfig.small
                                    : sizeConfig.large
                                : positions[positionIndex] === "-15%" || positions[positionIndex] === "15%"
                                    ? sizeConfig.small
                                    : sizeConfig.large;
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
                                    }}
                                    onClick={() => console.log("index:", index)} // מאזין לאירוע onClick
                                >
                                    <Image
                                        src={look.img}
                                        alt={`Slider Image ${index + 1}`}
                                        fill // גורם לתמונה למלא את הקונטיינר
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // שיפור ביצועים לפי גודל המסך
                                        style={{ objectFit: "cover" }} // מחליף את objectFit
                                        className="rounded-full cursor-pointer"
                                    />
                                </div>
                            )
                        );
                    })}
            </div>
            {/* Previous and next buttons */}
            <button
                className="translate-y-1/2 absolute left-0 top-1/2 transform h-[100px] rounded-xl hover:bg-[#1a222f] mx-1 -mt-[10px] -translate-y-1/2 bg-[#111927] text-white p-2 group"
                onClick={prevSlide}
            >
                <FaCaretLeft className="text-gray-400 group-hover:text-white" />
            </button>
            < button
                className=" translate-y-1/2 absolute right-0 top-1/2 transform h-[100px] rounded-xl hover:bg-[#1a222f] mx-1 -mt-[10px] -translate-y-1/2 bg-[#111927] text-white p-2 group"
                onClick={nextSlide}
            >
                <FaCaretRight className="text-gray-400 group-hover:text-white" />
            </button>

            {/* Indicator dots */}
            <div className="flex justify-center mt-4" >
                {
                    looks.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 w-10 mx-1 ${index === currentIndex
                                ? "bg-[#beff46] rounded-xl"
                                : "bg-gray-300 rounded-xl"
                                } transition-all duration-500 ease-in-out`}
                        > </div>
                    ))}
            </div>
        </div >
    );
}
