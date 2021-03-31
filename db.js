const Pool = require('pg').Pool;
// const pool = new Pool({
//     user:"postgres",
//     password: "5354431Am",
//     host: "shop-lesson-4.cartgdbgcd1a.us-east-1.rds.amazonaws.com",
//     port: 5432,
//     database:"shopdb"
// });

const pool = new Pool({
    user:"postgres",
    password: "5354431Am",
    host: "localhost",
    port: 5432,
    database:"node_course_t2"
});

module.exports = pool;

// host: "shop-1.cartgdbgcd1a.us-east-1.rds.amazonaws.com",
// database:"shop"
