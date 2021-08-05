const axios = require('axios')
require('dotenv').config();
const execute_query = require('./db_query').execute_query
const responses = require('../common_functions/responses')
const constants = require('../constants/constants')

module.exports.token = async function (req, res) {
    try {

        var sql_query01 = 'select booking_id from  booking where booking_id=?'
        var values01 = [req.body.order_id]
        var results01 = await execute_query(sql_query01, values01)

        if (results01.length == 0) {
            responses.sendResponse(res, "Your order_id is Not Valid !!! ", constants.STATUS_CODES.BAD_REQUEST)

        } else {
            var sql_query1 = 'select order_id from token_order where order_id=?'
            var values1 = [req.body.order_id]
            var results1 = await execute_query(sql_query1, values1)
            if (results1.length !== 0) {
                var sql_query11 = 'SELECT bk.booking_id,bk.customer_id,bk.merchant_id,bk.ammount,tko.job_delivery_datetime from booking bk join token_order tko on booking_id=order_id where bk.booking_id=?'
                var values11 = [req.body.order_id]

                var results11 = await execute_query(sql_query11, values11)
                //console.log(results11)
                //responses.sendResponse(res, "Your order_id is already Assigned !!! ", constants.STATUS_CODES.BAD_REQUEST)
                responses.sendordervalueResponse(res, "Your order_id is already Assigned !!! ", results11, constants.STATUS_CODES.BAD_REQUEST)
            }
            else {
                var sql_query1 = 'SELECT customer_id,merchant_id,ammount from booking  where booking_id=?'
                var values1 = [req.body.order_id]
                var results1 = await execute_query(sql_query1, values1)
                //console.log(results1)
                //console.log(results1[0].customer_id,results1[0].merchant_id,results1[0].ammount)

                var sql_query = 'insert into token_order(order_id,auto_assignment,job_description,job_pickup_phone,job_pickup_name,job_pickup_email,job_pickup_address\
,job_pickup_datetime,customer_email,customer_username,customer_phone,customer_address,job_delivery_datetime,customer_id,merchant_id,ammount) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
                const values = [
                    req.body.order_id,
                    req.body.auto_assignment,
                    req.body.job_description,
                    req.body.job_pickup_phone,
                    req.body.job_pickup_name,
                    req.body.job_pickup_email,
                    req.body.job_pickup_address,
                    req.body.job_pickup_datetime,
                    req.body.customer_email,
                    req.body.customer_username,
                    req.body.customer_phone,
                    req.body.customer_address,
                    req.body.job_delivery_datetime,results1[0].customer_id,results1[0].merchant_id,results1[0].ammount
                ]
                let results = await execute_query(sql_query, values)
                var sql_query11 = 'SELECT bk.booking_id,bk.customer_id,bk.merchant_id,bk.ammount,tko.job_delivery_datetime from booking bk join token_order tko on booking_id=order_id where bk.booking_id=?'
                var values11 = [req.body.order_id]
                var results11 = await execute_query(sql_query11, values11)
                console.log(results11)
                //console.log(values11,sql_query11)

                var data = JSON.stringify(req.body);
                //var response;
                // console.log('data:', data);
                axios.post(process.env.external_api_url, data, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(resp => {
                        // console.log(`statusCode: ${res.status}`)
                        // console.log(res.data);
                        //response = resp.data
                        //console.log(response)
                        //res.send(resp.data)
                        responses.sendordervalueResponse(res, resp.data, results11, constants.STATUS_CODES.SUCCESS)
                    })
            }
        }
    } catch {
        console.error(error);
    }

}










