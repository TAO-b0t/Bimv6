import React, { useState, useEffect } from 'react';

export default function SidebarmenuDoc({
    setactiveB,
    latestFile,
    onFileClick,
    activeB,
    templateFile,
    onCreateTemplate,
}) {
    const handleClick = (buttonId) => {
        setactiveB(buttonId);
    };

    const iconNow = (
        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.12151 2.80168C4.96801 -0.040802 9.59527 -0.0105771 12.4592 2.85334C15.3243 5.71848 15.3533 10.3485 12.5072 13.1947C9.6609 16.0408 5.03095 16.0118 2.1658 13.1467C0.467917 11.4488 -0.23322 9.13242 0.0678521 6.9359C0.11004 6.6281 0.39375 6.41283 0.701527 6.45502C1.00931 6.4972 1.22461 6.78087 1.18243 7.08867C0.92745 8.9489 1.52086 10.9107 2.9613 12.3512C5.39466 14.7846 9.3123 14.7984 11.7116 12.3991C14.1109 9.9998 14.097 6.08219 11.6636 3.64883C9.23152 1.21671 5.31667 1.20154 2.91701 3.59718L3.47779 3.6C3.78844 3.60156 4.03901 3.85466 4.03745 4.16532C4.03589 4.47598 3.78279 4.72654 3.47213 4.72498L1.56297 4.71539C1.25452 4.71384 1.00486 4.46417 1.0033 4.15573L0.993712 2.24656C0.992145 1.93591 1.24272 1.6828 1.55338 1.68124C1.86403 1.67968 2.11714 1.93025 2.1187 2.24091L2.12151 2.80168ZM7.31242 4.43744C7.62307 4.43744 7.87492 4.68928 7.87492 4.99994V7.76697L9.58515 9.4772C9.80482 9.69687 9.80482 10.0531 9.58515 10.2726C9.36547 10.4923 9.0093 10.4923 8.7897 10.2726L6.74992 8.23295V4.99994C6.74992 4.68928 7.00177 4.43744 7.31242 4.43744Z"
                fill="#FEA003"
            />
        </svg>
    );

    const iconDoc = (
        <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.375 12.75H11.875M7.375 9.75H11.875M7.375 6.75H8.125M10.375 2.25H6.775C5.93492 2.25 5.51488 2.25 5.19402 2.41349C4.91177 2.5573 4.6823 2.78677 4.53849 3.06902C4.375 3.38988 4.375 3.80992 4.375 4.65V13.35C4.375 14.1901 4.375 14.6102 4.53849 14.931C4.6823 15.2132 4.91177 15.4427 5.19402 15.5865C5.51488 15.75 5.93492 15.75 6.775 15.75H12.475C13.3151 15.75 13.7352 15.75 14.056 15.5865C14.3382 15.4427 14.5677 15.2132 14.7115 14.931C14.875 14.6102 14.875 14.1901 14.875 13.35V6.75M10.375 2.25L14.875 6.75M10.375 2.25V5.55C10.375 5.97004 10.375 6.18006 10.4568 6.34049C10.5287 6.48161 10.6433 6.59635 10.7845 6.66826C10.9449 6.75 11.1549 6.75 11.575 6.75H14.875"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );

    // Updated function to remove 'Work/' or 'Template/' prefix and ensure non-empty name
    const formatFileName = (fileName) => {
        const formattedName = fileName.replace(/^(Work\/|Template\/)/, ''); // Remove prefix
        return formattedName.trim() === '' ? null : formattedName; // Return null if empty
    };

    // Split files based on the folder (Work/ or Template/)
    const filterFilesByFolder = (files) => {
        const workFiles = files.filter((file) => file.name.startsWith('Work/'));
        const templateFiles = files.filter((file) => file.name.startsWith('Template/'));

        return { workFiles, templateFiles };
    };

    const { workFiles, templateFiles } = filterFilesByFolder(latestFile);

    return (
        <div className="w-[350px] rounded-r-md bg-[#091F23] text-white items-start h-[94.6vh] overflow-auto border border-[#0B3F48] mt-[-0.5rem]">
            <div className="flex items-center gap-2 justify-center text-center w-full">
                <button
                    onClick={() => handleClick('template')}
                    className={`p-2 ${activeB === 'template' ? 'border-b-[3px] border-b-[#FEA003]' : 'bg-transparent'}`}
                >
                    เทมเพลตเอกสาร
                </button>
                <button
                    onClick={() => handleClick('myDocument')}
                    className={`p-2 ${activeB === 'myDocument' ? 'border-b-[3px] border-b-[#FEA003]' : 'bg-transparent'}`}
                >
                    สร้างเอกสารของฉัน
                </button>
            </div>

            {/* Latest Files Section (Work Folder) */}
            <div className="px-2 py-2 grid gap-2">
                <p>ล่าสุด</p>
                <ul className="pl-2">
                    {workFiles.length > 0 ? (
                        workFiles.map((file) => {
                            const formattedName = formatFileName(file.name); // Format file name
                            return formattedName ? (
                                <li key={file.name}>
                                    <button
                                        onClick={() => onFileClick(file)}
                                        className="flex gap-1 items-center text-sm font-normal"
                                    >
                                        {iconNow} {iconDoc} {formattedName}
                                    </button>
                                </li>
                            ) : null;
                        })
                    ) : (
                        <li className="text-center">ยังไม่มีไฟล์</li>
                    )}
                </ul>
            </div>

            {/* Template Files Section (Template Folder) */}
            <div className="px-2 py-2 grid gap-2">
                <p>เทมเพลตเอกสาร</p>
                <ul className="pl-2">
                    {templateFiles.length > 0 ? (
                        templateFiles.map((file) => {
                            const formattedName = formatFileName(file.name); // Format file name
                            return formattedName ? (

                                <li key={file.name}>
                                    <button
                                        onClick={() => onFileClick(file)}
                                        className="flex gap-1 items-center text-sm font-normal"
                                    >
                                        {iconNow} {iconDoc} {formattedName}
                                    </button>
                                </li>

                            ) : null;
                        })
                    ) : (
                        <li className="text-center">ยังไม่มีไฟล์</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
