import express from "express"
import cluster from "cluster"
import os from "os"

const totalCPU = os.cpus().length
console.log(totalCPU)

const port = 3000

if(cluster.isPrimary){
    for(let i = 0; i<totalCPU; i++){
        cluster.fork()
    }
    cluster.on("exit", (worker, code, signal)=>{
        console.log(`Worker with process id ${worker.process.pid} died`)
        console.log("Forking another process")
        cluster.fork()
    })
}
else{
    const app = express()
    console.log(`Worker with process id ${process.pid} started`)
    app.get("/", (req, res)=>{
        res.json({
            message : `Endpoint healthy and processid is ${process.pid}`
        })
    })


    app.get("/api/:n", (req, res)=>{
        const n = parseInt(req.params.n)
        let count = 0;
        for(let  i = 0; i<n && i<5000; i++){
            count+=i;
        }
        res.json({
            msg : `The total count is ${count} and process.id is ${process.pid}`
        })
    })
    app.listen(3000);
}



