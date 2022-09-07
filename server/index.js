const express = require('express')
const sesrverless = require('serverless-http')
const body = require('body-parser')
const e = require('../main')
const app = express()
const router = express.Router()
const fs = require('fs')
let qrcode = require('qrcode')
const port = process.env.PORT | 3000;

let db = {}
fs.writeFile('../db/db.json',JSON.stringify(db),(err)=>{})

router.use(express.static("views"))
router.use(body.raw())
router.use(body.json())
router.use(body.urlencoded({extended:true}))

router.get('/', (req, res, next) => {
	let re = fs.readFileSync(__dirname + '/../views/public/index.html',()=>{})
	res.send((''+re).replace('#{id}',e.create()))
});
router.post('/qr', async (req,res)=>{
	let qr = await e.get(req.body.id)
	if(qr == 'error'|| !qr) res.end('error')
	else{
		res.setHeader('content-type','image/png')
		res.send(await qrcode.toBuffer(qr))
	}
})
router.get('/qr', async (req,res)=>{
res.end('404 : method not true')
})

router.get('*', (req, res, next) => {
	res.send('Sorry, page not found');
	next();
});

app.use('/.netlify/functions/server',router)
module.exports = app
module.exports.handler = sesrverless(app)
