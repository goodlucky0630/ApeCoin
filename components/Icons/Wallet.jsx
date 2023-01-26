export const Wallet = (props) => {
  const { fill, ...rest } = props;
  return (
    <svg
      width={90}
      height={81}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect
        width={90}
        height={80.323}
        rx={6}
        fill={fill}
        style={{ transition: "fill .25s ease" }}
      />
      <path
        d="M63.573 44.314h-7.59a5.05 5.05 0 0 1-5.048-5.046 5.048 5.048 0 0 1 5.047-5.046h7.591"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M56.841 39.153h-.584"
        stroke="#0CE466"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        clipRule="evenodd"
        d="M37.527 22.947h16.206c5.434 0 9.84 4.406 9.84 9.84v13.457c0 5.434-4.406 9.839-9.84 9.839H37.527c-5.434 0-9.84-4.405-9.84-9.84V32.788c0-5.434 4.406-9.84 9.84-9.84Z"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity={0.5}
        d="M36.192 31.456h10.123"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
