import * as React from 'react';
import { Global } from '@emotion/react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Gallery from '../galery/Galery';
import useDay from '../../store/currentDayStore';
import { Plus } from 'lucide-react';


export default function SwipeableEdgeDrawer({ setChanged = () => { } }: { setChanged?: (b: boolean) => void }) {
  const { openGalery, toggleDrawer, selectedDate } = useDay();
  // const DAYS_IN_HEBREW = [
  //   "ראשון",
  //   "שני",
  //   "שלישי",
  //   "רביעי",
  //   "חמישי",
  //   "שישי",
  //   "שבת"
  // ];

  const formatDate = (date: Date | null) => {

    if (!date) return "?"

    const today = new Date();
    if (
        today.getDate() === date.getDate() &&
        today.getMonth() === date.getMonth() &&
        today.getFullYear() === date.getFullYear()
    ) {
        return " להיום ";
    }

    const daysOfWeek = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "שבת"];

    const day = date.getDate();
    const month = date.getMonth() + 1;

    return ` ליום ${daysOfWeek[date.getDay()]} ${day}.${month < 10 ? `0${month}` : month}`;
  };

  return (
    <div className="h-full ">
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: '95%',
            overflow: 'visible',
          },
        }}
      />

      {/* Add Look Button */}
      <div
        className="h-full w-full  bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-100 
                   hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 cursor-pointer
                   flex flex-col items-center justify-center gap-3 p-4 shadow-sm hover:shadow-md"
        onClick={() => toggleDrawer(true)}
      >
        <div className="rounded-full bg-emerald-400 p-3 text-white shadow-md">
          <Plus size={37} strokeWidth={2.5} />
        </div>
        <span className="text-emerald-700 font-medium text-lg text-center px-3">
           בחר לוק 
          {formatDate(selectedDate)}
        </span>
      </div>

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
          {/* Drawer Handle */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>

          {/* Close Button */}
          <button
            className="w-full mb-4 px-4 py-2 flex items-center justify-center gap-2
                       bg-emerald-100 text-emerald-700 hover:bg-emerald-200 
                       rounded-lg transition-colors duration-200"
            onClick={() => toggleDrawer(false)}
          >
            סגור
          </button>

          {/* Gallery */}
          <Gallery viewMode="selectForDay" setChanged={setChanged} />
        </div>
      </SwipeableDrawer>
    </div>
  );
}