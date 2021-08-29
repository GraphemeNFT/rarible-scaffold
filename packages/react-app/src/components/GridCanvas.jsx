
import React, { useState, useEffect, useRef } from "react";
/*import { Button, Input } from "antd";
import "../App.css";
import { newGrid, makeRng, renderLetter, crop } from "./Letters/grapheme";
*/
export default function GridCanvas ({ grid, canId, color1, color2 }) {
  const [viewText, setViewText] = useState(false);
  const [hack1, setHack1] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const split2bits = (bits) => [16 * 5 * (bits & 0b110000) >> 4, 16 * 5 * (bits & 0b1100) >> 2, 16 * 5 * (bits & 0b11)];
    const ary2rgba = (ary) => 'rgba(' + ary.join(',') + ', 1)';
    const fontSize = 10;

    let ctx = canvasRef.current.getContext('2d');
    //let ctx = canvasRef.current.getContext('2d' /* weird alias effect: , { alpha: false } */);
    console.log('-------------------------');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    //ctx.scale(0.5, 0.5);
    let gradient1 = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    console.log(ctx.font);
    ctx.font = `${fontSize}px/${fontSize}px P0T-NOoDLE`;
    console.log(ctx.font);
    if (!hack1) {
      setHack1(true);
      return;
    }
    gradient1.addColorStop(0, ary2rgba(split2bits(color1)));
    gradient1.addColorStop(1, ary2rgba(split2bits(color2)));
    ctx.strokeStyle = gradient1;
    console.log(grid);
    grid.forEach((row, idx) => {
      ctx.strokeText(row.join(''), 0, fontSize + idx * fontSize)
    });
  }, [hack1, grid]);

  console.log(canvasRef);
  const pixelWidth = 5;
  const canvasWidth = grid[0].length * pixelWidth; //1000;
  const canvasHeight = grid.length * 10; // 500;

  return (
    <div>
      <canvas ref={canvasRef} id={canId} width={canvasWidth} height={canvasHeight} style={{ border: '4px dotted black' }} ></canvas>
    </div>
  );

}
