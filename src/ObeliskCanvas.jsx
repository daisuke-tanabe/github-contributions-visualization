"use client";

import { useEffect, useRef } from "react";
import obelisk from "obelisk.js";

import { data } from "./data.js";

const maxCount = 50;

export default function ObeliskCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // オブジェクトの描画
    const point = new obelisk.Point(100, 100);
    const pixelView = new obelisk.PixelView(canvas, point);

    // 立方体の最大の高さ
    const cubeMaxHeight = 60;

    // 立方体のサイズ
    const cubeSize = 12;

    // 立方体同士の配置間隔
    const gutter = 2;

    data.forEach((week, weekIndex) => {
      week.forEach(
        ({ contributionCount: count, color: hexColorCode }, dayIndex) => {
          // 整数にしたカラーコード
          const colorInt = Number.parseInt(hexColorCode.substring(1), 16);

          // 立方体の高さ（4はコミット0の場合の高さ、一日のコミットが100なら最大64になるはず）
          const cubeHeight =
            4 +
            (count > 0 ? Math.floor((count / maxCount) * cubeMaxHeight) : 0);

          // 立方体
          const dimension = new obelisk.CubeDimension(
            cubeSize,
            cubeSize,
            cubeHeight
          );
          const point3d = new obelisk.Point3D(
            (cubeSize + gutter) * weekIndex,
            (cubeSize + gutter) * dayIndex,
            0
          );

          // カラー設定
          const color = new obelisk.CubeColor().getByHorizontalColor(colorInt);

          // キューブ描画
          const cube = new obelisk.Cube(dimension, color, false);
          pixelView.renderObject(cube, point3d);
        }
      );
    });
  }, []);

  return <canvas ref={canvasRef} width={900} height={600} />;
}
