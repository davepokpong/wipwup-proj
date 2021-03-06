const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer');
const exec = require('child_process').exec;

let playlist;
let index=0;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

app.get('/', function (req, res) {
    // res.sendFile(__dirname + '/main.html');
    const playbgsong_script = exec("cd sh; sh playbgsound.sh");
    playbgsong_script.stdout.on('data', (data)=>{
        console.log(data); 
    });
    playbgsong_script.stderr.on('data', (data)=>{
        console.error(data);
    });

    res.sendFile(__dirname + '/main.html');
});

app.get('/returnbtn', function (req, res) {
    res.sendFile(__dirname + '/main.html');
});

app.get('/chk', function (req, res) {
    res.json({
        message: 'WELCOME',
        status: 'Ready!'
    });
});

var upload = multer({ storage: storage });

function clearName(namefile) {
    var clearly = namefile.split(".");
    console.log(clearly);
    return clearly[0];
}

app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    // console.log(files.length)
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    // res.send(files);
    // console.log(files);
    playlist = files;
    // console.log(playlist);
    res.sendFile(__dirname + '/submitsuccess.html');
});

app.get('/filename', function (req, res){
    res.send(playlist);
});

app.get('/play', (req, res) => {
    var textname;
    console.log("Playing!");
    playlist.forEach(namequeue => {
        textname += namequeue.filename+' ';
    });
    textname = textname.slice(9);
    console.log(textname);
    
    // const myShellScript = exec(`echo ${playlist[index].originalname}`);
    const myShellScript = exec(`sudo killall mpg123; cd uploads; mpg123 ${textname}`);
    myShellScript.stdout.on('data', (data)=>{
        console.log(data); 
    });
    myShellScript.stderr.on('data', (data)=>{
        console.error(data);
    });
    res.json({
        status: 'playing'
    });
});

// app.get('/playled', (req, res) => {
//     console.log("fetch /playled")
//     res.json({led_status: 1});
// });

// app.get('/stopled', (req, res) => {
//     console.log("fetch /stopped")
//     res.json({led_status: 0});
// });

app.get('/stop', (req, res) => {
    console.log("stop music");
    const pause_script = exec('sudo killall mpg123');
    res.json({
        status: 'Stop!'
    });
});

app.get('/clear_dir', (req, res) => {
    const rm_script = exec("cd sh; sh cleardir.sh");
    rm_script.stdout.on('data', (data)=>{
        console.log(data); 
    });
    rm_script.stderr.on('data', (data)=>{
        console.error(data);
    });
    res.json({
        status: 'clear directory'
    });
});

app.get('/percss', (req, res) => {
    res.sendFile(__dirname + '/style.css')
});

app.get('/submitcss', (req, res) => {
    res.sendFile(__dirname + '/submitstyle.css')
})

app.get('/bgvideo', (req, res) => {
    res.sendFile(__dirname + '/bg-version2.3.mp4')
})

app.listen(3000, () => console.log('Server started on port 3000'));
