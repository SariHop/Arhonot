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
      <Box sx={{ textAlign: 'center', pt: 1 }}>
        <Button sx={{ width: "100%", backgroundColor: "#d0f19f", color: "black" }} onClick={toggleDrawer(true)} >פתח גלריה</Button>
      </Box>
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

          <Box sx={{ textAlign: 'center', pt: 3 }}>
            <Button sx={{ width: "100%", backgroundColor: "#d0f19f", color: "black" }} onClick={toggleDrawer(false)} >הסתר גלריה</Button>
          </Box>
          <Gallery isForOutfit={true} />
        </div>
      </SwipeableDrawer>
    </div>
  );
}
