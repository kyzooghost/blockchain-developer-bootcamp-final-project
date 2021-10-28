import { Flex, chakra } from "@chakra-ui/react";

export default function Layout({ children } ) {
  return (
    <>
      <Layout_Flex >
        {children}
      </Layout_Flex>
    </>
  )
}

const Layout_Flex = chakra(Flex, {
  baseStyle: {
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center",
    flexGrow: "1",
    overflow: "scroll",
    
    _before:{
      content: `""`,
      display:"block",
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      opacity: "0.5",
      bgImage:"url('background.jpg')",
      bgRepeat: "no-repeat",
      bgPosition: "50% 0%",
      bgSize: "cover",
      zIndex: "-1"
  }
  },
});