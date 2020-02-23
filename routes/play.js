var express = require('express');
var router = express.Router();

var play_controller = require('../controllers/playController');


router.get('/practiceLoop', play_controller.practiceLoopGet);


router.post('/loadWordsAndStats', play_controller.loadWordsAndStats);


router.post('/updateStat', play_controller.updateStat);


router.get('/settings', play_controller.settingGet);



//router.post('/practiceLoop', );


module.exports = router;