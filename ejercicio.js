// image es la imagen con los datos
// x e y son las coordenadas del pixel
// channel indica que canal de color queremos, 0=rojo 1=verde 2=azul 3=alpha
const getPixelChannelColor = (image, x, y, channel) => {
  const pixel = y * (image.width * 4) + x * 4;
  return image.data[pixel + channel];
};

const setPixelChannelColor = (image, x, y, newVal, channel) => {
    const pixel = y * (image.width * 4) + x * 4;
    image.data[pixel + channel] = newVal;
};

const getPixel = (image, x, y) => [
  getPixelChannelColor(image, x, y, 0),
  getPixelChannelColor(image, x, y, 1),
  getPixelChannelColor(image, x, y, 2),
  getPixelChannelColor(image, x, y, 3)
];

// La imagen que tienen que modificar viene en el parámetro image y contiene inicialmente los datos originales
// es objeto del tipo ImageData ( más info acá https://mzl.la/3rETTC6  )
// Factor indica la cantidad de intensidades permitidas (sin contar el 0)

function find_closest_palette_color(color, factor) {
    let interval = 256 / factor;
    let closer_color = 0;
    let error_color = 255;
    for(let i = 0; i <= factor;i++) {
        
        const palette_color = Math.round(Math.min(i * interval, 255));
        
        const error_palette_color = Math.abs(color - palette_color);
        if (error_palette_color < error_color) {
            error_color = error_palette_color;
            closer_color = palette_color;
        }
    }
    return closer_color;
}

// El kernel utilizado en el algoritmo de dithering de Jarvis y Judice
function jarvis_judice_kernel(image, x, y, c, quant_error){
    const divisor = 48;
    // Si hay un elemento siguiente en la fila
    if (x + 1 < image.width) {
        setPixelChannelColor(image, x+1, y, Math.round(getPixelChannelColor(image, x+1, y, c) + quant_error * 7/divisor), c);
    }
    // Si hay otro elemento siguiente en la fila
    if (x + 2 < image.width) {
        setPixelChannelColor(image, x+2, y, Math.round(getPixelChannelColor(image, x+2, y, c) + quant_error * 5/divisor), c);
    }
    // Si hay una fila abajo
    if (y + 1 < image.height) {
        setPixelChannelColor(image, x, y+1, Math.round(getPixelChannelColor(image, x, y+1, c) + quant_error * 7/divisor), c);
        // Si hay un elemento siguiente en la fila de abajo
        if (x + 1 < image.width) {
            setPixelChannelColor(image, x+1, y+1, Math.round(getPixelChannelColor(image, x+1, y+1, c) + quant_error * 5/divisor), c);
        }
            // Si hay otro elemento siguiente en la fila
        if (x + 2 < image.width) {
            setPixelChannelColor(image, x+2, y+1, Math.round(getPixelChannelColor(image, x+2, y+1, c) + quant_error * 3/divisor), c);
        }
        // Si hay un elemento anterior en la fila de abajo
        if (x - 1 >= 0 ) {
            setPixelChannelColor(image, x-1, y+1, Math.round(getPixelChannelColor(image, x-1, y+1, c) + quant_error * 5/divisor), c);
        }
        // Si hay otro elemento anterior en la fila de abajo
        if (x - 2 >= 0 ) {
            setPixelChannelColor(image, x-2, y+1, Math.round(getPixelChannelColor(image, x-2, y+1, c) + quant_error * 3/divisor), c);
        }
    }
    // Si hay otra fila abajo
    if (y + 2 < image.height) {
        setPixelChannelColor(image, x, y+2, Math.round(getPixelChannelColor(image, x, y+2, c) + quant_error * 5/divisor), c);
        // Si hay un elemento siguiente en la fila de abajo
        if (x + 1 < image.width) {
            setPixelChannelColor(image, x+1, y+2, Math.round(getPixelChannelColor(image, x+1, y+2, c) + quant_error * 3/divisor), c);
        }
            // Si hay otro elemento siguiente en la fila
        if (x + 2 < image.width) {
            setPixelChannelColor(image, x+2, y+2, Math.round(getPixelChannelColor(image, x+2, y+2, c) + quant_error * 1/divisor), c);
        }
        // Si hay un elemento anterior en la fila de abajo
        if (x - 1 >= 0 ) {
            setPixelChannelColor(image, x-1, y+2, Math.round(getPixelChannelColor(image, x-1, y+2, c) + quant_error * 3/divisor), c);
        }
        // Si hay otro elemento anterior en la fila de abajo
        if (x - 2 >= 0 ) {
            setPixelChannelColor(image, x-2, y+2, Math.round(getPixelChannelColor(image, x-2, y+2, c) + quant_error * 1/divisor), c);
        }
    }
}

