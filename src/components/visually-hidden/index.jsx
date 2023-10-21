//@ts-check
import React from 'react';

/**
 * @type {React.CSSProperties}
 */
const visuallyHiddenStyles = {
  width: 1,
  margin: 0,
  border: 0,
  height: 1,
  padding: 0,
  overflow: "hidden",
  whiteSpace: "nowrap",
  position: "absolute",
  pointerEvents: "none",
  clipPath: "inset(50%)",
  clip: "rect(1px 1px 1px 1px)",
  // @ts-ignore
  clip: "rect(1px, 1px, 1px, 1px)",
};

/**
 * @param {React.PropsWithChildren} Props
 */
const VisuallyHidden = ({ children }) => {
  return (
    <div style={visuallyHiddenStyles}>
      {children}
    </div>
  );
};

export default VisuallyHidden;