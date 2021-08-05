const execute_query = require('./db_query').execute_query
const responses = require('../common_functions/responses')
const constants = require('../constants/constants')


module.exports.order_product = async function (req, res) {
    try {

        customer_id = req["customer_id"]
        merchant_id = req.body.merchant_id
        product_name = req.body.product_name
        var sql_query1 = 'select ammount from product where merchant_id=? and product_name=? and product_id=?'
        var values1 = [merchant_id,product_name,req.body.product_id];
        price = await execute_query(sql_query1, values1)
        //console.log(price[0].ammount)
        var sql_query = 'insert into booking (customer_id,merchant_id,product_name,ammount)values(?,?, ?, ?)'
        var values = [customer_id,merchant_id,product_name,price[0].ammount];

        var results = await execute_query(sql_query, values)
        //console.log(results)
        id = results.insertId
        responses.sendResponse(res, `Congratulations!!! Your Booking_Id is : ${id}`, constants.STATUS_CODES.SUCCESS)
    }
    catch {
        responses.sendResponse(res, "Please Enter all Required Filed", constants.STATUS_CODES.NOT_FOUND)
    }
}


module.exports.cancel_booking = async function (req, res) {
    try {
        const booking_id = req.body.booking_id
        var sql_query = 'update booking set status="cancelled" where booking_id=? and status="booked"'
        var values = [booking_id]
        let results = await execute_query(sql_query, values)

        if (results.affectedRows == 0) {
            responses.sendResponse(res, "Alredy calcelled or Booking_Id is not Valid", constants.STATUS_CODES.SUCCESS)
        } else {
            responses.sendcancelResponse(res, "booking cancelled", req.body.cancel_resion, constants.STATUS_CODES.SUCCESS)
        }
    } catch {
        responses.sendResponse(res, "Some Error", constants.STATUS_CODES.SUCCESS)
    }
}


module.exports.conform_booking = async function (req, res) {
    try {
        const booking_id = req.body.booking_id
        var sql_query = 'update booking set status="completed" where booking_id=? and status="booked"'
        var values = [booking_id]
        let results = await execute_query(sql_query, values)

        if (results.message[27] === '0') {
            return responses.sendResponse(res, "Alredy updated or Booking_Id is not Valid", constants.STATUS_CODES.BAD_REQUEST)
        } else {
            responses.sendResponse(res, "Your Order is Completed!! Thanks", constants.STATUS_CODES.SUCCESS)
        }
    } catch {
        responses.sendResponse(res, "Some Error", constants.STATUS_CODES.NOT_FOUND)
    }
}

module.exports.check_bookings = async function (req, res) {
    try {
        var sql_query = 'select * from booking where booking_id=? and status="booked"';
        var values = [req.body.booking_id]

        let results = await execute_query(sql_query, values)

        if (results.length !== 0) {
            responses.sendResponse(res, "Your booking_id is valid ", constants.STATUS_CODES.BAD_REQUEST)
        } else {
            var sql_query1 = 'select * from booking where booking_id=? and status="cancelled"';
            var values1 = [req.body.booking_id]
            let results1 = await execute_query(sql_query1, values1)

            if (results1.length !== 0) {
                responses.sendResponse(res, "You booking is cancelled", constants.STATUS_CODES.BAD_REQUEST)
            } else {
                var sql_query2 = 'select * from booking where booking_id=? and status="completed"';
                var values2 = [req.body.booking_id]
                let results2 = await execute_query(sql_query2, values2)

                if (results2.length !== 0) {
                    responses.sendResponse(res, "You booking order is completed", constants.STATUS_CODES.BAD_REQUEST)
                } else {
                    responses.sendResponse(res, "Your Booking ID is Not match", constants.STATUS_CODES.NOT_FOUND)
                }
            }
        }
    }
    catch {
        responses.sendResponse(res, "Some Erorr", constants.STATUS_CODES.NOT_FOUND)
    }
}


module.exports.add_product = async function (req, res) {
    try {

        // merchant_id = req["merchant_id"]
        // console.log(merchant_id)
        var sql_query = 'insert into product (merchant_id,product_name,ammount)values(?, ?,?)'
        var values = [req.body.merchant_id, req.body.product_name, req.body.ammount];

        var results = await execute_query(sql_query, values)
        
        responses.sendResponse(res, "Successfully added product", constants.STATUS_CODES.SUCCESS)
    }
    catch {
        responses.sendResponse(res, "Some error in you quiry", constants.STATUS_CODES.NOT_FOUND)
    }
}

