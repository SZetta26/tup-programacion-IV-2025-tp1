import express from 'express';

const app = express();
const port = 3000;
app.use(express.json());

let alumnos = [];

function existeAlumno(nombre) {
  return alumnos.some(a => a.nombre.toLowerCase() === nombre.toLowerCase());
}

function calcularEstado(notas) {
  const promedio = notas.reduce((ac, n) => ac + n, 0) / notas.length;
  let estado = '';

  if (promedio < 6) estado = 'Reprobado';
  else if (promedio < 8) estado = 'Aprobado';
  else estado = 'Promocionado';

  return { promedio, estado };
}

app.post('/alumnos', (req, res) => {
  const { nombre, notas } = req.body;

  if (!nombre || !Array.isArray(notas) || notas.length !== 3) {
    return res.status(400).json({ error: 'Se requiere nombre y tres notas numéricas!' });
  }

  if (existeAlumno(nombre)) {
    return res.status(409).json({ error: 'Ya existe un alumno con ese nombre!' });
  }

  if (!notas.every(n => typeof n === 'number' && n >= 0 && n <= 10)) {
    return res.status(400).json({ error: 'Las notas deben ser números entre 0 y 10!' });
  }

  alumnos.push({ nombre, notas });
  res.status(201).json({ mensaje: 'Alumno creado correctamente!' });
});

app.put('/alumnos/:nombre', (req, res) => {
  const nombre = req.params.nombre;
  const { notas } = req.body;

  const index = alumnos.findIndex(a => a.nombre.toLowerCase() === nombre.toLowerCase());
  if (index === -1) {
    return res.status(404).json({ error: 'Alumno no encontrado!' });
  }

  if (!Array.isArray(notas) || notas.length !== 3 || !notas.every(n => typeof n === 'number' && n >= 0 && n <= 10)) {
    return res.status(400).json({ error: 'Las notas deben ser tres números entre 0 y 10!' });
  }

  alumnos[index].notas = notas;
  res.status(200).json({ mensaje: 'Notas actualizadas correctamente!' });
});

app.get('/alumnos/:nombre', (req, res) => {
  const nombre = req.params.nombre;
  const alumno = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());

  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado!' });
  }

  const { promedio, estado } = calcularEstado(alumno.notas);

  res.status(200).json({
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio,
    estado
  });
});

app.get('/alumnos', (req, res) => {
  const listado = alumnos.map(a => {
    const { promedio, estado } = calcularEstado(a.notas);
    return {
      nombre: a.nombre,
      notas: a.notas,
      promedio,
      estado
    };
  });

  res.status(200).json(listado);
});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en: ${port}`);
});