'use client'
import { BellOutlined, CalendarOutlined, PlusOutlined, ProductOutlined, SkinOutlined, UserOutlined } from '@ant-design/icons'
import { Dropdown, MenuProps, message, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react'







const NavBar = () => {
  const router = useRouter();
  
  const onClick: MenuProps['onClick'] = ({ key }) => { 
    router.push(`/pages/${key==='1'? 'add-garment': 'add-outfit'}`);
    message.info(`Click on item ${key}`);
  };
 
  
  const items: MenuProps['items'] = [
    {
      label: <SkinOutlined />,
      key: '1',
    },
    {
      label: <><SkinOutlined /><PlusOutlined /></>,
      key: '2',
    },
  ];

  
  return (
    <div className="fixed bottom-0 left-0 w-full border-t-2 h-[10vh] flex justify-between items-center shadow-md pr-6 pl-6">
      <UserOutlined className="text-3xl hover:text-blue-600" onClick={()=> router.push('/pages/user-details')}/>
      <ProductOutlined className="text-3xl hover:text-blue-600" onClick={()=> router.push('/pages/gallery')}/>
      <Dropdown menu={{ items, onClick }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <div className="rounded-full mb-16 p-4 border-t-2 bg-white">
              <PlusOutlined className="text-4xl bg-blue-600 text-white p-2 rounded-full" />
            </div>
          </Space>
        </a>
      </Dropdown>
      <CalendarOutlined className="text-3xl hover:text-blue-600" onClick={()=> router.push('/pages/calender')}/>
      <BellOutlined className="text-3xl hover:text-blue-600" onClick={()=> router.push('/pages/alerts')}/>
    </div>
  )
}

export default NavBar