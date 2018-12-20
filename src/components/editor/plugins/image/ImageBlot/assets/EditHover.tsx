import * as React from 'react';

const EditHover = props => (
    <svg width={26} height={26} {...props}>
        <defs>
            <path id="a" d="M0 0h26v26H0z" />
        </defs>
        <g transform="translate(3 4)" fill="none" fillRule="evenodd">
            <path
                d="M19 8.327V16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10.162"
                stroke="#F85959"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect
                fill="#F85959"
                transform="rotate(45 13.442 6.442)"
                x={12.692}
                y={-1.918}
                width={1.5}
                height={16.72}
                rx={0.75}
            />
        </g>
    </svg>
);

export default EditHover;
