export const Open = (props) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#open)">
      <path
        d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0Zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Zm0-15a2.993 2.993 0 0 0-1 5.816V16a1 1 0 0 0 2 0v-3.184A2.992 2.992 0 0 0 12 7Zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
        fill="#fff"
      />
    </g>
    <defs>
      <clipPath id="open">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
