banner: "'use strict';\n"

var express = require('express');
var app = express();
var http = require('http');
var request = require('request');
var concat = require('concat-stream');
var async = require('async');
//var diagnosisInfo=require('../../config/diagnosis');


var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/diagnosis', function(req, res) {

    /*    var sex = req.body.sex;
     var age = req.body.age;*/
    var symptom= req.body.symptom;

    getsymptomIds(symptom);


    /*function getDiag(sex, age, symptom){
     request({
     url: 'https://api.infermedica.com/v2/search?phrase='+symptom+'',
     method: 'GET',
     headers: {
     'app_id':'ff164b9d',
     'app_key':'20bbc1c814b429760c103cd95687ce3d',
     'content-type' : 'application/json'
     }
     }, function(error, response, body){
     if(error) {
     console.log(error);
     } else {

     var fixedResponse = response.body.replace(/\\'/g, "'");
     var jsonObj = JSON.parse(fixedResponse);
     var id = jsonObj[0].id;

     final(id,sex,age);
     }
     });
     }
     */
    /*function final(id,sex,age){
     var sex = sex;
     var age = age;
     request({
     url: 'https://api.infermedica.com/v2/diagnosis',
     method: 'POST',
     headers: {
     'app_id':'ff164b9d',
     'app_key':'20bbc1c814b429760c103cd95687ce3d',
     'content-type' : 'application/json'
     },
     json:{
     "sex": sex, "age": age, "evidence": [{ "id": id, "choice_id": "present"}]
     }
     }, function(error, response, body){
     var array = [];
     if(error) {
     console.log(error);
     } else {
     for(var i=0; i<body.conditions.length;i++){
     var diease = body.conditions[i].name
     array.push(diease);
     }
     var output = "It has a high tendency of having "
     if(array.length>=5){
     var arraylength = 5;
     }else{
     var arraylength = array.length;
     }
     for(var i=0;i<arraylength;i++){
     if(i==arraylength-1){
     output = output+array[i];
     }
     else{
     output = output+array[i]+', ';
     }
     }
     console.log(output);
     res.json(output);
     }
     });
     }
     });*/




    /**
     * Gets the Diagnisis of the user's symptoms
     *
     * @param symptom
     * @returns {Promise}
     */

    function getsymptomIds(symptomsText) {

        var symptomsText = symptomsText;
        console.log("initial text:  "+symptomsText);
        //var symptoms = ['toothache', 'headache', 'muscle pain', 'diarrhea'];
        //var symtomText = 'toothache ,headache ,muscle pain  ';

        //var splitted =symptomsText.split(/and|\s,|,|\sa\s|\san\s|./);
        var splitted =symptomsText.split(/and|\s,|,/);
        console.log("splitted array : "+splitted);

        // console.log('splited:'+splited[2]+'dd');
        // console.log('splited:'+splited[2].trim()+'dd');
        // console.log('splited:'+splited+'dd');
        for (var i =0; splitted.length<i; i++) {
            splitted[i] = splitted[i].trim();
            console.log("sentence: "+i+" : "+splitted[i]);

        };
        console.log("splitted.length: "+splitted.length);
        splitted = splitted.filter(Boolean);
        console.log("after trimming splitted.length: "+splitted.length);
        var symptomIds = [];
        var symptoms = splitted;


        console.log("symtom arry: "+symptoms);

        var i = 0;
        var rej = 0;
        return new Promise(function (resolve, reject) {
            try{
                symptoms.forEach(function (item) {
                    getDiseases(item.trim()).then(

                        function (id) {
                            if(id==null){
                                console.log("rejected "+ i + ': ' + id);
                                rej++;
                            }else {
                                console.log('disease id: ' + i + ': ' + id);
                                symptomIds.push(id);
                                i++;
                            }
                            if((symptoms.length-rej)===0){

                                var errresponse  = {
                                    message: 'Please contact a physician asap'
                                };
                                resolve(errresponse);
                            }
                            else{
                                if ((symptoms.length-rej) === i) {
                                    resolve(getFromInferMedica(symptomIds));
                                }
                            }
                        }, function (err) {
                            console.log(err);
                        }
                    ).catch(function (err) {
                        res.json({message: 'Please contact a physician asap'});
                    });


                });
            }catch(err){
                reject(err);
            }
        });
    }




    //kelumj@nelus.com
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    function getFromInferMedica(id){

        /*var sex = diagnosisInfo.sex;
        var age = diagnosisInfo.age;*/
           console.log("inside getinfer");     
        sex = 'male';
        age = '25';

        var json1 = new Object();
        json1.sex = sex;
        json1.age = age;
        json1.evidence = [];

        id.forEach(function(symptomId){
            var str =  {
                "id": symptomId,
                "choice_id": "present"
            };
            json1.evidence.push(str);
        });

        return new Promise(function (resolve, reject) {
            request({
                url: 'https://api.infermedica.com/v2/diagnosis',
                method: 'POST',
                headers: {
                    'app_id':'ff164b9d',
                    'app_key':'20bbc1c814b429760c103cd95687ce3d',
                    'content-type' : 'application/json'
                },
                json: json1
            }, function(error, response, body){
                var array = [];
                if(error) {
                    reject(error);
                } else {

                    if(body.conditions.length===0){
                        var response = {
                            message: 'Please contact a physician asap'
                        };
                        resolve(response);
                    }else{
                        for (var i = 0; i < body.conditions.length; i++) {
                            var diease = body.conditions[i].name
                            array.push(diease);
                        }
                        var output = "There is a high tendency of having ";
                        if (array.length >= 5) {
                            var arraylength = 5;
                        } else {
                            var arraylength = array.length;
                        }
                        for (var i = 0; i < arraylength; i++) {
                            if (i == arraylength - 1) {
                                output = output + array[i];
                            }
                            else {
                                output = output + array[i] + ', ';
                            }
                        }
                        output = output + '. Would you like to make an appointment?';
                        var response = {
                            message: output
                        };
                        res.json(response);
                    }

                }
            })});

    }





    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    function getDiseases(symptom) {
        
        console.log("successfully executed 2!")


        var sex = 'male';
        var age = '25';
        var symptom = symptom;

        return new Promise(function (resolve, reject) {

            request({
                url: 'https://api.infermedica.com/v2/search?phrase=' + symptom + '',
                method: 'GET',
                headers: {
                    'app_id': 'aece1c51',
                    'app_key': 'c6504ac58f5486408f72da5c02e8b8e7',
                    'content-type': 'application/json'
                }
            }, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {

                    var fixedResponse = response.body.replace(/\\'/g, "'");
                    var jsonObj = JSON.parse(fixedResponse);

                    if (JSON.stringify(jsonObj) === '[]') {


                        resolve(null);

                    } else {



                        var id = jsonObj[0].id;
                        resolve(id);
                    }
                }
            })
        });
    }
});

app.listen(3000, function() {
    console.log('Server listening on port 3000');
});