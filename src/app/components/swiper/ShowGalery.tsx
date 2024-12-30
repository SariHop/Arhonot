import * as React from 'react';
import { Global } from '@emotion/react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Gallery from '../galery/Galery';
import Image from "next/image";
import useDay from '../../store/currentDayStore'; // ייבוא ה-store

export default function SwipeableEdgeDrawer({setChanged = () => {}}:{setChanged?: (b:boolean)=>void}) {
  const { openGalery, toggleDrawer } = useDay();  // שימוש ב-store
  return (
    <div className="h-full my-1">
      {/* הגדרת סגנונות גלובליים */}
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: '95%', // הגדרת גובה ה-SwipeableDrawer
            overflow: 'visible',
          },
        }}
      />

      <div
        className="border border-gray-300 rounded-lg p-4 max-w-[200px] text-center cursor-pointer transition-all duration-300"
        onClick={() => toggleDrawer(true)}
      >
        <Image
          src="/pluss.jpg"
          alt="add look to date"
          width={200}
          height={200}
          className="w-full h-auto rounded-lg mb-4"
        />
        <p className="text-sm text-gray-700">הוספת לוק חדש</p>
      </div>

      {/* ה-SwipeableDrawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={openGalery}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <div className="my-3 h-full overflow-auto">
          {/* כפתור נסתר בגלריה */}
          <div className="w-8 h-1.5 bg-gray-400 rounded-lg absolute top-2 left-1/2 transform -translate-x-1/2 m-2 block sm:hidden"></div>

          {/* כפתור סגירה */}
          <div className="text-center pt-6">
            <button
              className="w-full bg-teal-100 text-black hover:bg-teal-200 p-2 rounded-md"
              onClick={() => {toggleDrawer(false)}}
            >
              ▼
            </button>
          </div>

          {/* הצגת גלריה */}
          <Gallery viewMode="selectForDay" setChanged={setChanged} />
        </div>
      </SwipeableDrawer>
    </div>
  );
}

