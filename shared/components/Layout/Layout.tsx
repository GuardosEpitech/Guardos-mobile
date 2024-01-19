import React from "react";
import { Container } from "@mui/material";

import styles from "./Layout.module.scss";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = (props: ILayoutProps) => {
  return (
    <div className={styles.OuterColor}>
      <Container maxWidth={"lg"}>
        <div className={styles.InnerColor}>
          {props.children}
        </div>
      </Container>
    </div>
  )
}

export default Layout;
