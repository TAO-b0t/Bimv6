import React from 'react';
import SideBar from '../SideBar/SideBar';
import TopBar from '../TopBar/TopBar';

export default function LayoutTemplateElec({ children }) {
    return (
        <div className="inline-grid grid-cols-[16em,1fr] grid-rows-[4em,1.5em,1fr]  w-full text-white font-sans font-bold overflow-hidden">
            <SideBar />
            <TopBar />
            <div className='flex flex-col bg-blue-50 '>
                <div className="text-white flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
