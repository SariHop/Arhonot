'use client';

import { Calendar, CalendarProps } from 'antd';
import React from 'react';
import type { Dayjs } from 'dayjs';
// import dayjs from 'dayjs';

const Page: React.FC = () => {
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  const dateCellRender = (date: Dayjs) => {
    // בדוק אם התאריך שייך לחודש הנוכחי
    const isCurrentMonth = date.month() === new Date().getMonth();
    return isCurrentMonth ? null : <div style={{ visibility: 'hidden' }}>.</div>;
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <Calendar onPanelChange={onPanelChange} cellRender={dateCellRender} />
    </div>
  );
  // const onSelect = (date: Dayjs) => {
  //   console.log('Selected Date:', date.format('YYYY-MM-DD'));
  // };

  // פונקציה המגדירה את תצוגת הלוח שנה
  // const fullScreenChange = (status: string) => {
  //   console.log('Fullscreen status:', status);
  // };

  // // התאמה אישית של תצוגת התא
  // const dateCellRender = (date: Dayjs) => {
  //   return null; // מחזיר null כדי לא להציג תוכן נוסף בתאים
  // };

  // התאמה אישית של כותרת החודש
  // const monthCellRender = (date: Dayjs) => {
  //   return null;
  // };

  // return (
  //   <div className="calendar-container h-screen p-4">
  //     <Calendar 
  //       onSelect={onSelect}
  //       fullscreen={false}
  //       // onFullscreenChange={fullScreenChange}
  //       cellRender={dateCellRender}
  //       // monthCellRender={monthCellRender}
  //       defaultValue={dayjs()}
  //       validRange={[
  //         dayjs().startOf('month'),
  //         dayjs().endOf('month')
  //       ]}
  //       headerRender={({ value, type, onChange, onTypeChange }) => {
  //         const current = value.format('MMMM YYYY');
  //         return (
  //           <div className="text-center text-xl font-bold py-4">
  //             {current}
  //           </div>
  //         );
  //       }}
  //       mode="month"
  //     />
  //   </div>
  // );
};


export default Page;
