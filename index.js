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

//Obtener todos los profesores
app.get('/profesores', async (req, res) => {
    try {
        const profesores = await sql.query("select * from profesor");
        res.status(200).json(profesores.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({mensaje:"Error"});
    }
});

//Insertar un nuevo profesor
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

app.put('/profesor/:id', async (req,res)=>{
    const { id } = req.params;
    const datos = req.body;
    try {
        const resultado = await sql.query("UPDATE profesor SET nombres = $1, apellidos = $2 where id=$3 RETURNING *",[datos.nombres, datos.apellidos,id]);
        if (resultado.rows.length>0) {
            res.status(200).json({mensaje:"Actualizado con éxito", profesor:resultado.rows[0]});
        } else {
            res.status(404).json({mensaje:"Profesor no encontrado"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({mensaje:"Error"});
    }
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.listen(PORT, () => {
    console.log("Corriendo en el puerto " + PORT);
});
