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

// La imagen que tienen que modificar viene en el parámetro image y contiene inicialmente los datos originales
// es objeto del tipo ImageData ( más info acá https://mzl.la/3rETTC6  )
// Factor indica la cantidad de intensidades permitidas (sin contar el 0)
function dither(image, factor)
{
    // completar
    // PROBANDO
    for(let y = 0; y < image.height;y++) {
        for(let x = 0; x < image.width;x++) {
            setPixelChannelColor(image, x, y, 255, 0);
        }
    }
}

// Imágenes a restar (imageA y imageB) y el retorno en result
function substraction(imageA,imageB,result) 
{
    // completar
}
