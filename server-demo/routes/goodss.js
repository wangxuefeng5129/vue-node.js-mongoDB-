var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
//连接mongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

mongoose.connection.on('connected',function () {
  console.log('success')
});

mongoose.connection.on('error',function () {
  console.log('fail')
});

mongoose.connection.on('disconnected',function () {
  console.log('disconnected')
});

//查询商品列表数据
router.get('/list',function (request,response,next) {
  let page=parseInt(request.param("page"));
  let pageSize=parseInt(request.param("pageSize"));
  let priceLevel = request.param("priceLevel");
  let sort = request.param("sort");
  let skip = (page-1)*pageSize;
  let priceGt='';
  let priceLte='';
  let params={};
  if(priceLevel!='all'){
    switch (priceLevel){
      case '0':priceGt=0;priceLte=100;break;
      case '1':priceGt=100;priceLte=500;break;
      case '2':priceGt=500;priceLte=1000;break;
      case '3':priceGt=1000;priceLte=5000;break;
    }
    params={
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodsModel=Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function (err,doc) {
    if(err){
      response.json({
        status:'1',
        msg:err.message
      });
    }else {
      response.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })
});
//加入到购物车
router.post("/addCart",function (req,res,next) {
  var userId='100000077';
  var productId=req.body.productId;
  var User=require('../models/user'); //获取模型
  
  User.findOne({userId:userId},function (err,userDoc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else {
      //console.log("userDoc"+userDoc);
      if(userDoc){
        let goodsItem='';
        userDoc.cartList.forEach(function (item) {
          if(item.productId==productId){
            goodsItem=item;
            item.productNum++;
          }
        });
        if(goodsItem){
          userDoc.save(function (errs,docs) {
            if(errs){
              res.json({
                status:'1',
                msg:errs.message
              })
            }else {
              res.json({
                status:'0',
                msg:'',
                result:'success'
              })
            }
          })
        }else {
          Goods.findOne({productId:productId},function (err,doc) {
            if(err){
              res.json({
                status:'1',
                msg:err.message
              })
            }else {
              if(doc){
                doc.productNum=1;
                doc.checked=1;
                userDoc.cartList.push(doc);
                userDoc.save(function (errs,docs) {
                  if(errs){
                    res.json({
                      status:'1',
                      msg:errs.message
                    })
                  }else {
                    res.json({
                      status:'0',
                      msg:'',
                      result:'success'
                    })
                  }
                })
              }
            }
          })
        }
        
      }
    }
  })
});

module.exports=router;

