import express from 'express';
import fs from "fs";

const app = express();

const PORT = 3000;

app.use(express.json())
app.use(express.static('public'))


// GET /index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});


// GET /canciones
app.get('/canciones', (req, res) => {
    const canciones = JSON.parse(fs.readFileSync('repertorio.json'))
    res.json(canciones)
});


// POST /canciones
app.post('/canciones', async (req, res) => {
    const { id, titulo, artista, tono } = req.body
const nuevaCancion = { id, titulo, artista, tono }
if (!nuevaCancion.titulo.trim() || !nuevaCancion.artista.trim() || !nuevaCancion.tono.trim()) {
    return res.status(400).json({
        message: 'Canción no agregada por campos vacíos.',
    })
};

    const cancion = req.body
    const canciones = JSON.parse(fs.readFileSync('repertorio.json'))
    canciones.push(cancion)
    fs.writeFileSync("repertorio.json", JSON.stringify(canciones))
    res.send('Canción agregada exitosamente.')
});


// PUT /canciones/:id
app.put('/canciones/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { titulo, artista, tono } = req.body;
    if (!titulo.trim() || !artista.trim() || !tono.trim()) {
        return res.status(400).json({
            message: 'Los campos no deben estar vacíos.',
        });
    }

    const cancion = req.body
    const canciones = JSON.parse(fs.readFileSync('repertorio.json'))
    const index = canciones.findIndex(c => c.id == id)
    canciones[index] = cancion
    fs.writeFileSync('repertorio.json', JSON.stringify(canciones))
    res.send('Canción editada exitosamente.')
});


// DELETE /canciones/:id
app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params
    const canciones = JSON.parse(fs.readFileSync('repertorio.json'))
    const index = canciones.findIndex(c => c.id == id)
    canciones.splice(index, 1)
    fs.writeFileSync('repertorio.json', JSON.stringify(canciones))
    res.send('Canción borrada exitosamente.')
});

app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});