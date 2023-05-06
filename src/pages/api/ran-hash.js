const crypto = require("crypto");
const { performance } = require('perf_hooks');

export default function (req, res){
    console.log('Generating Hash...');
    const start = performance.now();
    let ranHash = crypto.createHash("sha256").update(new Date().toISOString()).digest("hex");
    setTimeout(()=>{
        res.status(200).json({ hash: ranHash });
    }, (1000 - (performance.now() - start)));
}

export const config = {
    api: { externalResolver: true }
};