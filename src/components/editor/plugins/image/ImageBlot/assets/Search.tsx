import * as React from 'react';

const Search = props => (
    <svg
        width={26}
        height={26}
        xmlnsXlink="http://www.w3.org/1999/xlink"
        {...props}
    >
        <defs>
            <path id="a" d="M0 0h26v26H0z" />
            <rect
                id="b"
                x={19.785}
                y={15.996}
                width={1.337}
                height={3.566}
                rx={0.669}
            />
        </defs>
        <g transform="translate(2 3)" fill="none" fillRule="evenodd">
            <path
                d="M11.905 17.5a6.025 6.025 0 0 0 1.19 1.5H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3h15.429a3 3 0 0 1 3 3v7.372a6.02 6.02 0 0 0-1.5-1.116V3a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 3v5.23c.974.119 1.84.26 2.6.422.444.095.895.27 1.38.524.464.241.866.494 1.598.986.67.45.842.563 1.14.74.726.437 1.81.726 3.25.849l.361.03c-.239.456-.422.945-.538 1.46-1.624-.143-2.904-.488-3.845-1.052-.329-.197-.51-.316-1.204-.782-.687-.461-1.055-.693-1.455-.901a4.044 4.044 0 0 0-1.002-.387A27.613 27.613 0 0 0 1.5 9.74V16A1.5 1.5 0 0 0 3 17.5h8.905zm3.25-12.82a1.114 1.114 0 1 1 2.228 0 1.114 1.114 0 0 1-2.229 0z"
                fill="#979797"
                fillRule="nonzero"
            />
            <circle
                stroke="#979797"
                strokeWidth={1.5}
                cx={16.937}
                cy={14.263}
                r={3.566}
            />
            <g transform="scale(-1 1) rotate(45 0 -31.6)">
                <use fill="#D8D8D8" xlinkHref="#b" />
                <rect
                    stroke="#979797"
                    strokeWidth={1.5}
                    x={20.535}
                    y={16.746}
                    width={1}
                    height={2.066}
                    rx={0.5}
                />
            </g>
        </g>
    </svg>
);

export default Search;
