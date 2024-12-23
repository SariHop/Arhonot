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

const drawerBleeding = 85

const Puller = styled('div')(() => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

export default function SwipeableEdgeDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div className='h-full'>
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(90% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Button onClick={toggleDrawer(true)}>
          לחץ כאן כדי לפתוח את הגלריה ולהוסיף פריטים ללוק
        </Button>
      </Box>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
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
              backgroundColor: "#f3f4f6",
              cursor: 'pointer',

            }}
            className='shadow-inner'
            onClick={toggleDrawer(false)}
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

        <div style={{ padding: 2, paddingTop: 0, overflow: 'auto' }} className='bg-white'>
          <Gallery viewMode={"createOtfit"} />
        </div>

      </SwipeableDrawer>
    </div>
  );
}
