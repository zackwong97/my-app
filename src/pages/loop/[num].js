export default function handler(req, res) {
    const qNum = parseInt(req.query.num);
    if(!qNum) res.status(400).json({error: 'integers only'});
    res.status(200).json(loop(qNum));
}

function loop(num) {
    let numArr = [];
    for (let index = 1; index < num + 1; index++) {
        let rs = '';
        if(index % 3 === 0) rs += 'fizz';
        if(index % 5 === 0) rs += 'buzz';
        if(rs === '') rs = index;
        numArr.push(rs);
    }
    return numArr;
}