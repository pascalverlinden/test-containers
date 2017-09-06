'use strict';

const
    contracts = require('eris-contracts')
  , fs = require('fs')
  , contractData = require('./jobs_output.json')
  , accounts = require('./accounts.json')
  , containerListAddress = contractData["deployContainerList"]
  , containerListAbi = JSON.parse(fs.readFileSync(`./abi/${containerListAddress}`))
  , containerAbi = JSON.parse(fs.readFileSync("./abi/Container"))
  , nilAddress = "0000000000000000000000000000000000000000"
  , async = require('async')
  , utils = require('eris-contracts/lib/utils/utils')
  ;

let
    accountId = "dummy_full_000"
  , account = accounts[accountId]
  , chainURL = "http://192.168.99.100:1337/rpc"
  , contractsManager = contracts.newContractManagerDev(chainURL, account)
  , containerList = contractsManager.newContractFactory(containerListAbi).at(containerListAddress)
  ;


function addOneContainer(containerNumber){
  return new Promise(function(resolve, reject) {
    containerList.add(containerNumber, function(error, count){
      if ( error ){
        reject(error)
      }
      else {
        resolve();
      }
    })
  })
}


function addContainers(nbr){
  return new Promise(function(resolve, reject) {
    const
        MAX = 9999999
      , MAXDIGITS = 7
      ;
    let
        count = 0
      , numPart = "0000000"
      ;
    async.whilst(
      function(){ return count < nbr },
      function(callback){
        let cnr = "CTRU" + (numPart+count).slice(-MAXDIGITS);
        console.log(`add container ${count+1}: ${cnr}`);
        addOneContainer(cnr)
        .then(function(){
          count++;
          callback(null, count);
        })
        .catch(function(error){
          callback(error, count);
        })
      },
      function(error, count){
        if ( error ){
          reject(error);
        }
        else {
          resolve();
        }
      }
    );
  });
}


function reportContainers(){
  containerList.count(function(error, result){
    if ( error ){
      console.log(`reportContainers: ${error.message}`);
      return;
    }
    else {
      let count = result.toNumber();
      console.log(`There are ${count} containers`);
      for(var i = 0 ; i < count ; i++){
        containerList.get(i, function(error, addr){
          if ( error ){
            console.log(error.message);
            return;
          }
          else {
            console.log(`address ${addr}`);
            let container = contractsManager.newContractFactory(containerAbi).at(addr);
            container.containerNumber(function(error, cnr){
              if ( error ){
                console.log(error.message);
                return;
              }
              else {
                console.log(`Container ${utils.toUtf8(cnr).replace(/\0/g, '')}`);
              }
            })
          }
        })
      }
    }
  })
}


addContainers(10)
.then(function(){
  reportContainers();
})
.catch(function(error){
  console.log(`Error: ${error.message}`);
})
