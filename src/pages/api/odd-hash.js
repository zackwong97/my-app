let hashCache = [];
const hashURL = process.env.NODE_ENV == 'development' ? process.env.APP_URL : process.env.APP_URL_PROD;

export default function handler(req, res){
    let promiseArr = [];
    if(hashCache.length > 0){
        const oddHash = hashCache.shift();
        res.status(200).json({oddHash: oddHash});
    }else{
        for (let index = 0; index < 10; index++) {
            promiseArr.push(new Promise((resolve) => fetchHash(resolve, res)));
        }
        Promise.any(promiseArr)
        .then(()=>{
            const oddHash = hashCache.shift();
            res.status(200).json({oddHash: oddHash});
        })
        .catch((error)=>{
            console.log(error);
            res.status(500).json({ msg: 'server error' });
        });
    }
}

function fetchHash(resolve, res){
    fetch(`${hashURL}/api/ran-hash`)
    .then(response => response.json())
    .then(data => {
        const lastChar = parseInt(data.hash.slice(-1));
        if(lastChar && lastChar % 2 !== 0){
            console.log('Found odd hash!');
            hashCache.push(data.hash);
            resolve();
        }else{
            if(!res.headersSent) fetchHash(resolve, res);
        }
    })
    .catch((error)=>{
        console.log(error);
        if(!res.headersSent) fetchHash(resolve, res);
    });
}

export const config = {
    api: { externalResolver: true }
};