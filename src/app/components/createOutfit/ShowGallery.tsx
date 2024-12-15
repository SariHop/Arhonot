import * as React from 'react';
import { Global } from '@emotion/react';
// import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Gallery from '../galery/Galery';


export default function SwipeableEdgeDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div className='height-full my-1'>
      {/* <CssBaseline /> */}
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `95%`,
            overflow: 'visible',
          },
        }}
      />
      <div className="text-center pt-3">
        <button
          className="w-full bg-mindaro text-black hover:bg-lime p-2" onClick={toggleDrawer(true)}
        >
          הצג גלריה
        </button>
      </div>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >

        <div className='my-3 height-full, overflow-auto'>
          <div className="w-8 h-1.5 bg-gray-400 rounded-lg absolute top-2 left-1/2 transform -translate-x-1/2 m-2 block sm:hidden"></div>

          <div className="text-center pt-6">
            <button
              className="w-full bg-mindaro text-black hover:bg-lime p-2"
              onClick={toggleDrawer(false)}
            >
              הסתר גלריה
            </button>
          </div>
          <Gallery isForOutfit={true} />
        </div>
      </SwipeableDrawer>
    </div>
  );
}
