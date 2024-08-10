// @ts-nocheck
import React, { useState } from 'react';

const ChevronIcon = ({expanded}) => {

    return (
        <div style={{ cursor: 'pointer' }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={expanded ? 'icon-chevron-up' : 'icon-chevron-down'}
                style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
            >
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </div>
    );
};

export default ChevronIcon;