"use client"

import * as React from "react"
import { Button } from "./button";

type ButtonPrimaryProps = {
    text: string;
    onclick?: () => void;
    icon?: React.ReactNode;
 }& React.ComponentPropsWithoutRef<"button">

// export default function ButtonPrimary({text, onclick, icon}: ButtonPrimaryProps) {
//     return (
//         <Button
//             className="bg-blue-300 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-400 mt-4"
//             onClick={onclick}
//         >
//             {icon && <span className="icon">{icon}</span>}
//             {text}
//         </Button>
//     );
// }

const ButtonPrimary = React.forwardRef<HTMLButtonElement, ButtonPrimaryProps>(
  ({ text, icon, onclick, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className="bg-blue-300 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-400 mt-4"
        {...props}
      >
        {icon && <span className="icon">{icon}</span>}
        {text}
      </Button>
    )
  }
)

ButtonPrimary.displayName = "ButtonPrimary"

export default ButtonPrimary
