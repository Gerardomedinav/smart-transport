const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const videoInput = path.join(__dirname, "public/build/assets/video/truck.mp4");
const outputDir = path.join(__dirname, "public/assets/frames");

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log("?? Iniciando extracción...");

const args = [
    "-i", videoInput,
    "-vf", "fps=24,scale=1920:-1",
    "-c:v", "libwebp",
    "-quality", "80",
    path.join(outputDir, "frame_%04d.webp")
];

const ffmpeg = spawn(ffmpegPath, args);

ffmpeg.stderr.on("data", (data) => {
    process.stdout.write("."); // Muestra progreso con puntos
});

ffmpeg.on("close", (code) => {
    if (code === 0) {
        console.log("\n? ¡ÉXITO! Frames en: public/assets/frames");
    } else {
        console.log(`\n? Error: ${code}. Revisa si el video está en public/build/assets/video/truck.mp4`);
    }
});
