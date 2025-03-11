const fs = require('fs').promises;
const express = require ('express');

const app = express();
app.use(express.json());

app.get("/INPC",(req,res)=>{
    fs.readFile("./api/INPC.json","utf8")
    .then((data) => {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(data);
    })
    .catch((error) => {
        return res.status(500).json({message: "No se pudo recuperar el INPC"});
        console.log(error);
    })
});

const PORT=5001;
app.listen(PORT,()=>console.log("Server is running"));