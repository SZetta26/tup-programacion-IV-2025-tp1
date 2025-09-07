import express from 'express';

const app = express();
const port = 3000;
app.use(express.json());

let calculos = [];

function esCuadrado(alto, ancho) {
  return alto === ancho;
}

app.post('/calcular', (req, res) => {
  const { ancho, alto } = req.body;

  if (typeof alto !== 'number' || typeof ancho !== 'number') {
    return res.status(400).json({ error: 'Los valores deben ser numéricos!' });
  }

  if (alto <= 0 || ancho <= 0) {
    return res.status(400).json({ error: 'El alto y el ancho deben ser valores positivos!' });
  }

  const perimetro = 2 * (alto + ancho);
  const superficie = alto * ancho;

  const nuevoCalculo = {
    alto,
    ancho,
    perimetro,
    superficie,
  };
  calculos.push(nuevoCalculo);

  res.status(201).json(nuevoCalculo);
});

app.get('/calculos', (req, res) => {
  const calculosConTipo = calculos.map(c => ({
    ...c,
    tipo: esCuadrado(c.alto, c.ancho) ? 'Cuadrado' : 'Rectángulo'
  }));

  res.status(200).json(calculosConTipo);
});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en: ${port}`);
});