// El kernel utilizado en el algoritmo de dithering de Floyd y Steinberg
function floyd_steinberg_kernel(image, x, y, c, quant_error){
    // Si hay un elemento siguiente en la fila
    if (x + 1 < image.width) {
        setPixelChannelColor(image, x+1, y, Math.round(getPixelChannelColor(image, x+1, y, c) + quant_error * 7/16), c);
    }
    // Si hay una fila abajo
    if (y + 1 < image.height) {
        setPixelChannelColor(image, x, y+1, Math.round(getPixelChannelColor(image, x, y+1, c) + quant_error * 5/16), c);
        // Si hay un elemento siguiente en la fila de abajo
        if (x + 1 < image.width) {
            setPixelChannelColor(image, x+1, y+1, Math.round(getPixelChannelColor(image, x+1, y+1, c) + quant_error * 1/16), c);
        }
        // Si hay un elemento anterior en la fila de abajo
        if (x - 1 >= 0 ) {
            setPixelChannelColor(image, x-1, y+1, Math.round(getPixelChannelColor(image, x-1, y+1, c) + quant_error * 3/16), c);
        }
    }
}

function dither(image, factor)
{
    // completar
    
      /**
     * Pseudo code
     * 
     * for each y from top to bottom do
        for each x from left to right do
            oldpixel := pixel[x][y]
            newpixel := find_closest_palette_color(oldpixel)
            pixel[x][y] := newpixel
            quant_error := oldpixel - newpixel
            pixel[x + 1][y    ] := pixel[x + 1][y    ] + quant_error × 7 / 16
            pixel[x - 1][y + 1] := pixel[x - 1][y + 1] + quant_error × 3 / 16
            pixel[x    ][y + 1] := pixel[x    ][y + 1] + quant_error × 5 / 16
            pixel[x + 1][y + 1] := pixel[x + 1][y + 1] + quant_error × 1 / 16
     */
    
    for(let y = 0; y < image.height;y++) {
        for(let x = 0; x < image.width;x++) {
            for(let c = 0; c < 4; c++) {
                const old_pixel = getPixelChannelColor(image, x, y, c);
                const new_pixel = find_closest_palette_color(old_pixel, factor);
                setPixelChannelColor(image, x, y, new_pixel, c);
                quant_error = old_pixel - new_pixel;
                jarvis_judice_kernel(image, x, y, c, quant_error);
                // floyd_steinberg_kernel(image, x, y, c, quant_error);
            }
        }
    }
}

// Imágenes a restar (imageF y imageB) y el retorno en result
function substraction(imageF, imageB, result) {
  for (let y = 0; y < result.height; y++) {
    for (let x = 0; x < result.width; x++) {
      const af = getPixelChannelColor(imageF, x, y, 3);
      const [ rf, gf, bf ] = getPixel(imageF, x, y).map((color) => color * (af / 255));
      const [ rb, gb, bb ] = getPixel(imageB, x, y);

      setPixelChannelColor(result, x, y, Math.abs(rf - rb), 0);
      setPixelChannelColor(result, x, y, Math.abs(gf - gb), 1);
      setPixelChannelColor(result, x, y, Math.abs(bf - bb), 2);
    }
  }
}
