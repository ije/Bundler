import jpg from "./deno.jpg";
import png from "./deno.png";
import tiff from "./deno.tiff";
import svg from "./deno.svg";
console.log(png);

console.log(svg);

document.querySelector("#png").src = png.src;
document.querySelector("#jpg").src = jpg.src;
document.querySelector("#tiff").src = tiff.src;
document.querySelector("#svg").src = svg.src;
