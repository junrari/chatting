app.post('/chartdatafromdbwithbid', (req,res)=>{
    console.log('chartdatafromdbwithbid 호출됨');

    const bid = req.body.bid
    console.log('bid is %s', bid);

    pool.getConnection((err,conn)=> {
        
        const resData ={}
        resData.result = 'error'
        resData.temp = []
        resData.reg_date =[]
        if(err) {
            conn.release()
            console.log('Mysql getConnention error. aborted');
            res.json(resData);
            return;
        }

        // db에 데이터를 요청한다
  
        const exec = conn.query(
            'select `temperature`, `reg_date` from `building_temperature` where `building_id`=? order by `reg_date` asc;',
            [bid],
            (err,rows) =>{
                if (err){
                    console.log('Mysql query error. aborted');
                    res.json(resData);
                    console.log(resData);
                    return;
                }

                if(rows[0]) {
                    resData.result='ok'
                    rows.forEach((val)=>{
                        resData.temp.push(val.temperature)
                        resData.reg_date.push(val.reg_date)
                    })
                }

                else{
                    //query는 성공, 그러나 데이터가 없는 경우
                    resData.result='none'
                    console.log('데이터가없음');
                }

                return res.json(resData);
            }
            );
            

    })    
})

app.post('/chartdatafromdbwithbid', (req,res)=>{
    console.log('chartdatafromdbwithbid 호출됨');

    const bid = req.body.bid
    console.log('bid is %s', bid);

    pool.getConnection((err,conn)=> {
        
        const resData ={}
        resData.result = 'error'
        resData.temp = []
        resData.reg_date =[]
        if(err) {
            conn.release()
            console.log('Mysql getConnention error. aborted');
            res.json(resData);
            return;
        }

        // db에 데이터를 요청한다
  
        const exec = conn.query(
            'select `temperature`, `reg_date` from `building_temperature` where `building_id`=? order by `reg_date` asc;',
            [bid],
            (err,rows) =>{
                if (err){
                    console.log('Mysql query error. aborted');
                    res.json(resData);
                    console.log(resData);
                    return;
                }

                if(rows[0]) {
                    resData.result='ok'
                    rows.forEach((val)=>{
                        resData.temp.push(val.temperature)
                        resData.reg_date.push(val.reg_date)
                    })
                }

                else{
                    //query는 성공, 그러나 데이터가 없는 경우
                    resData.result='none'
                    console.log('데이터가없음');
                }

                return res.json(resData);
            }
            );
            

    })    
})


app.post('/chartdatafromdb', (req,res)=>{
    console.log('chartdatafromdb 호출됨');

    pool.getConnection((err,conn)=> {
        
        const resData ={}
        resData.result = 'error'
        resData.temp = []
        resData.reg_date =[]
        if(err) {
            conn.release()
            console.log('Mysql getConnention error. aborted');
            res.json(resData);
            return;
        }

        // db에 데이터를 요청한다
        const exec = conn.query(
            'select `temperature`, `reg_date` from `building_temperature` order by `reg_date` asc;',
            (err,rows) =>{
                if (err){
                    console.log('Mysql query error. aborted');
                    res.json(resData);
                    console.log(resData);
                    return;
                }

                if(rows[0]) {
                    resData.result='ok'
                    rows.forEach((val)=>{
                        resData.temp.push(val.temperature)
                        resData.reg_date.push(val.reg_date)
                    })
                }

                else{
                    //query는 성공, 그러나 데이터가 없는 경우
                    resData.result='none'
                    console.log('데이터가없음');
                }

                return res.json(resData);
            }
            );

    })    
})
  