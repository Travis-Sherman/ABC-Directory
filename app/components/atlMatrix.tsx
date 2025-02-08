'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function MatrixAtlantaSkyline() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const columns = Math.floor(canvas.width / 15);
        const drops: number[] = new Array(columns).fill(1);
        const matrixChars = '01';

        const drawMatrix = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = '15px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
                ctx.fillText(text, i * 15, drops[i] * 15);
                
                if (drops[i] * 15 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(drawMatrix, 50);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full opacity-50" />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <Image
                    src="/path-to-your-atlanta-skyline-image.jpeg"
                    alt="Atlanta Skyline"
                    fill
                    className="opacity-80 mix-blend-screen object-cover"
                />
            </div>
        </div>
    );
}
