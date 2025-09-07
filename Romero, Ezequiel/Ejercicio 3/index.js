import express from 'express';

const app = express();
const port = 3000;
app.use(express.json());

let tareas = [];

function existeTarea(nombre) {
  return tareas.some(t => t.nombre.toLowerCase() === nombre.toLowerCase());
}

app.post('/tareas', (req, res) => {
  const { nombre, completada } = req.body;

  if (!nombre || typeof completada !== 'boolean') {
    return res.status(400).json({ error: 'Se requiere nombre y estado V o F!' });
  }

  if (existeTarea(nombre)) {
    return res.status(409).json({ error: 'Ya existe una tarea con ese nombre!' });
  }

  tareas.push({ nombre, completada });
  res.status(201).json({ mensaje: 'Tarea creada correctamente!' });
});

app.get('/tareas', (req, res) => {
  const { completadas } = req.query;

  let resultado = tareas;

  if (completadas === 'true') {
    resultado = tareas.filter(t => t.completada);
    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: 'No hay tareas completadas!' });
    }
  } else if (completadas === 'false') {
    resultado = tareas.filter(t => !t.completada);
    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: 'No hay tareas pendientes!' });
    }
  }

  res.status(200).json(resultado);
});

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en: ${port}`);
});