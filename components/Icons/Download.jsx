import * as React from "react"

export const Download = (props) => (
  <svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#Download)" fill="#fff">
      <path d="M8.023 12.667a1.996 1.996 0 0 0 1.414-.586l2.613-2.614-.943-.94-2.422 2.422L8.668 0H7.335l.017 10.939L4.94 8.525l-.943.942 2.613 2.612a1.995 1.995 0 0 0 1.414.588Z" />
      <path d="M14.667 10.666v3.333a.667.667 0 0 1-.667.667H2a.666.666 0 0 1-.667-.667v-3.333H0v3.333a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3.333h-1.333Z" />
    </g>
    <defs>
      <clipPath id="Download">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)