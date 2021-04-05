// Cargamos una imagen
function handleFiles(e) {
  // abrir el archivo
  console.log("> Cargando imagen...");
  const URL = window.webkitURL || window.URL;
  // canvas de entrada, de dithering y de diferencias
  const canvasinput = document.getElementById("canvasinput");
  const contextinput = canvasinput.getContext("2d");
  const url = URL.createObjectURL(e.target.files[0]);
  const img = new Image();

  // limpiamos el canvas
  contextinput.clearRect(0, 0, canvasinput.width, canvasinput.height);

  // dibujamos en el canvas (ojo que es asincrónica!)
  img.onload = function () {
    // mostramos la imagen cargada
    canvasinput.width = img.naturalWidth;
    canvasinput.height = img.naturalHeight;
    contextinput.drawImage(img, 0, 0);
    console.log("> ... imagen cargada!");

    // computamos dither y diferencia
    recomputeImages();
  };

  img.src = url;
}

// Computa las imágenes dereivadas (dither y substraction)
function recomputeImages() {
  console.log("> Computando dithering y diferencias...");
  // obtenemos los canvas
  const canvasinput = document.getElementById("canvasinput");
  const canvasresult = document.getElementById("canvasresult");
  const canvasdiff = document.getElementById("canvasdiff");
  const contextinput = canvasinput.getContext("2d");
  const contextresult = canvasresult.getContext("2d");
  const contextdiff = canvasdiff.getContext("2d");

  // obtener niveles
  const levels = document.getElementById("inputlevels").value;

  // limpiamos el canvas
  contextresult.clearRect(0, 0, canvasresult.width, canvasresult.height);
  contextdiff.clearRect(0, 0, canvasdiff.width, canvasdiff.height);

  // filtramos la imagen
  // creamos la imagen nueva (slice copia los datos)
  let ditherimg = new ImageData(
    contextinput.getImageData(0, 0, canvasinput.width, canvasinput.height).data,
    canvasinput.width,
    canvasinput.height
  );

  // filtrado
  dither(ditherimg,levels)

  // mostramos el resultado despuás del filtrado
  canvasresult.width = canvasinput.width;
  canvasresult.height = canvasinput.height;
  contextresult.putImageData(ditherimg, 0, 0);
  canvasresult.toDataURL("image/png");

  // diferencias
  // creamos la imagen nueva (slice copia los datos)
  const subsimg = new ImageData(
    contextinput.getImageData(0, 0, canvasinput.width, canvasinput.height).data,
    canvasinput.width,
    canvasinput.height
  );

  // filtrado
  substraction(subsimg, ditherimg, subsimg);

  // mostramos el resultado despuás del filtrado
  canvasdiff.width = canvasinput.width;
  canvasdiff.height = canvasinput.height;
  contextdiff.putImageData(subsimg, 0, 0);
  canvasdiff.toDataURL("image/png");

  console.log("> ... finalizado!");
}

// Inicialización del documento
window.onload = function () {
  // asocio inputfile a la función addImage
  const inputfile = document.getElementById("inputfile");
  inputfile.addEventListener("change", handleFiles);

  // asocio inputlevels a la función recomputeImages()
  const inputlevels = document.getElementById("inputlevels");
  inputlevels.addEventListener("change", recomputeImages);

  console.log("> HTML listo!");
};
