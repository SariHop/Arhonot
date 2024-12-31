import * as React from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Image from 'next/image'
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Gallery from '../galery/Galery';
import { Tooltip } from '@mui/material';
import useCanvasStore from "@/app/store/canvasStore";

const drawerBleeding = 85

const Puller = styled('div')(() => ({
  width: 30,
  height: 6,
  backgroundColor: grey[400],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

export default function SwipeableEdgeDrawer() {
  const {toggleOpenGallery, OpenGallery  } = useCanvasStore();

  return (
    <div className='h-full'>
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(95% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Button size="large" variant="outlined" className='text-lg' sx={{width: "100%", borderRadius:"0", fontWeight: 'bold', marginY:"5px" }} onClick={()=>{toggleOpenGallery(true)}}>
          לחץ כאן כדי לפתוח את הגלריה ולהוסיף פריטים ללבוש
        </Button>
      </Box>
      <SwipeableDrawer
        anchor="bottom"
        open={OpenGallery}
        onClose={()=>{toggleOpenGallery(false)}}
        onOpen={()=>{toggleOpenGallery(true)}}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}

      >
        <Tooltip title="הסתר גלריה" placement="top" >
          <div
            style={{
              // marginTop:'15px',
              position: 'absolute',
              top: -drawerBleeding,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: 'visible',
              right: 0,
              left: 0,
              cursor: 'pointer',

            }}
            className='shadow-inner bg-gradient-to-br from-green-200 to-blue-200'
            onClick={()=>{toggleOpenGallery(false)}}
          >
            <Puller />
            <div className="m-4 flex justify-center items-center">
              <Image
                src="/gallery.png"
                alt="Logo"
                width={100}
                height={120}
                className="p-3"
              />
            </div>

          </div>
        </Tooltip>

        <div style={{paddingBottom:'5%', overflow: 'auto' }} className='bg-white'>
          <Gallery viewMode={"createOtfit"} />
        </div>

      </SwipeableDrawer>
    </div>
  );
}
