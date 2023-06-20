const gen6digitsNumber = () => {
  let min = 100000; // número mínimo de 6 dígitos
  let max = 999999; // número máximo de 6 dígitos
  let num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

export default gen6digitsNumber