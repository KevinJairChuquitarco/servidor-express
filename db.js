import pg from 'pg'; 

const { Pool } = pg;  
const sql = new Pool({
    user: 'postgres',
    database: 'escuela',
    password: '123456',
    port: '5432'
});

export { sql };  