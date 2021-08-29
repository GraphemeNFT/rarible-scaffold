
import { childContextTypes } from "qrcode.react";
import React, { useState, useEffect, useRef } from "react";
/*import { Button, Input } from "antd";
import "../App.css";
import { newGrid, makeRng, renderLetter, crop } from "./Letters/grapheme";
*/

// disable logging for this file
// const clog = console.log
const clog = () => { };

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
    ctx.filter = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50aXR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)";
    ctx.imageSmoothingEnabled = false

    //let ctx = canvasRef.current.getContext('2d' /* weird alias effect: , { alpha: false } */);
    clog('-------------------------');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    //ctx.scale(0.5, 0.5);
    let gradient1 = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    clog('f1', ctx.font);
    ctx.font = `${fontSize}px/${fontSize}px P0T-NOoDLE`;
    clog('f2', ctx.font);
    if (!hack1) {
      setHack1(true);
      return;
    }
    gradient1.addColorStop(0, ary2rgba(split2bits(color1)));
    gradient1.addColorStop(1, ary2rgba(split2bits(color2)));
    ctx.strokeStyle = gradient1;
    ctx.fillStyle = '#44FF88'
    clog(grid);
    grid.forEach((row, idx) => {
      // ctx.strokeText(row.join(''), 0, fontSize + idx * fontSize)
      ctx.fillText(row.join(''), 0, fontSize + idx * fontSize)
    });
  }, [hack1, grid]);

  clog(canvasRef);
  const pixelWidth = 5;
  const canvasWidth = grid[0].length * pixelWidth; //1000;
  const canvasHeight = grid.length * 10; // 500;

  return (
    <div className='letter-canvas'>
      <canvas ref={canvasRef} id={canId} width={canvasWidth} height={canvasHeight} style={{ border: '4px dotted black' }} ></canvas>
    </div>
  );

}
