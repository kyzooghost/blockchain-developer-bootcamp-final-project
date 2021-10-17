import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import Jazzicon from "@metamask/jazzicon";

const StyledIdenticon = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  background-color: black;
`;

export default function Identicon( {account} ) {
  const ref = useRef(null);

  // useEffect hook to update the Jazzicon when account changes
  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)));
    }
  }, [account]);
  
  // useRef hook to create attach our created HTML element to a HTML element already on the page
  return <StyledIdenticon ref={ref} />
}