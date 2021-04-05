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
    
    // PROBANDO
    for(let y = 0; y < image.height;y++) {
        for(let x = 0; x < image.width;x++) {
            setPixelChannelColor(image, x, y, 255, 0);
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
