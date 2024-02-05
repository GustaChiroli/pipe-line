"use client"; 
import { Layout } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useRef } from 'react';





const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  width: "calc(100% - 8px)",
  maxWidth: "calc(100% - 8px)",
  height: "calc(100% - 8px)",
};
const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  maxWidth: "200",
  color: "#fff",
  backgroundColor: "#1677ff",
};
const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 120,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#4096ff",
};
const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#0958d9",
};
const footerStyle: React.CSSProperties = {

  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

export default function Home() {

  const constainerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const isClicked = useRef<boolean>(false);
  
  const coords = useRef<{
    startX: number,
    startY: number,
    lastX: number,
    lastY: number
  }>({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0
  })

  const spotCoords = useRef<{
    startX: number,
    endX: number,
    startY: number,
    endY: number,
  }>({
    startX: 0,
    endX: 0,
    startY: 0,
    endY: 0,
  })

  useEffect(() => {
    if (!boxRef.current || !constainerRef.current) return;

    const box = boxRef.current;
    const container = constainerRef.current;
    

    const getDivPosition = () => {
      if (spotRef.current) {
        const rect = spotRef.current.getBoundingClientRect();
        spotCoords.current.startX = rect.left;
        spotCoords.current.endX = rect.right;
        spotCoords.current.startY = rect.top;
        spotCoords.current.endY = rect.bottom;
        console.log('Posição inicial (x,y):', rect.left, rect.top);
        console.log('Posição final (x,y):', rect.right, rect.bottom)
      }
    };

    getDivPosition();

    window.addEventListener('resize', getDivPosition);
    

    const onMouseDown = (e: MouseEvent) => {
     
      isClicked.current = true;
      
      // Obtenha as coordenadas do container
      const containerRect = container.getBoundingClientRect();
    
      coords.current.startX = e.clientX ;
      coords.current.startY = e.clientY ;
    
      // Se o clique ocorrer dentro das coordenadas do spot, ajuste as coordenadas iniciais do box
      if (
        coords.current.startX >= spotCoords.current.startX &&
        coords.current.startX <= spotCoords.current.endX &&
        coords.current.startY >= spotCoords.current.startY &&
        coords.current.startY <= spotCoords.current.endY
      ) {
        coords.current.startX = spotCoords.current.startX;
        coords.current.startY = spotCoords.current.startY;
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      debugger;
      isClicked.current = false;
      coords.current.lastX = box.offsetLeft;
      coords.current.lastY = box.offsetTop;
      const containerRect = container.getBoundingClientRect();
      
      if (
        e.clientX >= spotCoords.current.startX &&
        e.clientX <= spotCoords.current.endX &&
        e.clientY >= spotCoords.current.startY &&
        e.clientY <= spotCoords.current.endY
      ) {
        box.style.top = `${containerRect.top +41}px`;
        box.style.left = `13px`;
        if (!spotRef.current) return;
        const spotRect = spotRef.current.getBoundingClientRect();
        box.style.width = `${spotRect.width - 9}px`; // 9px está relacionado a margin
        box.style.height = `${spotRect.height - 9}px`; // 9px está relacionado a margin
      }
      coords.current.lastX = box.offsetLeft;
      coords.current.lastY = box.offsetTop;
    }

    const onMouseMove = (e: MouseEvent) => {
      
      if (!isClicked.current) return;
    
      // Obtenha as coordenadas do container
      const containerRect = container.getBoundingClientRect();
    
      const nextX = e.clientX - coords.current.startX + coords.current.lastX;
      const nextY = e.clientY - coords.current.startY + coords.current.lastY;
    
      box.style.top = `${nextY}px`;
      box.style.left = `${nextX}px`;
    };

    box.addEventListener('mousedown', onMouseDown);
    box.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);

    const cleanup = () => {
      box.removeEventListener('mousedown', onMouseDown);
      box.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', getDivPosition);
    }

    return cleanup;
  }, [])

  return(
    <div className="App full-height-container">
      <Layout style={layoutStyle}>
        <Sider width="20%" style={siderStyle}>
          Sider
        </Sider>
        <Layout>
          <Header style={headerStyle}>Header</Header>
          <Content style={contentStyle}>
              <div ref={constainerRef} className="container">
                <div className="spot"></div>
                <div ref={boxRef} className="box"></div>
                <div ref={spotRef} className="spot"></div>
              </div>
          </Content>
          <Footer style={footerStyle}>Footer</Footer>
        </Layout>
      </Layout>
    </div>
  );
} 

