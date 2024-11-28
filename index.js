import express from 'express';   // Usando import para 'express'
import path from 'path';         // Usando import para 'path'
import bodyParser from 'body-parser';  // Usando import para 'body-parser'

import { sql } from './db.js';   // Ahora puedes importar 'sql' correctamente

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Mi primer Servidor");
});

app.get('/profesores', async (req, res) => {
    try {
        const profesores = await sql.query("select * from profesor");
        res.status(200).json(profesores.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({mensaje:"Error"});
    }
});

app.post('/profesor', async (req, res) => {
    const datos = req.body;
    try {
        const resultado = await sql.query("insert into profesor (nombres,apellidos) values ($1,$2) RETURNING *",[datos.nombres,datos.apellidos]);
        res.status(201).json({mensaje:"Creado con éxito",profesor:resultado.rows[0]})
    } catch (error) {
        console.log(error)
        res.status(500).json({mensaje:"Error"});
    }
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.listen(PORT, () => {
    console.log("Corriendo en el puerto " + PORT);
});
